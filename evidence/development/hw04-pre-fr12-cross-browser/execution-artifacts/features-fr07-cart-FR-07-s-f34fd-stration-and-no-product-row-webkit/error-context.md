# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 3 >> FR07-TC11 natural empty cart message, accessible illustration, and no product row
- Location: tests/features/fr07-cart.spec.ts:1387:7

# Error details

```
Error: The empty cart must expose an accessible illustration with a meaningful name.

expect(locator).toHaveCount(expected) failed

Locator:  getByRole('main').getByRole('img', { name: /\S/u })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - The empty cart must expose an accessible illustration with a meaningful name. with timeout 5000ms
  - waiting for getByRole('main').getByRole('img', { name: /\S/u })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('main').getByRole('img', { name: /\S/u })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "soft toBeVisible" with timeout 5000ms
  - waiting for getByRole('main').getByRole('img', { name: /\S/u })

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
  - heading "Giỏ hàng của bạn đang trống" [level=2]
  - link "Tiếp tục mua sắm":
    - /url: /
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
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
> 1415 |     await expect.soft(emptyStateIllustration).toBeVisible();
       |                                               ^ Error: expect(locator).toBeVisible() failed
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
  1445 |     await catalog.openProductDetail(
  1446 |       testCase.targetProduct.name,
  1447 |       testCase.navigation.productDetailLink,
  1448 |     );
  1449 |     await expect(
  1450 |       productDetail.productHeading(testCase.targetProduct.name),
  1451 |     ).toBeVisible();
  1452 | 
  1453 |     const displayedProductImages = productDetail.displayedProductImages(
  1454 |       testCase.targetProduct.name,
  1455 |     );
  1456 |     await expect.soft(displayedProductImages).toHaveCount(
  1457 |       testCase.expected.counts.productImages,
  1458 |     );
  1459 |     const displayedProductImageCount = await displayedProductImages.count();
  1460 |     for (let index = 0; index < displayedProductImageCount; index += 1) {
  1461 |       const productImage = displayedProductImages.nth(index);
  1462 |       await expect.soft(productImage).toBeVisible();
  1463 |       if (await productImage.isVisible()) {
  1464 |         const alternativeText = await productImage.getAttribute('alt');
  1465 |         if (testCase.expected.imageAlt.requireNonEmpty) {
  1466 |           expect.soft(alternativeText?.trim()).toBeTruthy();
  1467 |         }
  1468 |         if (testCase.expected.imageAlt.requireProductIdentity) {
  1469 |           expect.soft(alternativeText).toContain(testCase.targetProduct.name);
  1470 |         }
  1471 |       }
  1472 |     }
  1473 | 
  1474 |     const initialCartBadge = await cart.semanticCartBadge(
  1475 |       testCase.navigation.cartLink,
  1476 |       testCase.badge.numericTextPattern,
  1477 |     );
  1478 |     await expect.soft(
  1479 |       initialCartBadge,
  1480 |       'The Giỏ hàng navigation entry must expose its initial numeric badge.',
  1481 |     ).toHaveCount(testCase.expected.counts.cartBadges);
  1482 |     const initialCartBadgeCount = await initialCartBadge.count();
  1483 |     let observedInitialBadgeCount: number | null = null;
  1484 |     if (
  1485 |       initialCartBadgeCount === testCase.expected.counts.cartBadges
  1486 |     ) {
  1487 |       await expect.soft(initialCartBadge).toBeVisible();
  1488 |       if (await initialCartBadge.isVisible()) {
  1489 |         try {
  1490 |           observedInitialBadgeCount = await cart.semanticCartBadgeCount(
  1491 |             initialCartBadge,
  1492 |           );
  1493 |           expect.soft(observedInitialBadgeCount).toBe(
  1494 |             testCase.initialState.cartBadgeCount,
  1495 |           );
  1496 |         } catch (error) {
  1497 |           expect.soft(
  1498 |             error,
  1499 |             'The initial associated cart badge must contain only a strict integer.',
  1500 |           ).toBeNull();
  1501 |         }
  1502 |       }
  1503 |     }
  1504 | 
  1505 |     const quantityControl = productDetail.quantityInput(
  1506 |       testCase.targetProduct.name,
  1507 |     );
  1508 |     await expect(
  1509 |       quantityControl,
  1510 |       'The displayed target Product Detail must expose one visible quantity control.',
  1511 |     ).toHaveCount(testCase.expected.counts.quantityControls);
  1512 |     await expect(quantityControl).toBeVisible();
  1513 |     await expect(
  1514 |       quantityControl,
  1515 |       'The visible quantity submitted by the single Add activation must equal the external target quantity.',
```