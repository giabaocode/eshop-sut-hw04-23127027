import { expect, test } from '@playwright/test';
import type {
  APIRequestContext,
  APIResponse,
  Page,
} from '@playwright/test';
import { CartPage, hasDisplayedThousandsSeparator } from '../pages/cart.page.js';
import { CatalogPage } from '../pages/catalog.page.js';
import { loadJsonFile } from '../support/data-loader.js';
import type { Fr07CartData } from '../support/data-loader.js';

const data = loadJsonFile<Fr07CartData>('tests/data/fr07-cart.json');
const populatedCartTwoProductsCase = data.populated_cart_two_products;
const cartInvalidAuthenticationCase = data.cart_invalid_authentication;
const sameProductUiAdditionCase = data.same_product_ui_addition;
const quantityIncrementCase = data.quantity_increment;

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
