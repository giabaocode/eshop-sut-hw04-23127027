# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 1 >> FR07-TC04 the plus control increments only the selected row and recalculates totals
- Location: tests/features/fr07-cart.spec.ts:360:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Tai nghe AirPods Pro 2\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Tai nghe AirPods Pro 2\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [ref=e7]:
        - /url: /cart
      - link "Đăng nhập" [ref=e8]:
        - /url: /login
      - link "Đăng ký" [ref=e9]:
        - /url: /register
  - main [ref=e10]:
    - generic [ref=e11]:
      - heading "Giỏ Hàng" [level=2] [ref=e12]
      - table [ref=e13]:
        - rowgroup [ref=e14]:
          - row [ref=e15]:
            - columnheader "Sản phẩm" [ref=e16]
            - columnheader "Giá" [ref=e17]
            - columnheader "Số lượng" [ref=e18]
            - columnheader "Thành tiền" [ref=e19]
            - columnheader "Thao tác" [ref=e20]
        - rowgroup [ref=e21]:
          - row [ref=e22]:
            - cell "Tai nghe AirPods Pro 2" [ref=e23]
            - cell "6,000,000 ₫" [ref=e24]
            - cell "1" [ref=e25]
            - cell "6,000,000 ₫" [ref=e26]
            - cell [ref=e27]:
              - button "Xóa" [ref=e28] [cursor=pointer]
      - generic [ref=e29]:
        - generic [ref=e30]:
          - text: "Tổng tạm tính:"
          - generic [ref=e31]: 6,000,000 ₫
        - generic [ref=e32]:
          - link "← Mua tiếp" [ref=e33]:
            - /url: /
          - button "Tiến hành thanh toán" [ref=e34] [cursor=pointer]
  - contentinfo [ref=e35]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  289 |     expect(rejectionResponseCount).toBe(
  290 |       testCase.tokenPartitions.length *
  291 |         testCase.expected.requestsPerPartition,
  292 |     );
  293 | 
  294 |     const finalCart = await authenticatedCartSnapshot(
  295 |       request,
  296 |       cartUrl,
  297 |       testCase.headers.authorization,
  298 |       validAuthorizationHeader,
  299 |       testCase.expected.finalGetSuccessful,
  300 |       'Final authenticated cart GET',
  301 |     );
  302 |     expect(finalCart).toEqual(baselineCart);
  303 |   });
  304 | 
  305 |   test(`${sameProductUiAdditionCase.id} ${sameProductUiAdditionCase.title}`, async ({
  306 |     page,
  307 |   }) => {
  308 |     const testCase = sameProductUiAdditionCase;
  309 |     const catalog = new CatalogPage(page);
  310 |     const cart = new CartPage(page);
  311 | 
  312 |     await catalog.goto(testCase.paths.home);
  313 |     for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
  314 |       await catalog.addProductOnce(
  315 |         testCase.product.name,
  316 |         testCase.navigation.addToCartButton,
  317 |       );
  318 |     }
  319 |     await catalog.openCart(testCase.navigation.cartLink);
  320 |     await assertCurrentPath(page, testCase.paths.cart);
  321 | 
  322 |     await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);
  323 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  324 |       testCase.expected.counts.rowsForProduct,
  325 |     );
  326 | 
  327 |     const row = cart.productRow(testCase.product.name);
  328 |     const displayedQuantity = await cart.quantity(
  329 |       row,
  330 |       testCase.expected.columns,
  331 |     );
  332 |     const displayedUnitPrice = await cart.unitPrice(
  333 |       row,
  334 |       testCase.expected.columns,
  335 |       testCase.expected.currency,
  336 |     );
  337 |     const displayedLineAmount = await cart.lineAmount(
  338 |       row,
  339 |       testCase.expected.columns,
  340 |       testCase.expected.currency,
  341 |     );
  342 |     const displayedLineAmountSum = await cart.sumDisplayedLineAmounts(
  343 |       testCase.expected.columns,
  344 |       testCase.expected.currency,
  345 |     );
  346 |     const displayedCartTotal = await cart.cartTotal(
  347 |       testCase.expected.totalLabel,
  348 |       testCase.expected.currency,
  349 |     );
  350 | 
  351 |     expect(displayedQuantity).toBe(testCase.product.quantity);
  352 |     expect(displayedUnitPrice).toBe(testCase.product.unitPrice);
  353 |     expect(displayedLineAmount).toBe(
  354 |       testCase.product.unitPrice * testCase.product.quantity,
  355 |     );
  356 |     expect(displayedCartTotal).toBe(displayedLineAmountSum);
  357 |     expect(displayedCartTotal).toBe(displayedLineAmount);
  358 |   });
  359 | 
  360 |   test(`${quantityIncrementCase.id} ${quantityIncrementCase.title}`, async ({
  361 |     page,
  362 |   }) => {
  363 |     const testCase = quantityIncrementCase;
  364 |     const catalog = new CatalogPage(page);
  365 |     const cart = new CartPage(page);
  366 | 
  367 |     await catalog.goto(testCase.paths.home);
  368 |     for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
  369 |       await catalog.addProductOnce(
  370 |         testCase.product.name,
  371 |         testCase.navigation.addToCartButton,
  372 |       );
  373 |     }
  374 |     await catalog.openCart(testCase.navigation.cartLink);
  375 |     await assertCurrentPath(page, testCase.paths.cart);
  376 | 
  377 |     const dataRows = cart.dataRows();
  378 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  379 |     const beforeRowCount = await dataRows.count();
  380 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  381 |       testCase.expected.counts.rowsForProduct,
  382 |     );
  383 | 
  384 |     const selectedRow = cart.productRow(testCase.product.name);
  385 |     const incrementButton = cart.incrementButton(
  386 |       selectedRow,
  387 |       testCase.expected.controls.increment,
  388 |     );
> 389 |     await expect(incrementButton).toHaveCount(
      |                                   ^ Error: expect(locator).toHaveCount(expected) failed
  390 |       testCase.expected.counts.incrementControlsForProduct,
  391 |     );
  392 |     await expect(incrementButton).toBeVisible();
  393 | 
  394 |     const beforeQuantity = await cart.quantity(
  395 |       selectedRow,
  396 |       testCase.expected.columns,
  397 |     );
  398 |     const beforeLineAmount = await cart.lineAmount(
  399 |       selectedRow,
  400 |       testCase.expected.columns,
  401 |       testCase.expected.currency,
  402 |     );
  403 |     const beforeLineAmountSum = await cart.sumDisplayedLineAmounts(
  404 |       testCase.expected.columns,
  405 |       testCase.expected.currency,
  406 |     );
  407 |     const beforeCartTotal = await cart.cartTotal(
  408 |       testCase.expected.totalLabel,
  409 |       testCase.expected.currency,
  410 |     );
  411 | 
  412 |     expect(beforeQuantity).toBe(testCase.product.initialQuantity);
  413 |     expect(beforeLineAmount).toBe(
  414 |       testCase.product.unitPrice * testCase.product.initialQuantity,
  415 |     );
  416 |     expect(beforeCartTotal).toBe(beforeLineAmountSum);
  417 | 
  418 |     await incrementButton.click();
  419 | 
  420 |     const afterRowCount = await cart.dataRows().count();
  421 |     const afterQuantity = await cart.quantity(
  422 |       selectedRow,
  423 |       testCase.expected.columns,
  424 |     );
  425 |     const afterLineAmount = await cart.lineAmount(
  426 |       selectedRow,
  427 |       testCase.expected.columns,
  428 |       testCase.expected.currency,
  429 |     );
  430 |     const afterLineAmountSum = await cart.sumDisplayedLineAmounts(
  431 |       testCase.expected.columns,
  432 |       testCase.expected.currency,
  433 |     );
  434 |     const afterCartTotal = await cart.cartTotal(
  435 |       testCase.expected.totalLabel,
  436 |       testCase.expected.currency,
  437 |     );
  438 | 
  439 |     expect(afterRowCount).toBe(beforeRowCount);
  440 |     expect(afterQuantity).toBe(beforeQuantity + 1);
  441 |     expect(afterQuantity).toBe(testCase.product.incrementedQuantity);
  442 |     expect(afterLineAmount).toBe(
  443 |       testCase.product.unitPrice * testCase.product.incrementedQuantity,
  444 |     );
  445 |     expect(afterLineAmount - beforeLineAmount).toBe(testCase.product.unitPrice);
  446 |     expect(afterLineAmountSum - beforeLineAmountSum).toBe(
  447 |       afterLineAmount - beforeLineAmount,
  448 |     );
  449 |     expect(afterCartTotal).toBe(afterLineAmountSum);
  450 |     expect(afterCartTotal - beforeCartTotal).toBe(
  451 |       afterLineAmount - beforeLineAmount,
  452 |     );
  453 |   });
  454 | });
  455 | 
  456 | test.describe('FR-07 shopping cart — increment 2', () => {
  457 |   test(`${quantityDecrementAboveMinimumCase.id} ${quantityDecrementAboveMinimumCase.title}`, async ({
  458 |     page,
  459 |   }) => {
  460 |     const testCase = quantityDecrementAboveMinimumCase;
  461 |     const catalog = new CatalogPage(page);
  462 |     const productDetail = new ProductDetailPage(page);
  463 |     const cart = new CartPage(page);
  464 | 
  465 |     expect(testCase.targetProduct.id).not.toBe(testCase.comparisonProduct.id);
  466 |     expect(testCase.targetProduct.name).not.toBe(
  467 |       testCase.comparisonProduct.name,
  468 |     );
  469 | 
  470 |     await catalog.goto(testCase.paths.home);
  471 |     await expect(
  472 |       catalog.productDetailLink(
  473 |         testCase.targetProduct.name,
  474 |         testCase.navigation.productDetailLink,
  475 |       ),
  476 |     ).toBeVisible();
  477 |     await catalog.openProductDetail(
  478 |       testCase.targetProduct.name,
  479 |       testCase.navigation.productDetailLink,
  480 |     );
  481 |     await assertCurrentPath(page, testCase.paths.productDetail);
  482 | 
  483 |     await expect(
  484 |       productDetail.productHeading(testCase.targetProduct.name),
  485 |     ).toBeVisible();
  486 |     await expect(
  487 |       productDetail.quantityLabel(
  488 |         testCase.targetProduct.name,
  489 |         testCase.navigation.quantityLabel,
```