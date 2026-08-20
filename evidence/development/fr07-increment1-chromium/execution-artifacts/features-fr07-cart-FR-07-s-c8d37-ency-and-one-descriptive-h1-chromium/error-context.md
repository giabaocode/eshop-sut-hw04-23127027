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
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Samsung Galaxy S24 Ultra\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
Expected: 1
Received: 0

Call log:
  - Expect "soft toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Samsung Galaxy S24 Ultra\s*$/i }) }).getByRole('button', { name: /^\s*\+\s*$/i })
    13 × locator resolved to 0 elements
       - unexpected value "0"
  - Test ended.

```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell', { name: /^\s*Samsung Galaxy S24 Ultra\s*$/i }) }).getByRole('button', { name: /^\s*-\s*$/i })
Expected: 1
Received: undefined

```

# Test source

```ts
  85  |     const testCase = populatedCartTwoProductsCase;
  86  |     const catalog = new CatalogPage(page);
  87  |     const cart = new CartPage(page);
  88  |     const productNames = testCase.products.map((product) => product.name);
  89  | 
  90  |     expect(productNames).toHaveLength(testCase.expected.counts.distinctProducts);
  91  |     expect(new Set(productNames).size).toBe(
  92  |       testCase.expected.counts.distinctProducts,
  93  |     );
  94  | 
  95  |     await catalog.goto(testCase.paths.home);
  96  |     for (const product of testCase.products) {
  97  |       for (
  98  |         let activation = 0;
  99  |         activation < testCase.expected.counts.addActionsPerProduct;
  100 |         activation += 1
  101 |       ) {
  102 |         await catalog.addProductOnce(
  103 |           product.name,
  104 |           testCase.navigation.addToCartButton,
  105 |         );
  106 |       }
  107 |     }
  108 |     await catalog.openCart(testCase.navigation.cartLink);
  109 |     await assertCurrentPath(page, testCase.paths.cart);
  110 | 
  111 |     await expect.soft(cart.table).toBeVisible();
  112 |     await expect.soft(cart.allLevelOneHeadings).toHaveCount(
  113 |       testCase.expected.counts.levelOneHeadings,
  114 |     );
  115 |     await expect.soft(
  116 |       cart.descriptiveHeading(testCase.expected.heading),
  117 |     ).toBeVisible();
  118 | 
  119 |     for (const columnLabel of Object.values(testCase.expected.columns)) {
  120 |       await expect.soft(
  121 |         cart.columnHeader(columnLabel),
  122 |         `Required cart column ${JSON.stringify(columnLabel)}`,
  123 |       ).toBeVisible();
  124 |     }
  125 | 
  126 |     await expect.soft(cart.dataRows()).toHaveCount(
  127 |       testCase.expected.counts.rows,
  128 |     );
  129 | 
  130 |     for (const product of testCase.products) {
  131 |       const matchingRows = cart.productRows(product.name);
  132 |       await expect.soft(
  133 |         matchingRows,
  134 |         `${product.name} must occupy exactly one cart row`,
  135 |       ).toHaveCount(testCase.expected.counts.rowsPerProduct);
  136 | 
  137 |       const row = cart.productRow(product.name);
  138 |       const displayedUnitPrice = await cart.unitPriceText(
  139 |         row,
  140 |         testCase.expected.columns,
  141 |       );
  142 |       const displayedLineAmount = await cart.lineAmountText(
  143 |         row,
  144 |         testCase.expected.columns,
  145 |       );
  146 | 
  147 |       expect.soft(await cart.quantity(row, testCase.expected.columns)).toBe(
  148 |         product.quantity,
  149 |       );
  150 |       expect.soft(displayedUnitPrice).toContain(
  151 |         testCase.expected.currency.symbol,
  152 |       );
  153 |       expect.soft(
  154 |         !testCase.expected.currency.requireThousandsSeparator ||
  155 |           hasDisplayedThousandsSeparator(displayedUnitPrice),
  156 |         `${product.name} unit price must display a thousands separator`,
  157 |       ).toBe(true);
  158 |       expect.soft(
  159 |         await cart.unitPrice(
  160 |           row,
  161 |           testCase.expected.columns,
  162 |           testCase.expected.currency,
  163 |         ),
  164 |       ).toBe(product.unitPrice);
  165 |       expect.soft(displayedLineAmount).toContain(
  166 |         testCase.expected.currency.symbol,
  167 |       );
  168 |       expect.soft(
  169 |         !testCase.expected.currency.requireThousandsSeparator ||
  170 |           hasDisplayedThousandsSeparator(displayedLineAmount),
  171 |         `${product.name} line amount must display a thousands separator`,
  172 |       ).toBe(true);
  173 |       expect.soft(
  174 |         await cart.lineAmount(
  175 |           row,
  176 |           testCase.expected.columns,
  177 |           testCase.expected.currency,
  178 |         ),
  179 |       ).toBe(product.unitPrice * product.quantity);
  180 |       await expect.soft(
  181 |         cart.incrementButton(row, testCase.expected.controls.increment),
  182 |       ).toHaveCount(testCase.expected.counts.incrementControlsPerRow);
  183 |       await expect.soft(
  184 |         cart.decrementButton(row, testCase.expected.controls.decrement),
> 185 |       ).toHaveCount(testCase.expected.counts.decrementControlsPerRow);
      |         ^ Error: expect(locator).toHaveCount(expected) failed
  186 |     }
  187 |   });
  188 | 
  189 |   test(`${cartInvalidAuthenticationCase.id} ${cartInvalidAuthenticationCase.title}`, async ({
  190 |     request,
  191 |   }) => {
  192 |     const testCase = cartInvalidAuthenticationCase;
  193 |     const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';
  194 |     const loginUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.login);
  195 |     const cartUrl = absoluteApiUrl(apiBaseUrl, testCase.endpoints.cart);
  196 | 
  197 |     expect(testCase.tokenPartitions).toHaveLength(
  198 |       testCase.expected.tokenPartitionCount,
  199 |     );
  200 | 
  201 |     const loginResponse = await request.post(loginUrl, {
  202 |       data: testCase.loginCredentials,
  203 |     });
  204 |     const loginBody = await responseBody(loginResponse);
  205 |     expect(
  206 |       loginResponse.ok(),
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
```