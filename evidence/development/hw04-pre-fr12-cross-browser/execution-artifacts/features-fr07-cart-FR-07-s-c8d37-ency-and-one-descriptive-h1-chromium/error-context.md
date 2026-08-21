# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 1 >> FR07-TC01 populated cart structure, currency, and one descriptive h1
- Location: tests/features/fr07-cart.spec.ts:96:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('heading', { level: 1 })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "soft toHaveCount" with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Giỏ hàng\s*$/i, level: 1 })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "soft toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Giỏ hàng\s*$/i, level: 1 })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Giỏ Hàng" [level=2]
  - table:
    - rowgroup:
      - row "Sản phẩm Giá Số lượng Thành tiền Thao tác":
        - columnheader "Sản phẩm"
        - columnheader "Giá"
        - columnheader "Số lượng"
        - columnheader "Thành tiền"
        - columnheader "Thao tác"
    - rowgroup:
      - row "iPhone 15 Pro Max 30,000,000 ₫ 1 30,000,000 ₫ Xóa":
        - cell "iPhone 15 Pro Max"
        - cell "30,000,000 ₫"
        - cell "1"
        - cell "30,000,000 ₫"
        - cell "Xóa":
          - button "Xóa"
      - row "Samsung Galaxy S24 Ultra 28,000,000 ₫ 1 28,000,000 ₫ Xóa":
        - cell "Samsung Galaxy S24 Ultra"
        - cell "28,000,000 ₫"
        - cell "1"
        - cell "28,000,000 ₫"
        - cell "Xóa":
          - button "Xóa"
  - text: "Tổng tạm tính: 58,000,000 ₫"
  - link "← Mua tiếp":
    - /url: /
  - button "Tiến hành thanh toán"
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: Required cart column "Đơn giá"

expect(locator).toBeVisible() failed

Locator: getByRole('table').getByRole('columnheader', { name: /^\s*Đơn giá\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Required cart column "Đơn giá" with timeout 5000ms
  - waiting for getByRole('table').getByRole('columnheader', { name: /^\s*Đơn giá\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Giỏ Hàng" [level=2]
  - table:
    - rowgroup:
      - row "Sản phẩm Giá Số lượng Thành tiền Thao tác":
        - columnheader "Sản phẩm"
        - columnheader "Giá"
        - columnheader "Số lượng"
        - columnheader "Thành tiền"
        - columnheader "Thao tác"
    - rowgroup:
      - row "iPhone 15 Pro Max 30,000,000 ₫ 1 30,000,000 ₫ Xóa":
        - cell "iPhone 15 Pro Max"
        - cell "30,000,000 ₫"
        - cell "1"
        - cell "30,000,000 ₫"
        - cell "Xóa":
          - button "Xóa"
      - row "Samsung Galaxy S24 Ultra 28,000,000 ₫ 1 28,000,000 ₫ Xóa":
        - cell "Samsung Galaxy S24 Ultra"
        - cell "28,000,000 ₫"
        - cell "1"
        - cell "28,000,000 ₫"
        - cell "Xóa":
          - button "Xóa"
  - text: "Tổng tạm tính: 58,000,000 ₫"
  - link "← Mua tiếp":
    - /url: /
  - button "Tiến hành thanh toán"
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*iPhone 15 Pro Max\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "soft toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*iPhone 15 Pro Max\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*iPhone 15 Pro Max\s*$/i }) }).getByRole('button', { name: /^\s*-\s*$/i })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "soft toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*iPhone 15 Pro Max\s*$/i }) }).getByRole('button', { name: /^\s*-\s*$/i })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Samsung Galaxy S24 Ultra\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "soft toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Samsung Galaxy S24 Ultra\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Samsung Galaxy S24 Ultra\s*$/i }) }).getByRole('button', { name: /^\s*-\s*$/i })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "soft toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Samsung Galaxy S24 Ultra\s*$/i }) }).getByRole('button', { name: /^\s*-\s*$/i })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Test source

```ts
  100 |     const testCase = populatedCartTwoProductsCase;
  101 |     const catalog = new CatalogPage(page);
  102 |     const cart = new CartPage(page);
  103 |     const productNames = testCase.products.map((product) => product.name);
  104 | 
  105 |     expect(productNames).toHaveLength(testCase.expected.counts.distinctProducts);
  106 |     expect(new Set(productNames).size).toBe(
  107 |       testCase.expected.counts.distinctProducts,
  108 |     );
  109 | 
  110 |     await catalog.goto(testCase.paths.home);
  111 |     for (const product of testCase.products) {
  112 |       for (
  113 |         let activation = 0;
  114 |         activation < testCase.expected.counts.addActionsPerProduct;
  115 |         activation += 1
  116 |       ) {
  117 |         await catalog.addProductOnce(
  118 |           product.name,
  119 |           testCase.navigation.addToCartButton,
  120 |         );
  121 |       }
  122 |     }
  123 |     await catalog.openCart(testCase.navigation.cartLink);
  124 |     await assertCurrentPath(page, testCase.paths.cart);
  125 | 
  126 |     await expect.soft(cart.table).toBeVisible();
  127 |     await expect.soft(cart.allLevelOneHeadings).toHaveCount(
  128 |       testCase.expected.counts.levelOneHeadings,
  129 |     );
  130 |     await expect.soft(
  131 |       cart.descriptiveHeading(testCase.expected.heading),
  132 |     ).toBeVisible();
  133 | 
  134 |     for (const columnLabel of Object.values(testCase.expected.columns)) {
  135 |       await expect.soft(
  136 |         cart.columnHeader(columnLabel),
  137 |         `Required cart column ${JSON.stringify(columnLabel)}`,
  138 |       ).toBeVisible();
  139 |     }
  140 | 
  141 |     await expect.soft(cart.dataRows()).toHaveCount(
  142 |       testCase.expected.counts.rows,
  143 |     );
  144 | 
  145 |     for (const product of testCase.products) {
  146 |       const matchingRows = cart.productRows(product.name);
  147 |       await expect.soft(
  148 |         matchingRows,
  149 |         `${product.name} must occupy exactly one cart row`,
  150 |       ).toHaveCount(testCase.expected.counts.rowsPerProduct);
  151 | 
  152 |       const row = cart.productRow(product.name);
  153 |       const displayedUnitPrice = await cart.unitPriceText(
  154 |         row,
  155 |         testCase.expected.columns,
  156 |       );
  157 |       const displayedLineAmount = await cart.lineAmountText(
  158 |         row,
  159 |         testCase.expected.columns,
  160 |       );
  161 | 
  162 |       expect.soft(await cart.quantity(row, testCase.expected.columns)).toBe(
  163 |         product.quantity,
  164 |       );
  165 |       expect.soft(displayedUnitPrice).toContain(
  166 |         testCase.expected.currency.symbol,
  167 |       );
  168 |       expect.soft(
  169 |         !testCase.expected.currency.requireThousandsSeparator ||
  170 |           hasDisplayedThousandsSeparator(displayedUnitPrice),
  171 |         `${product.name} unit price must display a thousands separator`,
  172 |       ).toBe(true);
  173 |       expect.soft(
  174 |         await cart.unitPrice(
  175 |           row,
  176 |           testCase.expected.columns,
  177 |           testCase.expected.currency,
  178 |         ),
  179 |       ).toBe(product.unitPrice);
  180 |       expect.soft(displayedLineAmount).toContain(
  181 |         testCase.expected.currency.symbol,
  182 |       );
  183 |       expect.soft(
  184 |         !testCase.expected.currency.requireThousandsSeparator ||
  185 |           hasDisplayedThousandsSeparator(displayedLineAmount),
  186 |         `${product.name} line amount must display a thousands separator`,
  187 |       ).toBe(true);
  188 |       expect.soft(
  189 |         await cart.lineAmount(
  190 |           row,
  191 |           testCase.expected.columns,
  192 |           testCase.expected.currency,
  193 |         ),
  194 |       ).toBe(product.unitPrice * product.quantity);
  195 |       await expect.soft(
  196 |         cart.incrementButton(row, testCase.expected.controls.increment),
  197 |       ).toHaveCount(testCase.expected.counts.incrementControlsPerRow);
  198 |       await expect.soft(
  199 |         cart.decrementButton(row, testCase.expected.controls.decrement),
> 200 |       ).toHaveCount(testCase.expected.counts.decrementControlsPerRow);
      |         ^ Error: expect(locator).toHaveCount(expected) failed
  201 |     }
  202 |   });
  203 | 
  204 |   test(`${cartInvalidAuthenticationCase.id} ${cartInvalidAuthenticationCase.title}`, async ({
  205 |     request,
  206 |   }) => {
  207 |     const testCase = cartInvalidAuthenticationCase;
  208 |     const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';
  209 |     const loginUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.login);
  210 |     const cartUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.cart);
  211 | 
  212 |     expect(testCase.tokenPartitions).toHaveLength(
  213 |       testCase.expected.tokenPartitionCount,
  214 |     );
  215 | 
  216 |     const loginResponse = await request.post(loginUrl, {
  217 |       data: testCase.loginCredentials,
  218 |     });
  219 |     const loginBody = await responseBody(loginResponse);
  220 |     expect(
  221 |       loginResponse.ok(),
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
```