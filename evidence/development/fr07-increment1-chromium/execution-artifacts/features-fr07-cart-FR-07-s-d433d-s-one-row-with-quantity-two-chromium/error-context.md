# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 1 >> FR07-TC03 adding the same product twice produces one row with quantity two
- Location: tests/features/fr07-cart.spec.ts:290:7

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
  207 |       `Dedicated-user login; ${responseDiagnostics(loginResponse, loginBody)}`,
  208 |     ).toBe(testCase.expected.loginSuccessful);
  209 | 
  210 |     const loginRecord = loginBody as Record<string, unknown>;
  211 |     const validToken = loginRecord[testCase.expected.tokenProperty];
  212 |     expect(
  213 |       typeof validToken,
  214 |       `Dedicated-user login must return ${testCase.expected.tokenProperty}; ${responseDiagnostics(loginResponse, loginBody)}`,
  215 |     ).toBe('string');
  216 |     if (typeof validToken !== 'string') {
  217 |       throw new Error('A valid baseline token was not available.');
  218 |     }
  219 | 
  220 |     const validAuthorizationHeader =
  221 |       `${testCase.headers.bearerScheme} ${validToken}`;
  222 |     const baselineCart = await authenticatedCartSnapshot(
  223 |       request,
  224 |       cartUrl,
  225 |       testCase.headers.authorization,
  226 |       validAuthorizationHeader,
  227 |       testCase.expected.baselineGetSuccessful,
  228 |       'Baseline authenticated cart GET',
  229 |     );
  230 |     let rejectionResponseCount = 0;
  231 | 
  232 |     for (const partition of testCase.tokenPartitions) {
  233 |       await test.step(
  234 |         `${partition.name} (${partition.tokenClass}) GET`,
  235 |         async () => {
  236 |           const response = await request.get(cartUrl, {
  237 |             headers: requestHeaders(
  238 |               testCase.headers.authorization,
  239 |               partition.authorizationHeader,
  240 |             ),
  241 |           });
  242 |           const body = await responseBody(response);
  243 |           rejectionResponseCount += 1;
  244 |           expect.soft(
  245 |             response.ok(),
  246 |             `${partition.name} GET must be rejected; ${responseDiagnostics(response, body)}`,
  247 |           ).toBe(false);
  248 |         },
  249 |       );
  250 | 
  251 |       await test.step(
  252 |         `${partition.name} (${partition.tokenClass}) POST`,
  253 |         async () => {
  254 |           const response = await request.post(cartUrl, {
  255 |             headers: requestHeaders(
  256 |               testCase.headers.authorization,
  257 |               partition.authorizationHeader,
  258 |             ),
  259 |             data: testCase.postRequestBody,
  260 |           });
  261 |           const body = await responseBody(response);
  262 |           rejectionResponseCount += 1;
  263 |           expect.soft(
  264 |             response.ok(),
  265 |             `${partition.name} POST must be rejected; ${responseDiagnostics(response, body)}`,
  266 |           ).toBe(false);
  267 |         },
  268 |       );
  269 |     }
  270 | 
  271 |     expect(rejectionResponseCount).toBe(
  272 |       testCase.expected.rejectionResponseCount,
  273 |     );
  274 |     expect(rejectionResponseCount).toBe(
  275 |       testCase.tokenPartitions.length *
  276 |         testCase.expected.requestsPerPartition,
  277 |     );
  278 | 
  279 |     const finalCart = await authenticatedCartSnapshot(
  280 |       request,
  281 |       cartUrl,
  282 |       testCase.headers.authorization,
  283 |       validAuthorizationHeader,
  284 |       testCase.expected.finalGetSuccessful,
  285 |       'Final authenticated cart GET',
  286 |     );
  287 |     expect(finalCart).toEqual(baselineCart);
  288 |   });
  289 | 
  290 |   test(`${sameProductUiAdditionCase.id} ${sameProductUiAdditionCase.title}`, async ({
  291 |     page,
  292 |   }) => {
  293 |     const testCase = sameProductUiAdditionCase;
  294 |     const catalog = new CatalogPage(page);
  295 |     const cart = new CartPage(page);
  296 | 
  297 |     await catalog.goto(testCase.paths.home);
  298 |     for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
  299 |       await catalog.addProductOnce(
  300 |         testCase.product.name,
  301 |         testCase.navigation.addToCartButton,
  302 |       );
  303 |     }
  304 |     await catalog.openCart(testCase.navigation.cartLink);
  305 |     await assertCurrentPath(page, testCase.paths.cart);
  306 | 
> 307 |     await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);
      |                                   ^ Error: expect(locator).toHaveCount(expected) failed
  308 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  309 |       testCase.expected.counts.rowsForProduct,
  310 |     );
  311 | 
  312 |     const row = cart.productRow(testCase.product.name);
  313 |     const displayedQuantity = await cart.quantity(
  314 |       row,
  315 |       testCase.expected.columns,
  316 |     );
  317 |     const displayedUnitPrice = await cart.unitPrice(
  318 |       row,
  319 |       testCase.expected.columns,
  320 |       testCase.expected.currency,
  321 |     );
  322 |     const displayedLineAmount = await cart.lineAmount(
  323 |       row,
  324 |       testCase.expected.columns,
  325 |       testCase.expected.currency,
  326 |     );
  327 |     const displayedLineAmountSum = await cart.sumDisplayedLineAmounts(
  328 |       testCase.expected.columns,
  329 |       testCase.expected.currency,
  330 |     );
  331 |     const displayedCartTotal = await cart.cartTotal(
  332 |       testCase.expected.totalLabel,
  333 |       testCase.expected.currency,
  334 |     );
  335 | 
  336 |     expect(displayedQuantity).toBe(testCase.product.quantity);
  337 |     expect(displayedUnitPrice).toBe(testCase.product.unitPrice);
  338 |     expect(displayedLineAmount).toBe(
  339 |       testCase.product.unitPrice * testCase.product.quantity,
  340 |     );
  341 |     expect(displayedCartTotal).toBe(displayedLineAmountSum);
  342 |     expect(displayedCartTotal).toBe(displayedLineAmount);
  343 |   });
  344 | 
  345 |   test(`${quantityIncrementCase.id} ${quantityIncrementCase.title}`, async ({
  346 |     page,
  347 |   }) => {
  348 |     const testCase = quantityIncrementCase;
  349 |     const catalog = new CatalogPage(page);
  350 |     const cart = new CartPage(page);
  351 | 
  352 |     await catalog.goto(testCase.paths.home);
  353 |     for (let activation = 0; activation < testCase.addActionCount; activation += 1) {
  354 |       await catalog.addProductOnce(
  355 |         testCase.product.name,
  356 |         testCase.navigation.addToCartButton,
  357 |       );
  358 |     }
  359 |     await catalog.openCart(testCase.navigation.cartLink);
  360 |     await assertCurrentPath(page, testCase.paths.cart);
  361 | 
  362 |     const beforeRowCount = await cart.dataRows().count();
  363 |     expect(beforeRowCount).toBe(testCase.expected.counts.rows);
  364 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  365 |       testCase.expected.counts.rowsForProduct,
  366 |     );
  367 | 
  368 |     const selectedRow = cart.productRow(testCase.product.name);
  369 |     const incrementButton = cart.incrementButton(
  370 |       selectedRow,
  371 |       testCase.expected.controls.increment,
  372 |     );
  373 |     await expect(incrementButton).toHaveCount(
  374 |       testCase.expected.counts.incrementControlsForProduct,
  375 |     );
  376 |     await expect(incrementButton).toBeVisible();
  377 | 
  378 |     const beforeQuantity = await cart.quantity(
  379 |       selectedRow,
  380 |       testCase.expected.columns,
  381 |     );
  382 |     const beforeLineAmount = await cart.lineAmount(
  383 |       selectedRow,
  384 |       testCase.expected.columns,
  385 |       testCase.expected.currency,
  386 |     );
  387 |     const beforeLineAmountSum = await cart.sumDisplayedLineAmounts(
  388 |       testCase.expected.columns,
  389 |       testCase.expected.currency,
  390 |     );
  391 |     const beforeCartTotal = await cart.cartTotal(
  392 |       testCase.expected.totalLabel,
  393 |       testCase.expected.currency,
  394 |     );
  395 | 
  396 |     expect(beforeQuantity).toBe(testCase.product.initialQuantity);
  397 |     expect(beforeLineAmount).toBe(
  398 |       testCase.product.unitPrice * testCase.product.initialQuantity,
  399 |     );
  400 |     expect(beforeCartTotal).toBe(beforeLineAmountSum);
  401 | 
  402 |     await incrementButton.click();
  403 | 
  404 |     const afterRowCount = await cart.dataRows().count();
  405 |     const afterQuantity = await cart.quantity(
  406 |       selectedRow,
  407 |       testCase.expected.columns,
```