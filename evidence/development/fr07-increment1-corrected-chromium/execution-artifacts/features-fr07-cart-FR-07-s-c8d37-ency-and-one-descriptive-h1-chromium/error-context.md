# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 1 >> FR07-TC01 populated cart structure, currency, and one descriptive h1
- Location: tests/features/fr07-cart.spec.ts:82:7

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
  86  |     const testCase = populatedCartTwoProductsCase;
  87  |     const catalog = new CatalogPage(page);
  88  |     const cart = new CartPage(page);
  89  |     const productNames = testCase.products.map((product) => product.name);
  90  | 
  91  |     expect(productNames).toHaveLength(testCase.expected.counts.distinctProducts);
  92  |     expect(new Set(productNames).size).toBe(
  93  |       testCase.expected.counts.distinctProducts,
  94  |     );
  95  | 
  96  |     await catalog.goto(testCase.paths.home);
  97  |     for (const product of testCase.products) {
  98  |       for (
  99  |         let activation = 0;
  100 |         activation < testCase.expected.counts.addActionsPerProduct;
  101 |         activation += 1
  102 |       ) {
  103 |         await catalog.addProductOnce(
  104 |           product.name,
  105 |           testCase.navigation.addToCartButton,
  106 |         );
  107 |       }
  108 |     }
  109 |     await catalog.openCart(testCase.navigation.cartLink);
  110 |     await assertCurrentPath(page, testCase.paths.cart);
  111 | 
  112 |     await expect.soft(cart.table).toBeVisible();
  113 |     await expect.soft(cart.allLevelOneHeadings).toHaveCount(
  114 |       testCase.expected.counts.levelOneHeadings,
  115 |     );
  116 |     await expect.soft(
  117 |       cart.descriptiveHeading(testCase.expected.heading),
  118 |     ).toBeVisible();
  119 | 
  120 |     for (const columnLabel of Object.values(testCase.expected.columns)) {
  121 |       await expect.soft(
  122 |         cart.columnHeader(columnLabel),
  123 |         `Required cart column ${JSON.stringify(columnLabel)}`,
  124 |       ).toBeVisible();
  125 |     }
  126 | 
  127 |     await expect.soft(cart.dataRows()).toHaveCount(
  128 |       testCase.expected.counts.rows,
  129 |     );
  130 | 
  131 |     for (const product of testCase.products) {
  132 |       const matchingRows = cart.productRows(product.name);
  133 |       await expect.soft(
  134 |         matchingRows,
  135 |         `${product.name} must occupy exactly one cart row`,
  136 |       ).toHaveCount(testCase.expected.counts.rowsPerProduct);
  137 | 
  138 |       const row = cart.productRow(product.name);
  139 |       const displayedUnitPrice = await cart.unitPriceText(
  140 |         row,
  141 |         testCase.expected.columns,
  142 |       );
  143 |       const displayedLineAmount = await cart.lineAmountText(
  144 |         row,
  145 |         testCase.expected.columns,
  146 |       );
  147 | 
  148 |       expect.soft(await cart.quantity(row, testCase.expected.columns)).toBe(
  149 |         product.quantity,
  150 |       );
  151 |       expect.soft(displayedUnitPrice).toContain(
  152 |         testCase.expected.currency.symbol,
  153 |       );
  154 |       expect.soft(
  155 |         !testCase.expected.currency.requireThousandsSeparator ||
  156 |           hasDisplayedThousandsSeparator(displayedUnitPrice),
  157 |         `${product.name} unit price must display a thousands separator`,
  158 |       ).toBe(true);
  159 |       expect.soft(
  160 |         await cart.unitPrice(
  161 |           row,
  162 |           testCase.expected.columns,
  163 |           testCase.expected.currency,
  164 |         ),
  165 |       ).toBe(product.unitPrice);
  166 |       expect.soft(displayedLineAmount).toContain(
  167 |         testCase.expected.currency.symbol,
  168 |       );
  169 |       expect.soft(
  170 |         !testCase.expected.currency.requireThousandsSeparator ||
  171 |           hasDisplayedThousandsSeparator(displayedLineAmount),
  172 |         `${product.name} line amount must display a thousands separator`,
  173 |       ).toBe(true);
  174 |       expect.soft(
  175 |         await cart.lineAmount(
  176 |           row,
  177 |           testCase.expected.columns,
  178 |           testCase.expected.currency,
  179 |         ),
  180 |       ).toBe(product.unitPrice * product.quantity);
  181 |       await expect.soft(
  182 |         cart.incrementButton(row, testCase.expected.controls.increment),
  183 |       ).toHaveCount(testCase.expected.counts.incrementControlsPerRow);
  184 |       await expect.soft(
  185 |         cart.decrementButton(row, testCase.expected.controls.decrement),
> 186 |       ).toHaveCount(testCase.expected.counts.decrementControlsPerRow);
      |         ^ Error: expect(locator).toHaveCount(expected) failed
  187 |     }
  188 |   });
  189 | 
  190 |   test(`${cartInvalidAuthenticationCase.id} ${cartInvalidAuthenticationCase.title}`, async ({
  191 |     request,
  192 |   }) => {
  193 |     const testCase = cartInvalidAuthenticationCase;
  194 |     const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';
  195 |     const loginUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.login);
  196 |     const cartUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.cart);
  197 | 
  198 |     expect(testCase.tokenPartitions).toHaveLength(
  199 |       testCase.expected.tokenPartitionCount,
  200 |     );
  201 | 
  202 |     const loginResponse = await request.post(loginUrl, {
  203 |       data: testCase.loginCredentials,
  204 |     });
  205 |     const loginBody = await responseBody(loginResponse);
  206 |     expect(
  207 |       loginResponse.ok(),
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
```