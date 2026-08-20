# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 1 >> FR07-TC03 adding the same product twice produces one row with quantity two
- Location: tests/features/fr07-cart.spec.ts:291:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell') })
Expected: 1
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell') })
    - locator resolved to 0 elements
    - unexpected value "0"
    13 × locator resolved to 2 elements
       - unexpected value "2"

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
            - cell "MacBook Pro M3" [ref=e23]
            - cell "45,000,000 ₫" [ref=e24]
            - cell "1" [ref=e25]
            - cell "45,000,000 ₫" [ref=e26]
            - cell [ref=e27]:
              - button "Xóa" [ref=e28] [cursor=pointer]
          - row [ref=e29]:
            - cell "MacBook Pro M3" [ref=e30]
            - cell "45,000,000 ₫" [ref=e31]
            - cell "1" [ref=e32]
            - cell "45,000,000 ₫" [ref=e33]
            - cell [ref=e34]:
              - button "Xóa" [ref=e35] [cursor=pointer]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - text: "Tổng tạm tính:"
          - generic [ref=e38]: 90,000,000 ₫
        - generic [ref=e39]:
          - link "← Mua tiếp" [ref=e40] [cursor=pointer]:
            - /url: /
          - button "Tiến hành thanh toán" [ref=e41] [cursor=pointer]
  - contentinfo [ref=e42]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  208 |       `Dedicated-user login; ${responseDiagnostics(loginResponse, loginBody)}`,
  209 |     ).toBe(testCase.expected.loginSuccessful);
  210 | 
  211 |     const loginRecord = loginBody as Record<string, unknown>;
  212 |     const validToken = loginRecord[testCase.expected.tokenProperty];
  213 |     expect(
  214 |       typeof validToken,
  215 |       `Dedicated-user login must return ${testCase.expected.tokenProperty}; ${responseDiagnostics(loginResponse, loginBody)}`,
  216 |     ).toBe('string');
  217 |     if (typeof validToken !== 'string') {
  218 |       throw new Error('A valid baseline token was not available.');
  219 |     }
  220 | 
  221 |     const validAuthorizationHeader =
  222 |       `${testCase.headers.bearerScheme} ${validToken}`;
  223 |     const baselineCart = await authenticatedCartSnapshot(
  224 |       request,
  225 |       cartUrl,
  226 |       testCase.headers.authorization,
  227 |       validAuthorizationHeader,
  228 |       testCase.expected.baselineGetSuccessful,
  229 |       'Baseline authenticated cart GET',
  230 |     );
  231 |     let rejectionResponseCount = 0;
  232 | 
  233 |     for (const partition of testCase.tokenPartitions) {
  234 |       await test.step(
  235 |         `${partition.name} (${partition.tokenClass}) GET`,
  236 |         async () => {
  237 |           const response = await request.get(cartUrl, {
  238 |             headers: requestHeaders(
  239 |               testCase.headers.authorization,
  240 |               partition.authorizationHeader,
  241 |             ),
  242 |           });
  243 |           const body = await responseBody(response);
  244 |           rejectionResponseCount += 1;
  245 |           expect.soft(
  246 |             response.ok(),
  247 |             `${partition.name} GET must be rejected; ${responseDiagnostics(response, body)}`,
  248 |           ).toBe(false);
  249 |         },
  250 |       );
  251 | 
  252 |       await test.step(
  253 |         `${partition.name} (${partition.tokenClass}) POST`,
  254 |         async () => {
  255 |           const response = await request.post(cartUrl, {
  256 |             headers: requestHeaders(
  257 |               testCase.headers.authorization,
  258 |               partition.authorizationHeader,
  259 |             ),
  260 |             data: testCase.postRequestBody,
  261 |           });
  262 |           const body = await responseBody(response);
  263 |           rejectionResponseCount += 1;
  264 |           expect.soft(
  265 |             response.ok(),
  266 |             `${partition.name} POST must be rejected; ${responseDiagnostics(response, body)}`,
  267 |           ).toBe(false);
  268 |         },
  269 |       );
  270 |     }
  271 | 
  272 |     expect(rejectionResponseCount).toBe(
  273 |       testCase.expected.rejectionResponseCount,
  274 |     );
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
> 308 |     await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);
      |                                   ^ Error: expect(locator).toHaveCount(expected) failed
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
  375 |     await expect(incrementButton).toHaveCount(
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
```