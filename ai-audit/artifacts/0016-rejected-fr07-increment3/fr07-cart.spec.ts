import { expect, test } from '@playwright/test';
import type {
  APIRequestContext,
  APIResponse,
  Page,
} from '@playwright/test';
import {
  CartPage,
  displayedCurrencyAmountPattern,
  hasDisplayedThousandsSeparator,
} from '../pages/cart.page.js';
import { CatalogPage } from '../pages/catalog.page.js';
import { ProductDetailPage } from '../pages/product-detail.page.js';
import { loadJsonFile } from '../support/data-loader.js';
import type { Fr07CartData } from '../support/data-loader.js';

const data = loadJsonFile<Fr07CartData>('tests/data/fr07-cart.json');
const populatedCartTwoProductsCase = data.populated_cart_two_products;
const cartInvalidAuthenticationCase = data.cart_invalid_authentication;
const sameProductUiAdditionCase = data.same_product_ui_addition;
const quantityIncrementCase = data.quantity_increment;
const quantityDecrementAboveMinimumCase =
  data.quantity_decrement_above_minimum;
const deletableItemCase = data.deletable_item;
const deletionCancelCase = data.deletion_cancel;
const deletionConfirmCase = data.deletion_confirm;
const cartNavigationCase = data.cart_navigation;
const cartTotalFormattingCase = data.cart_total_formatting;
const emptyCartCase = data.empty_cart;
const productDetailAddToCartCase = data.product_detail_add_to_cart;

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function assertCurrentPath(page: Page, expectedPath: string): Promise<void> {
  await expect(page).toHaveURL(
    new RegExp(`${escapeRegularExpression(expectedPath)}(?:[?#].*)?$`),
  );
}

function absoluteApiUrl(apiBaseUrl: string, endpoint: string): string {
  return `${apiBaseUrl.replace(/\/$/u, '')}/${endpoint.replace(/^\//u, '')}`;
}

async function responseBody(response: APIResponse): Promise<unknown> {
  const text = await response.text();

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function responseDiagnostics(
  response: APIResponse,
  body: unknown,
): string {
  return `status: ${response.status()}; body: ${JSON.stringify(body)}`;
}

function requestHeaders(
  headerName: string,
  authorizationHeader: string | null,
): Record<string, string> | undefined {
  if (authorizationHeader === null) {
    return undefined;
  }

  return { [headerName]: authorizationHeader };
}

async function authenticatedCartSnapshot(
  request: APIRequestContext,
  cartUrl: string,
  headerName: string,
  authorizationHeader: string,
  expectedSuccessful: boolean,
  snapshotName: string,
): Promise<unknown> {
  const response = await request.get(cartUrl, {
    headers: requestHeaders(headerName, authorizationHeader),
  });
  const body = await responseBody(response);

  expect(
    response.ok(),
    `${snapshotName}; ${responseDiagnostics(response, body)}`,
  ).toBe(expectedSuccessful);

  return body;
}

test.describe('FR-07 shopping cart — reviewed increment 1', () => {
  test(`${populatedCartTwoProductsCase.id} ${populatedCartTwoProductsCase.title}`, async ({
    page,
  }) => {
    test.slow();
    const testCase = populatedCartTwoProductsCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);
    const productNames = testCase.products.map((product) => product.name);

    expect(productNames).toHaveLength(testCase.expected.counts.distinctProducts);
    expect(new Set(productNames).size).toBe(
      testCase.expected.counts.distinctProducts,
    );

    await catalog.goto(testCase.paths.home);
    for (const product of testCase.products) {
      for (
        let activation = 0;
        activation < testCase.expected.counts.addActionsPerProduct;
        activation += 1
      ) {
        await catalog.addProductOnce(
          product.name,
          testCase.navigation.addToCartButton,
        );
      }
    }
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    await expect.soft(cart.table).toBeVisible();
    await expect.soft(cart.allLevelOneHeadings).toHaveCount(
      testCase.expected.counts.levelOneHeadings,
    );
    await expect.soft(
      cart.descriptiveHeading(testCase.expected.heading),
    ).toBeVisible();

    for (const columnLabel of Object.values(testCase.expected.columns)) {
      await expect.soft(
        cart.columnHeader(columnLabel),
        `Required cart column ${JSON.stringify(columnLabel)}`,
      ).toBeVisible();
    }

    await expect.soft(cart.dataRows()).toHaveCount(
      testCase.expected.counts.rows,
    );

    for (const product of testCase.products) {
      const matchingRows = cart.productRows(product.name);
      await expect.soft(
        matchingRows,
        `${product.name} must occupy exactly one cart row`,
      ).toHaveCount(testCase.expected.counts.rowsPerProduct);

      const row = cart.productRow(product.name);
      const displayedUnitPrice = await cart.unitPriceText(
        row,
        testCase.expected.columns,
      );
      const displayedLineAmount = await cart.lineAmountText(
        row,
        testCase.expected.columns,
      );

      expect.soft(await cart.quantity(row, testCase.expected.columns)).toBe(
        product.quantity,
      );
      expect.soft(displayedUnitPrice).toContain(
        testCase.expected.currency.symbol,
      );
      expect.soft(
        !testCase.expected.currency.requireThousandsSeparator ||
          hasDisplayedThousandsSeparator(displayedUnitPrice),
        `${product.name} unit price must display a thousands separator`,
      ).toBe(true);
      expect.soft(
        await cart.unitPrice(
          row,
          testCase.expected.columns,
          testCase.expected.currency,
        ),
      ).toBe(product.unitPrice);
      expect.soft(displayedLineAmount).toContain(
        testCase.expected.currency.symbol,
      );
      expect.soft(
        !testCase.expected.currency.requireThousandsSeparator ||
          hasDisplayedThousandsSeparator(displayedLineAmount),
        `${product.name} line amount must display a thousands separator`,
      ).toBe(true);
      expect.soft(
        await cart.lineAmount(
          row,
          testCase.expected.columns,
          testCase.expected.currency,
        ),
      ).toBe(product.unitPrice * product.quantity);
      await expect.soft(
        cart.incrementButton(row, testCase.expected.controls.increment),
      ).toHaveCount(testCase.expected.counts.incrementControlsPerRow);
      await expect.soft(
        cart.decrementButton(row, testCase.expected.controls.decrement),
      ).toHaveCount(testCase.expected.counts.decrementControlsPerRow);
    }
  });

  test(`${cartInvalidAuthenticationCase.id} ${cartInvalidAuthenticationCase.title}`, async ({
    request,
  }) => {
    const testCase = cartInvalidAuthenticationCase;
    const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';
    const loginUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.login);
    const cartUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.cart);

    expect(testCase.tokenPartitions).toHaveLength(
      testCase.expected.tokenPartitionCount,
    );

    const loginResponse = await request.post(loginUrl, {
      data: testCase.loginCredentials,
    });
    const loginBody = await responseBody(loginResponse);
    expect(
      loginResponse.ok(),
      `Dedicated-user login; ${responseDiagnostics(loginResponse, loginBody)}`,
    ).toBe(testCase.expected.loginSuccessful);

    const loginRecord = loginBody as Record<string, unknown>;
    const validToken = loginRecord[testCase.expected.tokenProperty];
    expect(
      typeof validToken,
      `Dedicated-user login must return ${testCase.expected.tokenProperty}; ${responseDiagnostics(loginResponse, loginBody)}`,
    ).toBe('string');
    if (typeof validToken !== 'string') {
      throw new Error('A valid baseline token was not available.');
    }

    const validAuthorizationHeader =
      `${testCase.headers.bearerScheme} ${validToken}`;
    const baselineCart = await authenticatedCartSnapshot(
      request,
      cartUrl,
      testCase.headers.authorization,
      validAuthorizationHeader,
      testCase.expected.baselineGetSuccessful,
      'Baseline authenticated cart GET',
    );
    let rejectionResponseCount = 0;

    for (const partition of testCase.tokenPartitions) {
      await test.step(
        `${partition.name} (${partition.tokenClass}) GET`,
        async () => {
          const response = await request.get(cartUrl, {
            headers: requestHeaders(
              testCase.headers.authorization,
              partition.authorizationHeader,
            ),
          });
          const body = await responseBody(response);
          rejectionResponseCount += 1;
          expect.soft(
            response.ok(),
            `${partition.name} GET must be rejected; ${responseDiagnostics(response, body)}`,
          ).toBe(false);
        },
      );

      await test.step(
        `${partition.name} (${partition.tokenClass}) POST`,
        async () => {
          const response = await request.post(cartUrl, {
            headers: requestHeaders(
              testCase.headers.authorization,
              partition.authorizationHeader,
            ),
            data: testCase.postRequestBody,
          });
          const body = await responseBody(response);
          rejectionResponseCount += 1;
          expect.soft(
            response.ok(),
            `${partition.name} POST must be rejected; ${responseDiagnostics(response, body)}`,
          ).toBe(false);
        },
      );
    }

    expect(rejectionResponseCount).toBe(
      testCase.expected.rejectionResponseCount,
    );
    expect(rejectionResponseCount).toBe(
      testCase.tokenPartitions.length *
        testCase.expected.requestsPerPartition,
    );

    const finalCart = await authenticatedCartSnapshot(
      request,
      cartUrl,
      testCase.headers.authorization,
      validAuthorizationHeader,
      testCase.expected.finalGetSuccessful,
      'Final authenticated cart GET',
    );
    expect(finalCart).toEqual(baselineCart);
  });

  test(`${sameProductUiAdditionCase.id} ${sameProductUiAdditionCase.title}`, async ({
    page,
  }) => {
    const testCase = sameProductUiAdditionCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);

    await catalog.goto(testCase.paths.home);
    for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
      await catalog.addProductOnce(
        testCase.product.name,
        testCase.navigation.addToCartButton,
      );
    }
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);
    await expect(cart.productRows(testCase.product.name)).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );

    const row = cart.productRow(testCase.product.name);
    const displayedQuantity = await cart.quantity(
      row,
      testCase.expected.columns,
    );
    const displayedUnitPrice = await cart.unitPrice(
      row,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const displayedLineAmount = await cart.lineAmount(
      row,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const displayedLineAmountSum = await cart.sumDisplayedLineAmounts(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const displayedCartTotal = await cart.cartTotal(
      testCase.expected.totalLabel,
      testCase.expected.currency,
    );

    expect(displayedQuantity).toBe(testCase.product.quantity);
    expect(displayedUnitPrice).toBe(testCase.product.unitPrice);
    expect(displayedLineAmount).toBe(
      testCase.product.unitPrice * testCase.product.quantity,
    );
    expect(displayedCartTotal).toBe(displayedLineAmountSum);
    expect(displayedCartTotal).toBe(displayedLineAmount);
  });

  test(`${quantityIncrementCase.id} ${quantityIncrementCase.title}`, async ({
    page,
  }) => {
    const testCase = quantityIncrementCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);

    await catalog.goto(testCase.paths.home);
    for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
      await catalog.addProductOnce(
        testCase.product.name,
        testCase.navigation.addToCartButton,
      );
    }
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    const dataRows = cart.dataRows();
    await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
    const beforeRowCount = await dataRows.count();
    await expect(cart.productRows(testCase.product.name)).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );

    const selectedRow = cart.productRow(testCase.product.name);
    const incrementButton = cart.incrementButton(
      selectedRow,
      testCase.expected.controls.increment,
    );
    await expect(incrementButton).toHaveCount(
      testCase.expected.counts.incrementControlsForProduct,
    );
    await expect(incrementButton).toBeVisible();

    const beforeQuantity = await cart.quantity(
      selectedRow,
      testCase.expected.columns,
    );
    const beforeLineAmount = await cart.lineAmount(
      selectedRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const beforeLineAmountSum = await cart.sumDisplayedLineAmounts(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const beforeCartTotal = await cart.cartTotal(
      testCase.expected.totalLabel,
      testCase.expected.currency,
    );

    expect(beforeQuantity).toBe(testCase.product.initialQuantity);
    expect(beforeLineAmount).toBe(
      testCase.product.unitPrice * testCase.product.initialQuantity,
    );
    expect(beforeCartTotal).toBe(beforeLineAmountSum);

    await incrementButton.click();

    const afterRowCount = await cart.dataRows().count();
    const afterQuantity = await cart.quantity(
      selectedRow,
      testCase.expected.columns,
    );
    const afterLineAmount = await cart.lineAmount(
      selectedRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const afterLineAmountSum = await cart.sumDisplayedLineAmounts(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const afterCartTotal = await cart.cartTotal(
      testCase.expected.totalLabel,
      testCase.expected.currency,
    );

    expect(afterRowCount).toBe(beforeRowCount);
    expect(afterQuantity).toBe(beforeQuantity + 1);
    expect(afterQuantity).toBe(testCase.product.incrementedQuantity);
    expect(afterLineAmount).toBe(
      testCase.product.unitPrice * testCase.product.incrementedQuantity,
    );
    expect(afterLineAmount - beforeLineAmount).toBe(testCase.product.unitPrice);
    expect(afterLineAmountSum - beforeLineAmountSum).toBe(
      afterLineAmount - beforeLineAmount,
    );
    expect(afterCartTotal).toBe(afterLineAmountSum);
    expect(afterCartTotal - beforeCartTotal).toBe(
      afterLineAmount - beforeLineAmount,
    );
  });
});

test.describe('FR-07 shopping cart — increment 2', () => {
  test(`${quantityDecrementAboveMinimumCase.id} ${quantityDecrementAboveMinimumCase.title}`, async ({
    page,
  }) => {
    const testCase = quantityDecrementAboveMinimumCase;
    const catalog = new CatalogPage(page);
    const productDetail = new ProductDetailPage(page);
    const cart = new CartPage(page);

    expect(testCase.targetProduct.id).not.toBe(testCase.comparisonProduct.id);
    expect(testCase.targetProduct.name).not.toBe(
      testCase.comparisonProduct.name,
    );

    await catalog.goto(testCase.paths.home);
    await expect(
      catalog.productDetailLink(
        testCase.targetProduct.name,
        testCase.navigation.productDetailLink,
      ),
    ).toBeVisible();
    await catalog.openProductDetail(
      testCase.targetProduct.name,
      testCase.navigation.productDetailLink,
    );
    await assertCurrentPath(page, testCase.paths.productDetail);

    await expect(
      productDetail.productHeading(testCase.targetProduct.name),
    ).toBeVisible();
    await expect(
      productDetail.quantityLabel(
        testCase.targetProduct.name,
        testCase.navigation.quantityLabel,
      ),
    ).toBeVisible();
    const detailQuantityInput = productDetail.quantityInput(
      testCase.targetProduct.name,
    );
    await expect(detailQuantityInput).toBeVisible();
    await productDetail.setQuantity(
      testCase.targetProduct.name,
      testCase.targetProduct.initialQuantity,
    );
    await expect(detailQuantityInput).toHaveValue(
      String(testCase.targetProduct.initialQuantity),
    );

    const detailAddButton = productDetail.addToCartButton(
      testCase.targetProduct.name,
      testCase.navigation.productDetailAddToCartButton,
    );
    await expect(detailAddButton).toBeVisible();
    await productDetail.addToCartOnce(
      testCase.targetProduct.name,
      testCase.navigation.productDetailAddToCartButton,
    );

    await productDetail.openHome(testCase.navigation.homeLink);
    await assertCurrentPath(page, testCase.paths.home);
    const comparisonAddButton = catalog.addToCartButton(
      testCase.comparisonProduct.name,
      testCase.navigation.homeAddToCartButton,
    );
    await expect(comparisonAddButton).toBeVisible();
    await catalog.addProductOnce(
      testCase.comparisonProduct.name,
      testCase.navigation.homeAddToCartButton,
    );
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    const dataRows = cart.dataRows();
    await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
    await expect(cart.productRows(testCase.targetProduct.name)).toHaveCount(
      testCase.expected.counts.rowsForTargetProduct,
    );
    await expect(
      cart.productRows(testCase.comparisonProduct.name),
    ).toHaveCount(testCase.expected.counts.rowsForComparisonProduct);

    const targetRow = cart.productRow(testCase.targetProduct.name);
    const comparisonRow = cart.productRow(testCase.comparisonProduct.name);
    const targetQuantityCell = cart.quantityCell(
      targetRow,
      testCase.expected.columns,
    );
    const comparisonQuantityCell = cart.quantityCell(
      comparisonRow,
      testCase.expected.columns,
    );
    const targetLineAmountCell = cart.lineAmountCell(
      targetRow,
      testCase.expected.columns,
    );
    const comparisonLineAmountCell = cart.lineAmountCell(
      comparisonRow,
      testCase.expected.columns,
    );
    const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
    const decrementButton = cart.decrementButton(
      targetRow,
      testCase.expected.controls.decrement,
    );

    await expect(targetQuantityCell).toHaveText(
      String(testCase.targetProduct.initialQuantity),
    );
    await expect(comparisonQuantityCell).toHaveText(
      String(testCase.comparisonProduct.quantity),
    );
    await expect(targetLineAmountCell).toBeVisible();
    await expect(comparisonLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(targetLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.targetProduct.initialLineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(comparisonLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.comparisonProduct.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.initialTotal,
        testCase.expected.currency,
      ),
    );
    await expect(decrementButton).toHaveCount(
      testCase.expected.counts.decrementControlsForTargetProduct,
    );
    await expect(decrementButton).toBeVisible();

    const beforeCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const beforeTarget = await cart.readRowState(
      testCase.targetProduct.name,
      targetRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const beforeComparison = await cart.readRowState(
      testCase.comparisonProduct.name,
      comparisonRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );

    expect(beforeTarget.quantity).toBe(testCase.targetProduct.initialQuantity);
    expect(beforeTarget.lineAmount).toBe(
      testCase.targetProduct.initialLineAmount,
    );
    expect(beforeComparison.quantity).toBe(
      testCase.comparisonProduct.quantity,
    );
    expect(beforeComparison.lineAmount).toBe(
      testCase.comparisonProduct.lineAmount,
    );
    expect(beforeCart.total).toBe(testCase.expected.initialTotal);
    expect(beforeCart.total).toBe(beforeCart.lineAmountSum);

    await decrementButton.click();

    await expect(dataRows).toHaveCount(
      beforeCart.rowCount + testCase.expected.deltas.rowCount,
    );
    await expect(targetQuantityCell).toHaveText(
      String(testCase.targetProduct.finalQuantity),
    );
    await expect(comparisonQuantityCell).toHaveText(
      String(testCase.comparisonProduct.quantity),
    );
    await expect(targetLineAmountCell).toBeVisible();
    await expect(comparisonLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(targetLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.targetProduct.finalLineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(comparisonLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.comparisonProduct.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.finalTotal,
        testCase.expected.currency,
      ),
    );

    const afterCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const afterTarget = await cart.readRowState(
      testCase.targetProduct.name,
      targetRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const afterComparison = await cart.readRowState(
      testCase.comparisonProduct.name,
      comparisonRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );

    expect(afterTarget.quantity).toBe(testCase.targetProduct.finalQuantity);
    expect(afterTarget.quantity - beforeTarget.quantity).toBe(
      testCase.expected.deltas.targetQuantity,
    );
    expect(afterTarget.lineAmount).toBe(testCase.targetProduct.finalLineAmount);
    expect(afterTarget.lineAmount - beforeTarget.lineAmount).toBe(
      testCase.expected.deltas.targetLineAmount,
    );
    expect(afterTarget.lineAmount).toBe(
      beforeTarget.lineAmount - testCase.targetProduct.unitPrice,
    );
    expect(afterComparison.quantity - beforeComparison.quantity).toBe(
      testCase.expected.deltas.comparisonQuantity,
    );
    expect(afterComparison.lineAmount - beforeComparison.lineAmount).toBe(
      testCase.expected.deltas.comparisonLineAmount,
    );
    expect(afterCart.total).toBe(testCase.expected.finalTotal);
    expect(afterCart.total - beforeCart.total).toBe(
      testCase.expected.deltas.cartTotal,
    );
    expect(afterCart.total).toBe(
      beforeCart.total - testCase.targetProduct.unitPrice,
    );
    expect(afterCart.total).toBe(afterCart.lineAmountSum);
  });

  test(`${deletableItemCase.id} ${deletableItemCase.title}`, async ({
    page,
  }) => {
    const testCase = deletableItemCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);

    await catalog.goto(testCase.paths.home);
    const addButton = catalog.addToCartButton(
      testCase.product.name,
      testCase.navigation.addToCartButton,
    );
    await expect(addButton).toBeVisible();
    await catalog.addProductOnce(
      testCase.product.name,
      testCase.navigation.addToCartButton,
    );
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    const dataRows = cart.dataRows();
    await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
    await expect(cart.productRows(testCase.product.name)).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );
    const targetRow = cart.productRow(testCase.product.name);
    const targetQuantityCell = cart.quantityCell(
      targetRow,
      testCase.expected.columns,
    );
    const targetLineAmountCell = cart.lineAmountCell(
      targetRow,
      testCase.expected.columns,
    );
    const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
    const deleteButton = cart.deleteButton(targetRow, testCase.actions.delete);

    await expect(targetQuantityCell).toHaveText(
      String(testCase.product.quantity),
    );
    await expect(targetLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(targetLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.product.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.total,
        testCase.expected.currency,
      ),
    );
    await expect(deleteButton).toHaveCount(
      testCase.expected.counts.deleteActionsForProduct,
    );
    await expect(deleteButton).toBeVisible();
    expect(await cart.dangerousActionColorCategory(deleteButton)).toBe(
      testCase.expected.dangerousColorCategory,
    );

    const baselineCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const baselineTarget = await cart.readRowState(
      testCase.product.name,
      targetRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    expect(baselineTarget.quantity).toBe(testCase.product.quantity);
    expect(baselineTarget.lineAmount).toBe(testCase.product.lineAmount);
    expect(baselineCart.total).toBe(testCase.expected.total);
    expect(baselineCart.total).toBe(baselineCart.lineAmountSum);

    await deleteButton.click();

    const dialog = cart.confirmationDialog();
    await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
    await expect(dialog).toBeVisible();
    await expect(dataRows).toHaveCount(baselineCart.rowCount);
    await expect(cart.productRows(testCase.product.name)).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );
    await expect(targetQuantityCell).toHaveText(
      String(baselineTarget.quantity),
    );
    await expect(targetLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(targetLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.product.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.total,
        testCase.expected.currency,
      ),
    );

    const awaitingDecisionCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const awaitingDecisionTarget = await cart.readRowState(
      testCase.product.name,
      targetRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    expect(awaitingDecisionCart).toEqual(baselineCart);
    expect(awaitingDecisionTarget).toEqual(baselineTarget);

    const dismissAction = cart.semanticDialogAction(
      dialog,
      testCase.actions.dismiss,
    );
    await expect(dismissAction).toHaveCount(
      testCase.expected.counts.dismissActions,
    );
    await expect(dismissAction).toBeVisible();
    await dismissAction.click();
    await expect(dialog).toBeHidden();
    await expect(dataRows).toHaveCount(baselineCart.rowCount);
    await expect(cart.productRows(testCase.product.name)).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );
    await expect(targetQuantityCell).toHaveText(
      String(baselineTarget.quantity),
    );
    await expect(targetLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.product.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.total,
        testCase.expected.currency,
      ),
    );
    expect(
      await cart.readCartStateFromSummary(
        testCase.expected.columns,
        testCase.expected.currency,
      ),
    ).toEqual(baselineCart);
  });

  test(`${deletionCancelCase.id} ${deletionCancelCase.title}`, async ({
    page,
  }) => {
    const testCase = deletionCancelCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);

    await catalog.goto(testCase.paths.home);
    const addButton = catalog.addToCartButton(
      testCase.product.name,
      testCase.navigation.addToCartButton,
    );
    await expect(addButton).toBeVisible();
    await catalog.addProductOnce(
      testCase.product.name,
      testCase.navigation.addToCartButton,
    );
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    const dataRows = cart.dataRows();
    await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
    await expect(cart.productRows(testCase.product.name)).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );
    const targetRow = cart.productRow(testCase.product.name);
    const targetQuantityCell = cart.quantityCell(
      targetRow,
      testCase.expected.columns,
    );
    const targetLineAmountCell = cart.lineAmountCell(
      targetRow,
      testCase.expected.columns,
    );
    const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
    const deleteButton = cart.deleteButton(targetRow, testCase.actions.delete);

    await expect(targetQuantityCell).toHaveText(
      String(testCase.product.quantity),
    );
    await expect(targetLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(targetLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.product.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.total,
        testCase.expected.currency,
      ),
    );
    await expect(deleteButton).toHaveCount(
      testCase.expected.counts.deleteActionsForProduct,
    );
    await expect(deleteButton).toBeVisible();

    const baselineCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const baselineTarget = await cart.readRowState(
      testCase.product.name,
      targetRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    expect(baselineTarget.quantity).toBe(testCase.product.quantity);
    expect(baselineTarget.lineAmount).toBe(testCase.product.lineAmount);
    expect(baselineCart.total).toBe(testCase.expected.total);
    expect(baselineCart.lineAmountSum).toBe(testCase.expected.lineAmountSum);
    expect(baselineCart.total).toBe(baselineCart.lineAmountSum);

    await deleteButton.click();
    const dialog = cart.confirmationDialog();
    await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
    await expect(dialog).toBeVisible();
    const cancelAction = cart.semanticDialogAction(
      dialog,
      testCase.actions.cancel,
    );
    await expect(cancelAction).toHaveCount(
      testCase.expected.counts.cancelActions,
    );
    await expect(cancelAction).toBeVisible();
    await cancelAction.click();

    await expect(dialog).toBeHidden();
    await expect(dataRows).toHaveCount(baselineCart.rowCount);
    await expect(cart.productRows(testCase.product.name)).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );
    await expect(targetQuantityCell).toHaveText(
      String(baselineTarget.quantity),
    );
    await expect(targetLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(targetLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.product.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.total,
        testCase.expected.currency,
      ),
    );

    const afterCancelCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const afterCancelTarget = await cart.readRowState(
      testCase.product.name,
      targetRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    expect(afterCancelCart).toEqual(baselineCart);
    expect(afterCancelTarget).toEqual(baselineTarget);
  });

  test(`${deletionConfirmCase.id} ${deletionConfirmCase.title}`, async ({
    page,
  }) => {
    const testCase = deletionConfirmCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);
    const selectedProduct = testCase.products.selectedForDeletion;
    const remainingProduct = testCase.products.remaining;

    expect(selectedProduct.id).not.toBe(remainingProduct.id);
    expect(selectedProduct.name).not.toBe(remainingProduct.name);

    await catalog.goto(testCase.paths.home);
    const selectedAddButton = catalog.addToCartButton(
      selectedProduct.name,
      testCase.navigation.addToCartButton,
    );
    await expect(selectedAddButton).toBeVisible();
    await catalog.addProductOnce(
      selectedProduct.name,
      testCase.navigation.addToCartButton,
    );
    const remainingAddButton = catalog.addToCartButton(
      remainingProduct.name,
      testCase.navigation.addToCartButton,
    );
    await expect(remainingAddButton).toBeVisible();
    await catalog.addProductOnce(
      remainingProduct.name,
      testCase.navigation.addToCartButton,
    );
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    const dataRows = cart.dataRows();
    await expect(dataRows).toHaveCount(testCase.expected.counts.initialRows);
    await expect(cart.productRows(selectedProduct.name)).toHaveCount(
      testCase.expected.counts.initialRowsForSelectedProduct,
    );
    await expect(cart.productRows(remainingProduct.name)).toHaveCount(
      testCase.expected.counts.rowsForRemainingProduct,
    );

    const selectedRow = cart.productRow(selectedProduct.name);
    const remainingRow = cart.productRow(remainingProduct.name);
    const selectedQuantityCell = cart.quantityCell(
      selectedRow,
      testCase.expected.columns,
    );
    const remainingQuantityCell = cart.quantityCell(
      remainingRow,
      testCase.expected.columns,
    );
    const selectedLineAmountCell = cart.lineAmountCell(
      selectedRow,
      testCase.expected.columns,
    );
    const remainingLineAmountCell = cart.lineAmountCell(
      remainingRow,
      testCase.expected.columns,
    );
    const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
    const deleteButton = cart.deleteButton(
      selectedRow,
      testCase.actions.delete,
    );

    await expect(selectedQuantityCell).toHaveText(
      String(selectedProduct.quantity),
    );
    await expect(remainingQuantityCell).toHaveText(
      String(remainingProduct.quantity),
    );
    await expect(selectedLineAmountCell).toBeVisible();
    await expect(remainingLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(selectedLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        selectedProduct.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(remainingLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        remainingProduct.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.initialTotal,
        testCase.expected.currency,
      ),
    );
    await expect(deleteButton).toHaveCount(
      testCase.expected.counts.deleteActionsForSelectedProduct,
    );
    await expect(deleteButton).toBeVisible();

    const baselineCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const baselineSelected = await cart.readRowState(
      selectedProduct.name,
      selectedRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const baselineRemaining = await cart.readRowState(
      remainingProduct.name,
      remainingRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    expect(baselineSelected.quantity).toBe(selectedProduct.quantity);
    expect(baselineSelected.lineAmount).toBe(selectedProduct.lineAmount);
    expect(baselineRemaining.quantity).toBe(remainingProduct.quantity);
    expect(baselineRemaining.lineAmount).toBe(remainingProduct.lineAmount);
    expect(baselineCart.total).toBe(testCase.expected.initialTotal);
    expect(baselineCart.lineAmountSum).toBe(
      testCase.expected.initialLineAmountSum,
    );
    expect(baselineCart.total).toBe(baselineCart.lineAmountSum);

    await deleteButton.click();
    const dialog = cart.confirmationDialog();
    await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
    await expect(dialog).toBeVisible();
    const confirmAction = cart.semanticDialogAction(
      dialog,
      testCase.actions.confirm,
    );
    await expect(confirmAction).toHaveCount(
      testCase.expected.counts.confirmActions,
    );
    await expect(confirmAction).toBeVisible();
    await confirmAction.click();

    await expect(dialog).toBeHidden();
    await expect(cart.productRows(selectedProduct.name)).toHaveCount(
      testCase.expected.counts.finalRowsForSelectedProduct,
    );
    await expect(dataRows).toHaveCount(testCase.expected.counts.finalRows);
    await expect(dataRows).toHaveCount(
      baselineCart.rowCount + testCase.expected.deltas.rowCount,
    );
    await expect(cart.productRows(remainingProduct.name)).toHaveCount(
      testCase.expected.counts.rowsForRemainingProduct,
    );
    await expect(remainingQuantityCell).toHaveText(
      String(baselineRemaining.quantity),
    );
    await expect(remainingLineAmountCell).toBeVisible();
    await expect(summaryAmount).toBeVisible();
    await expect(remainingLineAmountCell).toHaveText(
      displayedCurrencyAmountPattern(
        remainingProduct.lineAmount,
        testCase.expected.currency,
      ),
    );
    await expect(summaryAmount).toHaveText(
      displayedCurrencyAmountPattern(
        testCase.expected.finalTotal,
        testCase.expected.currency,
      ),
    );

    const afterConfirmCart = await cart.readCartStateFromSummary(
      testCase.expected.columns,
      testCase.expected.currency,
    );
    const afterConfirmRemaining = await cart.readRowState(
      remainingProduct.name,
      remainingRow,
      testCase.expected.columns,
      testCase.expected.currency,
    );
    expect(afterConfirmRemaining).toEqual(baselineRemaining);
    expect(afterConfirmCart.total).toBe(testCase.expected.finalTotal);
    expect(afterConfirmCart.lineAmountSum).toBe(
      testCase.expected.finalLineAmountSum,
    );
    expect(afterConfirmCart.total - baselineCart.total).toBe(
      testCase.expected.deltas.cartTotal,
    );
    expect(afterConfirmCart.total).toBe(
      baselineCart.total - baselineSelected.lineAmount,
    );
    expect(afterConfirmCart.total).toBe(afterConfirmCart.lineAmountSum);

    const cartBadge = cart.cartBadge(
      testCase.navigation.cartLink,
      testCase.badge.numericTextPattern,
    );
    await expect(cartBadge).toHaveCount(testCase.expected.counts.cartBadges);
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText(
      String(testCase.badge.remainingCartCount),
    );
    expect(
      await cart.cartBadgeCount(
        testCase.navigation.cartLink,
        testCase.badge.numericTextPattern,
      ),
    ).toBe(testCase.badge.remainingCartCount);
  });
});

test.describe('FR-07 shopping cart — reviewed increment 3', () => {
  test(`${cartNavigationCase.id} ${cartNavigationCase.title}`, async ({
    page,
  }) => {
    const testCase = cartNavigationCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);

    await catalog.goto(testCase.paths.home);
    const addButton = catalog.addToCartButton(
      testCase.product.name,
      testCase.navigation.addToCartButton,
    );
    await expect(addButton).toBeVisible();
    for (
      let activation = 0;
      activation < testCase.actionCounts.add;
      activation += 1
    ) {
      await catalog.addProductOnce(
        testCase.product.name,
        testCase.navigation.addToCartButton,
      );
    }
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);
    await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);

    const breadcrumb = cart.semanticBreadcrumb(
      testCase.expected.breadcrumb.currentPageLabel,
    );
    await expect.soft(
      breadcrumb,
      'The cart child page must expose a named semantic breadcrumb with a current-page item.',
    ).toHaveCount(testCase.expected.counts.breadcrumbs);
    await expect.soft(breadcrumb).toBeVisible();

    const cartNavbarLink = cart.cartNavbarLink(
      testCase.navigation.cartLink,
    );
    await expect.soft(cartNavbarLink).toHaveCount(
      testCase.expected.counts.cartNavbarLinks,
    );
    await expect.soft(cartNavbarLink).toBeVisible();
    await expect.soft(cartNavbarLink).toHaveAttribute(
      testCase.expected.navbar.currentStateAttribute,
      testCase.expected.navbar.currentStateValue,
    );

    const requiredLabelLink = cart.requiredContinueShoppingLink(
      testCase.navigation.requiredContinueShoppingLabel,
    );
    await expect.soft(
      requiredLabelLink,
      `Required visible shopping label ${JSON.stringify(testCase.navigation.requiredContinueShoppingLabel)}`,
    ).toHaveCount(testCase.expected.counts.requiredContinueShoppingLinks);
    await expect.soft(requiredLabelLink).toBeVisible();

    const homeDestinationLink = cart.semanticShoppingDestinationLink(
      testCase.navigation.shoppingDestinationMeaningTerms,
    );
    await expect.soft(homeDestinationLink).toHaveCount(
      testCase.expected.counts.homeDestinationLinks,
    );
    await expect.soft(homeDestinationLink).toBeVisible();

    const homeDestinationLinkCount = await homeDestinationLink.count();
    if (
      homeDestinationLinkCount ===
        testCase.expected.counts.homeDestinationLinks &&
      (await homeDestinationLink.isVisible())
    ) {
      expect(testCase.actionCounts.homeDestination).toBe(1);
      await homeDestinationLink.click();
    }

    await expect.soft(
      catalog.homeIdentity(testCase.expected.destinationIdentity.heading),
      'The shopping destination must identify the Home page independently of its URL.',
    ).toBeVisible();
  });

  test(`${cartTotalFormattingCase.id} ${cartTotalFormattingCase.title}`, async ({
    page,
  }) => {
    const testCase = cartTotalFormattingCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);

    await catalog.goto(testCase.paths.home);
    const addButton = catalog.addToCartButton(
      testCase.product.name,
      testCase.navigation.addToCartButton,
    );
    await expect(addButton).toBeVisible();
    for (
      let activation = 0;
      activation < testCase.actionCounts.add;
      activation += 1
    ) {
      await catalog.addProductOnce(
        testCase.product.name,
        testCase.navigation.addToCartButton,
      );
    }
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    const dataRows = cart.dataRows();
    const productRows = cart.productRows(testCase.product.name);
    const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
    const summaryContainer = cart.exactTotalSummaryContainer(
      testCase.expected.currency,
    );

    await expect.soft(dataRows).toHaveCount(testCase.expected.counts.rows);
    await expect.soft(productRows).toHaveCount(
      testCase.expected.counts.rowsForProduct,
    );
    await expect.soft(summaryAmount).toHaveCount(
      testCase.expected.counts.summaryAmounts,
    );
    await expect.soft(summaryAmount).toBeVisible();
    await expect.soft(summaryContainer).toHaveCount(
      testCase.expected.counts.summaryContainers,
    );
    await expect.soft(summaryContainer).toBeVisible();

    if (
      (await summaryAmount.count()) ===
        testCase.expected.counts.summaryAmounts &&
      (await summaryContainer.count()) ===
        testCase.expected.counts.summaryContainers &&
      (await summaryAmount.isVisible()) &&
      (await summaryContainer.isVisible())
    ) {
      const exactTotalLabel = await cart.exactTotalLabelText(
        testCase.expected.currency,
      );
      expect.soft(exactTotalLabel).toBe(testCase.expected.totalLabel);
      expect.soft(exactTotalLabel).not.toBe(
        testCase.expected.forbiddenTotalLabel,
      );
    }

    const rowCount = await dataRows.count();
    if (rowCount === testCase.expected.counts.rows) {
      const rows = await dataRows.all();
      for (const row of rows) {
        await expect.soft(
          cart.lineAmountCell(row, testCase.expected.columns),
        ).toBeVisible();
      }
    }

    if (
      rowCount === testCase.expected.counts.rows &&
      (await summaryAmount.count()) ===
        testCase.expected.counts.summaryAmounts &&
      (await summaryAmount.isVisible())
    ) {
      const displayedTotalText = await summaryAmount.innerText();
      const displayedTotal = await cart.cartSummaryTotal(
        testCase.expected.currency,
      );
      const displayedLineAmountSum = await cart.sumDisplayedLineAmounts(
        testCase.expected.columns,
        testCase.expected.currency,
      );

      expect.soft(displayedTotalText).toContain(
        testCase.expected.currency.symbol,
      );
      expect.soft(
        !testCase.expected.currency.requireThousandsSeparator ||
          hasDisplayedThousandsSeparator(displayedTotalText),
        'The displayed cart total must contain a thousands separator.',
      ).toBe(true);
      expect.soft(displayedTotal).toBe(testCase.expected.total);
      expect.soft(displayedTotal).toBe(displayedLineAmountSum);
    }
  });

  test(`${emptyCartCase.id} ${emptyCartCase.title}`, async ({ page }) => {
    const testCase = emptyCartCase;
    const catalog = new CatalogPage(page);
    const cart = new CartPage(page);

    expect(testCase.initialState.naturalFreshContext).toBe(true);
    expect(testCase.initialState.cartProductRows).toBe(
      testCase.expected.counts.rows,
    );

    await catalog.goto(testCase.paths.home);
    await catalog.openCart(testCase.navigation.cartLink);
    await assertCurrentPath(page, testCase.paths.cart);

    const emptyStateMessage = cart.emptyStateMessage(
      testCase.expected.messageMeaningTerms,
    );
    await expect.soft(
      emptyStateMessage,
      'The empty cart must expose a clear non-empty semantic message.',
    ).toHaveCount(testCase.expected.counts.messages);
    await expect.soft(emptyStateMessage).toBeVisible();

    const emptyStateIllustration = cart.accessibleEmptyStateIllustration();
    await expect.soft(
      emptyStateIllustration,
      'The empty cart must expose an accessible illustration with a meaningful name.',
    ).toHaveCount(testCase.expected.counts.illustrations);
    await expect.soft(emptyStateIllustration).toBeVisible();

    await expect.soft(
      cart.dataRows(),
      'A naturally empty cart must not show a populated product row.',
    ).toHaveCount(testCase.expected.counts.rows);
  });

  test(`${productDetailAddToCartCase.id} ${productDetailAddToCartCase.title}`, async ({
    page,
  }) => {
    const testCase = productDetailAddToCartCase;
    const catalog = new CatalogPage(page);
    const productDetail = new ProductDetailPage(page);
    const cart = new CartPage(page);

    expect(testCase.initialState.naturalFreshContext).toBe(true);
    expect(testCase.initialState.targetProductAbsent).toBe(true);
    expect(testCase.actionCounts.add).toBe(1);

    await catalog.goto(testCase.paths.home);
    const detailLink = catalog.productDetailLink(
      testCase.targetProduct.name,
      testCase.navigation.productDetailLink,
    );
    await expect(detailLink).toHaveCount(
      testCase.expected.counts.productDetailLinks,
    );
    await expect(detailLink).toBeVisible();
    await catalog.openProductDetail(
      testCase.targetProduct.name,
      testCase.navigation.productDetailLink,
    );
    await expect(
      productDetail.productHeading(testCase.targetProduct.name),
    ).toBeVisible();

    const displayedProductImages = productDetail.displayedProductImages(
      testCase.targetProduct.name,
    );
    await expect.soft(displayedProductImages).toHaveCount(
      testCase.expected.counts.productImages,
    );
    const displayedProductImageCount = await displayedProductImages.count();
    for (let index = 0; index < displayedProductImageCount; index += 1) {
      const productImage = displayedProductImages.nth(index);
      await expect.soft(productImage).toBeVisible();
      if (await productImage.isVisible()) {
        const alternativeText = await productImage.getAttribute('alt');
        if (testCase.expected.imageAlt.requireNonEmpty) {
          expect.soft(alternativeText?.trim()).toBeTruthy();
        }
        if (testCase.expected.imageAlt.requireProductIdentity) {
          expect.soft(alternativeText).toContain(testCase.targetProduct.name);
        }
      }
    }

    const initialCartBadge = cart.semanticCartBadge(
      testCase.navigation.cartLink,
      testCase.badge.numericTextPattern,
    );
    await expect.soft(
      initialCartBadge,
      'The Giỏ hàng navigation entry must expose its initial numeric badge.',
    ).toHaveCount(testCase.expected.counts.cartBadges);
    await expect.soft(initialCartBadge).toBeVisible();

    let observedInitialBadgeCount: number | null = null;
    if (
      (await initialCartBadge.count()) ===
        testCase.expected.counts.cartBadges &&
      (await initialCartBadge.isVisible())
    ) {
      observedInitialBadgeCount = await cart.semanticCartBadgeCount(
        initialCartBadge,
      );
      expect.soft(observedInitialBadgeCount).toBe(
        testCase.initialState.cartBadgeCount,
      );
    }

    const addButton = productDetail.addToCartButton(
      testCase.targetProduct.name,
      testCase.navigation.productDetailAddToCartButton,
    );
    await expect(addButton).toBeVisible();
    await productDetail.addToCartOnce(
      testCase.targetProduct.name,
      testCase.navigation.productDetailAddToCartButton,
    );

    const visualFeedback = productDetail.visualAddFeedback(
      testCase.targetProduct.name,
      testCase.navigation.productDetailAddToCartButton,
      testCase.feedback.semanticRoles,
      testCase.feedback.allowControlStateOrTextTransition,
    );
    await expect.soft(
      visualFeedback.first(),
      'One Add activation must produce a visible notification or control transition.',
    ).toBeVisible();
    expect.soft(await visualFeedback.count()).toBeGreaterThanOrEqual(
      testCase.expected.counts.minimumFeedbackSignals,
    );

    const updatedCartBadge = cart.semanticCartBadge(
      testCase.navigation.cartLink,
      testCase.badge.numericTextPattern,
    );
    await expect.soft(
      updatedCartBadge,
      'The Giỏ hàng navigation entry must expose its updated numeric badge.',
    ).toHaveCount(testCase.expected.counts.cartBadges);
    await expect.soft(updatedCartBadge).toBeVisible();

    if (
      (await updatedCartBadge.count()) ===
        testCase.expected.counts.cartBadges &&
      (await updatedCartBadge.isVisible())
    ) {
      const observedUpdatedBadgeCount = await cart.semanticCartBadgeCount(
        updatedCartBadge,
      );
      expect.soft(observedUpdatedBadgeCount).toBe(
        testCase.initialState.cartBadgeCount + testCase.badge.expectedDelta,
      );
      if (observedInitialBadgeCount !== null) {
        expect.soft(
          observedUpdatedBadgeCount - observedInitialBadgeCount,
        ).toBe(testCase.badge.expectedDelta);
      }
    }
  });
});
