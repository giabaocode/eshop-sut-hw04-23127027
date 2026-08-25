# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 3 >> FR07-TC10 exact total label, currency formatting, and displayed arithmetic
- Location: tests/features/fr07-cart.spec.ts:1286:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Tổng cộng"
Received: "Tổng tạm tính"
```

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not "Tổng tạm tính"
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
            - cell "Bàn phím cơ Keychron Q1" [ref=e23]
            - cell "4,000,000 ₫" [ref=e24]
            - cell "1" [ref=e25]
            - cell "4,000,000 ₫" [ref=e26]
            - cell [ref=e27]:
              - button "Xóa" [ref=e28] [cursor=pointer]
      - generic [ref=e29]:
        - generic [ref=e30]:
          - text: "Tổng tạm tính:"
          - generic [ref=e31]: 4,000,000 ₫
        - generic [ref=e32]:
          - link "← Mua tiếp" [ref=e33] [cursor=pointer]:
            - /url: /
          - button "Tiến hành thanh toán" [ref=e34] [cursor=pointer]
  - contentinfo [ref=e35]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  1244 |       }
  1245 |     }
  1246 | 
  1247 |     const requiredLabelLink = cart.requiredContinueShoppingLink(
  1248 |       testCase.navigation.requiredContinueShoppingLabel,
  1249 |     );
  1250 |     await expect.soft(
  1251 |       requiredLabelLink,
  1252 |       `Required visible shopping label ${JSON.stringify(testCase.navigation.requiredContinueShoppingLabel)}`,
  1253 |     ).toHaveCount(testCase.expected.counts.requiredContinueShoppingLinks);
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
> 1344 |       expect.soft(exactTotalLabel).not.toBe(
       |                                        ^ Error: expect(received).not.toBe(expected) // Object.is equality
  1345 |         testCase.expected.forbiddenTotalLabel,
  1346 |       );
  1347 |     }
  1348 | 
  1349 |     const rowCount = await dataRows.count();
  1350 |     if (rowCount === testCase.expected.counts.rows) {
  1351 |       const rows = await dataRows.all();
  1352 |       for (const row of rows) {
  1353 |         await expect.soft(
  1354 |           cart.lineAmountCell(row, testCase.expected.columns),
  1355 |         ).toBeVisible();
  1356 |       }
  1357 |     }
  1358 | 
  1359 |     if (
  1360 |       rowCount === testCase.expected.counts.rows &&
  1361 |       (await summaryAmount.count()) ===
  1362 |         testCase.expected.counts.summaryAmounts &&
  1363 |       (await summaryAmount.isVisible())
  1364 |     ) {
  1365 |       const displayedTotalText = await summaryAmount.innerText();
  1366 |       const displayedTotal = await cart.cartSummaryTotal(
  1367 |         testCase.expected.currency,
  1368 |       );
  1369 |       const displayedLineAmountSum = await cart.sumDisplayedLineAmounts(
  1370 |         testCase.expected.columns,
  1371 |         testCase.expected.currency,
  1372 |       );
  1373 | 
  1374 |       expect.soft(displayedTotalText).toContain(
  1375 |         testCase.expected.currency.symbol,
  1376 |       );
  1377 |       expect.soft(
  1378 |         !testCase.expected.currency.requireThousandsSeparator ||
  1379 |           hasDisplayedThousandsSeparator(displayedTotalText),
  1380 |         'The displayed cart total must contain a thousands separator.',
  1381 |       ).toBe(true);
  1382 |       expect.soft(displayedTotal).toBe(testCase.expected.total);
  1383 |       expect.soft(displayedTotal).toBe(displayedLineAmountSum);
  1384 |     }
  1385 |   });
  1386 | 
  1387 |   test(`${emptyCartCase.id} ${emptyCartCase.title}`, async ({ page }) => {
  1388 |     const testCase = emptyCartCase;
  1389 |     const catalog = new CatalogPage(page);
  1390 |     const cart = new CartPage(page);
  1391 | 
  1392 |     expect(testCase.initialState.naturalFreshContext).toBe(true);
  1393 |     expect(testCase.initialState.cartProductRows).toBe(
  1394 |       testCase.expected.counts.rows,
  1395 |     );
  1396 | 
  1397 |     await catalog.goto(testCase.paths.home);
  1398 |     await catalog.openCart(testCase.navigation.cartLink);
  1399 |     await assertCurrentPath(page, testCase.paths.cart);
  1400 | 
  1401 |     const emptyStateMessage = cart.emptyStateMessage(
  1402 |       testCase.expected.messageMeaningTerms,
  1403 |     );
  1404 |     await expect.soft(
  1405 |       emptyStateMessage,
  1406 |       'The empty cart must expose a clear non-empty semantic message.',
  1407 |     ).toHaveCount(testCase.expected.counts.messages);
  1408 |     await expect.soft(emptyStateMessage).toBeVisible();
  1409 | 
  1410 |     const emptyStateIllustration = cart.accessibleEmptyStateIllustration();
  1411 |     await expect.soft(
  1412 |       emptyStateIllustration,
  1413 |       'The empty cart must expose an accessible illustration with a meaningful name.',
  1414 |     ).toHaveCount(testCase.expected.counts.illustrations);
  1415 |     await expect.soft(emptyStateIllustration).toBeVisible();
  1416 | 
  1417 |     await expect.soft(
  1418 |       cart.dataRows(),
  1419 |       'A naturally empty cart must not show a populated product row.',
  1420 |     ).toHaveCount(testCase.expected.counts.rows);
  1421 |   });
  1422 | 
  1423 |   test(`${productDetailAddToCartCase.id} ${productDetailAddToCartCase.title}`, async ({
  1424 |     page,
  1425 |   }) => {
  1426 |     test.slow();
  1427 |     const testCase = productDetailAddToCartCase;
  1428 |     const catalog = new CatalogPage(page);
  1429 |     const productDetail = new ProductDetailPage(page);
  1430 |     const cart = new CartPage(page);
  1431 | 
  1432 |     expect(testCase.initialState.naturalFreshContext).toBe(true);
  1433 |     expect(testCase.initialState.targetProductAbsent).toBe(true);
  1434 |     expect(testCase.actionCounts.add).toBe(1);
  1435 | 
  1436 |     await catalog.goto(testCase.paths.home);
  1437 |     const detailLink = catalog.productDetailLink(
  1438 |       testCase.targetProduct.name,
  1439 |       testCase.navigation.productDetailLink,
  1440 |     );
  1441 |     await expect(detailLink).toHaveCount(
  1442 |       testCase.expected.counts.productDetailLinks,
  1443 |     );
  1444 |     await expect(detailLink).toBeVisible();
```