# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 1 >> FR07-TC03 adding the same product twice produces one row with quantity two
- Location: tests/features/fr07-cart.spec.ts:305:7

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
    14 × locator resolved to 2 elements
       - unexpected value "2"

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
          - link "← Mua tiếp" [ref=e40]:
            - /url: /
          - button "Tiến hành thanh toán" [ref=e41] [cursor=pointer]
  - contentinfo [ref=e42]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  222 |       `Dedicated-user login; ${responseDiagnostics(loginResponse, loginBody)}`,
  223 |     ).toBe(testCase.expected.loginSuccessful);
  224 | 
  225 |     const loginRecord = loginBody as Record<string, unknown>;
  226 |     const validToken = loginRecord[testCase.expected.tokenProperty];
  227 |     expect(
  228 |       typeof validToken,
  229 |       `Dedicated-user login must return ${testCase.expected.tokenProperty}; ${responseDiagnostics(loginResponse, loginBody)}`,
  230 |     ).toBe('string');
  231 |     if (typeof validToken !== 'string') {
  232 |       throw new Error('A valid baseline token was not available.');
  233 |     }
  234 | 
  235 |     const validAuthorizationHeader =
  236 |       `${testCase.headers.bearerScheme} ${validToken}`;
  237 |     const baselineCart = await authenticatedCartSnapshot(
  238 |       request,
  239 |       cartUrl,
  240 |       testCase.headers.authorization,
  241 |       validAuthorizationHeader,
  242 |       testCase.expected.baselineGetSuccessful,
  243 |       'Baseline authenticated cart GET',
  244 |     );
  245 |     let rejectionResponseCount = 0;
  246 | 
  247 |     for (const partition of testCase.tokenPartitions) {
  248 |       await test.step(
  249 |         `${partition.name} (${partition.tokenClass}) GET`,
  250 |         async () => {
  251 |           const response = await request.get(cartUrl, {
  252 |             headers: requestHeaders(
  253 |               testCase.headers.authorization,
  254 |               partition.authorizationHeader,
  255 |             ),
  256 |           });
  257 |           const body = await responseBody(response);
  258 |           rejectionResponseCount += 1;
  259 |           expect.soft(
  260 |             response.ok(),
  261 |             `${partition.name} GET must be rejected; ${responseDiagnostics(response, body)}`,
  262 |           ).toBe(false);
  263 |         },
  264 |       );
  265 | 
  266 |       await test.step(
  267 |         `${partition.name} (${partition.tokenClass}) POST`,
  268 |         async () => {
  269 |           const response = await request.post(cartUrl, {
  270 |             headers: requestHeaders(
  271 |               testCase.headers.authorization,
  272 |               partition.authorizationHeader,
  273 |             ),
  274 |             data: testCase.postRequestBody,
  275 |           });
  276 |           const body = await responseBody(response);
  277 |           rejectionResponseCount += 1;
  278 |           expect.soft(
  279 |             response.ok(),
  280 |             `${partition.name} POST must be rejected; ${responseDiagnostics(response, body)}`,
  281 |           ).toBe(false);
  282 |         },
  283 |       );
  284 |     }
  285 | 
  286 |     expect(rejectionResponseCount).toBe(
  287 |       testCase.expected.rejectionResponseCount,
  288 |     );
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
> 322 |     await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);
      |                                   ^ Error: expect(locator).toHaveCount(expected) failed
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
  389 |     await expect(incrementButton).toHaveCount(
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
```