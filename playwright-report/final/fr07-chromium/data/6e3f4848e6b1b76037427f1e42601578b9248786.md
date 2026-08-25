# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 3 >> FR07-TC09 cart breadcrumb, current navigation state, and semantic return home
- Location: tests/features/fr07-cart.spec.ts:1190:7

# Error details

```
Error: The cart child page must expose a named semantic breadcrumb with a current-page item.

expect(locator).toHaveCount(expected) failed

Locator:  getByRole('main').getByRole('navigation', { name: /\S/u }).filter({ has: getByText(/^\s*Giỏ hàng\s*$/i) })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - The cart child page must expose a named semantic breadcrumb with a current-page item. with timeout 5000ms
  - waiting for getByRole('main').getByRole('navigation', { name: /\S/u }).filter({ has: getByText(/^\s*Giỏ hàng\s*$/i) })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('navigation').getByRole('link', { name: /^\s*Giỏ hàng(?:\s.*)?$/i })
Expected: "page"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "soft toHaveAttribute" with timeout 5000ms
  - waiting for getByRole('navigation').getByRole('link', { name: /^\s*Giỏ hàng(?:\s.*)?$/i })
    14 × locator resolved to <a href="/cart" data-discover="true" class="hover:underline">Giỏ hàng</a>
       - unexpected value "null"

```

```yaml
- link "Giỏ hàng":
  - /url: /cart
```

```
Error: Required visible shopping label "Tiếp tục mua sắm"

expect(locator).toHaveCount(expected) failed

Locator:  getByRole('main').getByRole('link', { name: /^\s*Tiếp tục mua sắm\s*$/i })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Required visible shopping label "Tiếp tục mua sắm" with timeout 5000ms
  - waiting for getByRole('main').getByRole('link', { name: /^\s*Tiếp tục mua sắm\s*$/i })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Test source

```ts
  1153 |       remainingProduct.name,
  1154 |       remainingRow,
  1155 |       testCase.expected.columns,
  1156 |       testCase.expected.currency,
  1157 |     );
  1158 |     expect(afterConfirmRemaining).toEqual(baselineRemaining);
  1159 |     expect(afterConfirmCart.total).toBe(testCase.expected.finalTotal);
  1160 |     expect(afterConfirmCart.lineAmountSum).toBe(
  1161 |       testCase.expected.finalLineAmountSum,
  1162 |     );
  1163 |     expect(afterConfirmCart.total - baselineCart.total).toBe(
  1164 |       testCase.expected.deltas.cartTotal,
  1165 |     );
  1166 |     expect(afterConfirmCart.total).toBe(
  1167 |       baselineCart.total - baselineSelected.lineAmount,
  1168 |     );
  1169 |     expect(afterConfirmCart.total).toBe(afterConfirmCart.lineAmountSum);
  1170 | 
  1171 |     const cartBadge = cart.cartBadge(
  1172 |       testCase.navigation.cartLink,
  1173 |       testCase.badge.numericTextPattern,
  1174 |     );
  1175 |     await expect(cartBadge).toHaveCount(testCase.expected.counts.cartBadges);
  1176 |     await expect(cartBadge).toBeVisible();
  1177 |     await expect(cartBadge).toHaveText(
  1178 |       String(testCase.badge.remainingCartCount),
  1179 |     );
  1180 |     expect(
  1181 |       await cart.cartBadgeCount(
  1182 |         testCase.navigation.cartLink,
  1183 |         testCase.badge.numericTextPattern,
  1184 |       ),
  1185 |     ).toBe(testCase.badge.remainingCartCount);
  1186 |   });
  1187 | });
  1188 | 
  1189 | test.describe('FR-07 shopping cart — reviewed increment 3', () => {
  1190 |   test(`${cartNavigationCase.id} ${cartNavigationCase.title}`, async ({
  1191 |     page,
  1192 |   }) => {
  1193 |     test.slow();
  1194 |     const testCase = cartNavigationCase;
  1195 |     const catalog = new CatalogPage(page);
  1196 |     const cart = new CartPage(page);
  1197 | 
  1198 |     await catalog.goto(testCase.paths.home);
  1199 |     const addButton = catalog.addToCartButton(
  1200 |       testCase.product.name,
  1201 |       testCase.navigation.addToCartButton,
  1202 |     );
  1203 |     await expect(addButton).toBeVisible();
  1204 |     for (
  1205 |       let activation = 0;
  1206 |       activation < testCase.actionCounts.add;
  1207 |       activation += 1
  1208 |     ) {
  1209 |       await catalog.addProductOnce(
  1210 |         testCase.product.name,
  1211 |         testCase.navigation.addToCartButton,
  1212 |       );
  1213 |     }
  1214 |     await catalog.openCart(testCase.navigation.cartLink);
  1215 |     await assertCurrentPath(page, testCase.paths.cart);
  1216 |     await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows);
  1217 | 
  1218 |     const breadcrumb = cart.semanticBreadcrumb(
  1219 |       testCase.expected.breadcrumb.currentPageLabel,
  1220 |     );
  1221 |     await expect.soft(
  1222 |       breadcrumb,
  1223 |       'The cart child page must expose a named semantic breadcrumb with a current-page item.',
  1224 |     ).toHaveCount(testCase.expected.counts.breadcrumbs);
  1225 |     const breadcrumbCount = await breadcrumb.count();
  1226 |     if (breadcrumbCount === testCase.expected.counts.breadcrumbs) {
  1227 |       await expect.soft(breadcrumb).toBeVisible();
  1228 |     }
  1229 | 
  1230 |     const cartNavbarLink = cart.cartNavbarLink(
  1231 |       testCase.navigation.cartLink,
  1232 |     );
  1233 |     await expect.soft(cartNavbarLink).toHaveCount(
  1234 |       testCase.expected.counts.cartNavbarLinks,
  1235 |     );
  1236 |     const cartNavbarLinkCount = await cartNavbarLink.count();
  1237 |     if (cartNavbarLinkCount === testCase.expected.counts.cartNavbarLinks) {
  1238 |       await expect.soft(cartNavbarLink).toBeVisible();
  1239 |       if (await cartNavbarLink.isVisible()) {
  1240 |         await expect.soft(cartNavbarLink).toHaveAttribute(
  1241 |           testCase.expected.navbar.currentStateAttribute,
  1242 |           testCase.expected.navbar.currentStateValue,
  1243 |         );
  1244 |       }
  1245 |     }
  1246 | 
  1247 |     const requiredLabelLink = cart.requiredContinueShoppingLink(
  1248 |       testCase.navigation.requiredContinueShoppingLabel,
  1249 |     );
  1250 |     await expect.soft(
  1251 |       requiredLabelLink,
  1252 |       `Required visible shopping label ${JSON.stringify(testCase.navigation.requiredContinueShoppingLabel)}`,
> 1253 |     ).toHaveCount(testCase.expected.counts.requiredContinueShoppingLinks);
       |       ^ Error: Required visible shopping label "Tiếp tục mua sắm"
  1254 |     const requiredLabelLinkCount = await requiredLabelLink.count();
  1255 |     if (
  1256 |       requiredLabelLinkCount ===
  1257 |       testCase.expected.counts.requiredContinueShoppingLinks
  1258 |     ) {
  1259 |       await expect.soft(requiredLabelLink).toBeVisible();
  1260 |     }
  1261 | 
  1262 |     const homeDestinationLink = cart.semanticShoppingDestinationLink(
  1263 |       testCase.navigation.shoppingDestinationMeaningTerms,
  1264 |     );
  1265 |     await expect.soft(homeDestinationLink).toHaveCount(
  1266 |       testCase.expected.counts.homeDestinationLinks,
  1267 |     );
  1268 |     const homeDestinationLinkCount = await homeDestinationLink.count();
  1269 |     if (
  1270 |       homeDestinationLinkCount ===
  1271 |       testCase.expected.counts.homeDestinationLinks
  1272 |     ) {
  1273 |       await expect.soft(homeDestinationLink).toBeVisible();
  1274 |       if (await homeDestinationLink.isVisible()) {
  1275 |         expect(testCase.actionCounts.homeDestination).toBe(1);
  1276 |         await homeDestinationLink.click();
  1277 |       }
  1278 |     }
  1279 | 
  1280 |     await expect.soft(
  1281 |       catalog.homeIdentity(testCase.expected.destinationIdentity.heading),
  1282 |       'The shopping destination must identify the Home page independently of its URL.',
  1283 |     ).toBeVisible();
  1284 |   });
  1285 | 
  1286 |   test(`${cartTotalFormattingCase.id} ${cartTotalFormattingCase.title}`, async ({
  1287 |     page,
  1288 |   }) => {
  1289 |     const testCase = cartTotalFormattingCase;
  1290 |     const catalog = new CatalogPage(page);
  1291 |     const cart = new CartPage(page);
  1292 | 
  1293 |     await catalog.goto(testCase.paths.home);
  1294 |     const addButton = catalog.addToCartButton(
  1295 |       testCase.product.name,
  1296 |       testCase.navigation.addToCartButton,
  1297 |     );
  1298 |     await expect(addButton).toBeVisible();
  1299 |     for (
  1300 |       let activation = 0;
  1301 |       activation < testCase.actionCounts.add;
  1302 |       activation += 1
  1303 |     ) {
  1304 |       await catalog.addProductOnce(
  1305 |         testCase.product.name,
  1306 |         testCase.navigation.addToCartButton,
  1307 |       );
  1308 |     }
  1309 |     await catalog.openCart(testCase.navigation.cartLink);
  1310 |     await assertCurrentPath(page, testCase.paths.cart);
  1311 | 
  1312 |     const dataRows = cart.dataRows();
  1313 |     const productRows = cart.productRows(testCase.product.name);
  1314 |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  1315 |     const summaryContainer = cart.exactTotalSummaryContainer(
  1316 |       testCase.expected.currency,
  1317 |     );
  1318 | 
  1319 |     await expect.soft(dataRows).toHaveCount(testCase.expected.counts.rows);
  1320 |     await expect.soft(productRows).toHaveCount(
  1321 |       testCase.expected.counts.rowsForProduct,
  1322 |     );
  1323 |     await expect.soft(summaryAmount).toHaveCount(
  1324 |       testCase.expected.counts.summaryAmounts,
  1325 |     );
  1326 |     await expect.soft(summaryAmount).toBeVisible();
  1327 |     await expect.soft(summaryContainer).toHaveCount(
  1328 |       testCase.expected.counts.summaryContainers,
  1329 |     );
  1330 |     await expect.soft(summaryContainer).toBeVisible();
  1331 | 
  1332 |     if (
  1333 |       (await summaryAmount.count()) ===
  1334 |         testCase.expected.counts.summaryAmounts &&
  1335 |       (await summaryContainer.count()) ===
  1336 |         testCase.expected.counts.summaryContainers &&
  1337 |       (await summaryAmount.isVisible()) &&
  1338 |       (await summaryContainer.isVisible())
  1339 |     ) {
  1340 |       const exactTotalLabel = await cart.exactTotalLabelText(
  1341 |         testCase.expected.currency,
  1342 |       );
  1343 |       expect.soft(exactTotalLabel).toBe(testCase.expected.totalLabel);
  1344 |       expect.soft(exactTotalLabel).not.toBe(
  1345 |         testCase.expected.forbiddenTotalLabel,
  1346 |       );
  1347 |     }
  1348 | 
  1349 |     const rowCount = await dataRows.count();
  1350 |     if (rowCount === testCase.expected.counts.rows) {
  1351 |       const rows = await dataRows.all();
  1352 |       for (const row of rows) {
  1353 |         await expect.soft(
```