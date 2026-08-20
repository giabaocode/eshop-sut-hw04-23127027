# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 1 >> FR07-TC04 the plus control increments only the selected row and recalculates totals
- Location: tests/features/fr07-cart.spec.ts:346:7

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
    - link "EShop" [ref=e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [active] [ref=e7] [cursor=pointer]:
        - /url: /cart
      - link "Đăng nhập" [ref=e8] [cursor=pointer]:
        - /url: /login
      - link "Đăng ký" [ref=e9] [cursor=pointer]:
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
          - link "← Mua tiếp" [ref=e33] [cursor=pointer]:
            - /url: /
          - button "Tiến hành thanh toán" [ref=e34] [cursor=pointer]
  - contentinfo [ref=e35]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  275 |     expect(rejectionResponseCount).toBe(
  276 |       testCase.tokenPartitions.length *
  277 |         testCase.expected.requestsPerPartition,
  278 |     );
  279 | 
  280 |     const finalCart = await authenticatedCartSnapshot(
  281 |       request,
  282 |       cartUrl,
  283 |       testCase.headers.authorization,
  284 |       validAuthorizationHeader,
  285 |       testCase.expected.finalGetSuccessful,
  286 |       'Final authenticated cart GET',
  287 |     );
  288 |     expect(finalCart).toEqual(baselineCart);
  289 |   });
  290 | 
  291 |   test(`${sameProductUiAdditionCase.id} ${sameProductUiAdditionCase.title}`, async ({
  292 |     page,
  293 |   }) => {
  294 |     const testCase = sameProductUiAdditionCase;
  295 |     const catalog = new CatalogPage(page);
  296 |     const cart = new CartPage(page);
  297 | 
  298 |     await catalog.goto(testCase.paths.home);
  299 |     for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
  300 |       await catalog.addProductOnce(
  301 |         testCase.product.name,
  302 |         testCase.navigation.addToCartButton,
  303 |       );
  304 |     }
  305 |     await catalog.openCart(testCase.navigation.cartLink);
  306 |     await assertCurrentPath(page, testCase.paths.cart);
  307 | 
  308 |     await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);
  309 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  310 |       testCase.expected.counts.rowsForProduct,
  311 |     );
  312 | 
  313 |     const row = cart.productRow(testCase.product.name);
  314 |     const displayedQuantity = await cart.quantity(
  315 |       row,
  316 |       testCase.expected.columns,
  317 |     );
  318 |     const displayedUnitPrice = await cart.unitPrice(
  319 |       row,
  320 |       testCase.expected.columns,
  321 |       testCase.expected.currency,
  322 |     );
  323 |     const displayedLineAmount = await cart.lineAmount(
  324 |       row,
  325 |       testCase.expected.columns,
  326 |       testCase.expected.currency,
  327 |     );
  328 |     const displayedLineAmountSum = await cart.sumDisplayedLineAmounts(
  329 |       testCase.expected.columns,
  330 |       testCase.expected.currency,
  331 |     );
  332 |     const displayedCartTotal = await cart.cartTotal(
  333 |       testCase.expected.totalLabel,
  334 |       testCase.expected.currency,
  335 |     );
  336 | 
  337 |     expect(displayedQuantity).toBe(testCase.product.quantity);
  338 |     expect(displayedUnitPrice).toBe(testCase.product.unitPrice);
  339 |     expect(displayedLineAmount).toBe(
  340 |       testCase.product.unitPrice * testCase.product.quantity,
  341 |     );
  342 |     expect(displayedCartTotal).toBe(displayedLineAmountSum);
  343 |     expect(displayedCartTotal).toBe(displayedLineAmount);
  344 |   });
  345 | 
  346 |   test(`${quantityIncrementCase.id} ${quantityIncrementCase.title}`, async ({
  347 |     page,
  348 |   }) => {
  349 |     const testCase = quantityIncrementCase;
  350 |     const catalog = new CatalogPage(page);
  351 |     const cart = new CartPage(page);
  352 | 
  353 |     await catalog.goto(testCase.paths.home);
  354 |     for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
  355 |       await catalog.addProductOnce(
  356 |         testCase.product.name,
  357 |         testCase.navigation.addToCartButton,
  358 |       );
  359 |     }
  360 |     await catalog.openCart(testCase.navigation.cartLink);
  361 |     await assertCurrentPath(page, testCase.paths.cart);
  362 | 
  363 |     const dataRows = cart.dataRows();
  364 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  365 |     const beforeRowCount = await dataRows.count();
  366 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  367 |       testCase.expected.counts.rowsForProduct,
  368 |     );
  369 | 
  370 |     const selectedRow = cart.productRow(testCase.product.name);
  371 |     const incrementButton = cart.incrementButton(
  372 |       selectedRow,
  373 |       testCase.expected.controls.increment,
  374 |     );
> 375 |     await expect(incrementButton).toHaveCount(
      |                                   ^ Error: expect(locator).toHaveCount(expected) failed
  376 |       testCase.expected.counts.incrementControlsForProduct,
  377 |     );
  378 |     await expect(incrementButton).toBeVisible();
  379 | 
  380 |     const beforeQuantity = await cart.quantity(
  381 |       selectedRow,
  382 |       testCase.expected.columns,
  383 |     );
  384 |     const beforeLineAmount = await cart.lineAmount(
  385 |       selectedRow,
  386 |       testCase.expected.columns,
  387 |       testCase.expected.currency,
  388 |     );
  389 |     const beforeLineAmountSum = await cart.sumDisplayedLineAmounts(
  390 |       testCase.expected.columns,
  391 |       testCase.expected.currency,
  392 |     );
  393 |     const beforeCartTotal = await cart.cartTotal(
  394 |       testCase.expected.totalLabel,
  395 |       testCase.expected.currency,
  396 |     );
  397 | 
  398 |     expect(beforeQuantity).toBe(testCase.product.initialQuantity);
  399 |     expect(beforeLineAmount).toBe(
  400 |       testCase.product.unitPrice * testCase.product.initialQuantity,
  401 |     );
  402 |     expect(beforeCartTotal).toBe(beforeLineAmountSum);
  403 | 
  404 |     await incrementButton.click();
  405 | 
  406 |     const afterRowCount = await cart.dataRows().count();
  407 |     const afterQuantity = await cart.quantity(
  408 |       selectedRow,
  409 |       testCase.expected.columns,
  410 |     );
  411 |     const afterLineAmount = await cart.lineAmount(
  412 |       selectedRow,
  413 |       testCase.expected.columns,
  414 |       testCase.expected.currency,
  415 |     );
  416 |     const afterLineAmountSum = await cart.sumDisplayedLineAmounts(
  417 |       testCase.expected.columns,
  418 |       testCase.expected.currency,
  419 |     );
  420 |     const afterCartTotal = await cart.cartTotal(
  421 |       testCase.expected.totalLabel,
  422 |       testCase.expected.currency,
  423 |     );
  424 | 
  425 |     expect(afterRowCount).toBe(beforeRowCount);
  426 |     expect(afterQuantity).toBe(beforeQuantity + 1);
  427 |     expect(afterQuantity).toBe(testCase.product.incrementedQuantity);
  428 |     expect(afterLineAmount).toBe(
  429 |       testCase.product.unitPrice * testCase.product.incrementedQuantity,
  430 |     );
  431 |     expect(afterLineAmount - beforeLineAmount).toBe(testCase.product.unitPrice);
  432 |     expect(afterLineAmountSum - beforeLineAmountSum).toBe(
  433 |       afterLineAmount - beforeLineAmount,
  434 |     );
  435 |     expect(afterCartTotal).toBe(afterLineAmountSum);
  436 |     expect(afterCartTotal - beforeCartTotal).toBe(
  437 |       afterLineAmount - beforeLineAmount,
  438 |     );
  439 |   });
  440 | });
  441 | 
```