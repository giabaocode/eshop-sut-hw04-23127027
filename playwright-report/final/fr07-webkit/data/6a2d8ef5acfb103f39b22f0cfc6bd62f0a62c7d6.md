# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — reviewed increment 3 >> FR07-TC12 product image alt, one detail Add activation, feedback, and badge delta
- Location: tests/features/fr07-cart.spec.ts:1423:7

# Error details

```
Error: The Giỏ hàng navigation entry must expose its initial numeric badge.

expect(locator).toHaveCount(expected) failed

Locator:  getByRole('navigation').getByRole('link', { name: /^\s*Giỏ hàng(?:\s.*)?$/i }).getByText('/^\\s*(?:[0-9]+)\\s*$/u')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - The Giỏ hàng navigation entry must expose its initial numeric badge. with timeout 5000ms
  - waiting for getByRole('navigation').getByRole('link', { name: /^\s*Giỏ hàng(?:\s.*)?$/i }).getByText('/^\\s*(?:[0-9]+)\\s*$/u')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: One Add activation must produce a new or changed scoped semantic notification or a visible Add-control text/state transition.

One Add activation must produce a new or changed scoped semantic notification or a visible Add-control text/state transition.

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 1
Received:    0

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

```
Error: The Giỏ hàng navigation entry must expose its updated numeric badge.

expect(locator).toHaveCount(expected) failed

Locator:  getByRole('navigation').getByRole('link', { name: /^\s*Giỏ hàng(?:\s.*)?$/i }).getByText('/^\\s*(?:[0-9]+)\\s*$/u')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - The Giỏ hàng navigation entry must expose its updated numeric badge. with timeout 5000ms
  - waiting for getByRole('navigation').getByRole('link', { name: /^\s*Giỏ hàng(?:\s.*)?$/i }).getByText('/^\\s*(?:[0-9]+)\\s*$/u')
    14 × locator resolved to 0 elements
       - unexpected value "0"

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
      - img "MacBook Pro M3" [ref=e13]
      - generic [ref=e14]:
        - heading "MacBook Pro M3" [level=1] [ref=e15]
        - paragraph [ref=e16]: 45,000,000 ₫
        - paragraph [ref=e17]: Laptop chuyên nghiệp mạnh mẽ
        - generic [ref=e18]:
          - generic [ref=e19]: "Số lượng:"
          - spinbutton [ref=e20]: "1"
        - button "Thêm vào giỏ hàng" [ref=e21] [cursor=pointer]
  - contentinfo [ref=e22]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
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
  1516 |     ).toHaveValue(String(testCase.targetProduct.quantity));
  1517 | 
  1518 |     const addButton = productDetail.addToCartButton(
  1519 |       testCase.targetProduct.name,
  1520 |       testCase.navigation.productDetailAddToCartButton,
  1521 |     );
  1522 |     await expect(addButton).toBeVisible();
  1523 |     const feedbackBaseline = await productDetail.captureAddFeedbackBaseline(
  1524 |       testCase.targetProduct.name,
  1525 |       addButton,
  1526 |       testCase.feedback.semanticRoles,
  1527 |     );
  1528 |     await productDetail.addToCartOnce(
  1529 |       testCase.targetProduct.name,
  1530 |       testCase.navigation.productDetailAddToCartButton,
  1531 |     );
  1532 | 
  1533 |     await expect.soft
  1534 |       .poll(
  1535 |         async () =>
  1536 |           productDetail.addFeedbackTransitionCount(
  1537 |             testCase.targetProduct.name,
  1538 |             feedbackBaseline,
  1539 |             testCase.feedback.semanticRoles,
  1540 |             testCase.feedback.allowControlStateOrTextTransition,
  1541 |           ),
  1542 |         'One Add activation must produce a new or changed scoped semantic notification or a visible Add-control text/state transition.',
  1543 |       )
  1544 |       .toBeGreaterThanOrEqual(
  1545 |         testCase.expected.counts.minimumFeedbackSignals,
  1546 |       );
  1547 | 
  1548 |     const updatedCartBadge = await cart.semanticCartBadge(
  1549 |       testCase.navigation.cartLink,
  1550 |       testCase.badge.numericTextPattern,
  1551 |     );
  1552 |     await expect.soft(
  1553 |       updatedCartBadge,
  1554 |       'The Giỏ hàng navigation entry must expose its updated numeric badge.',
> 1555 |     ).toHaveCount(testCase.expected.counts.cartBadges);
       |       ^ Error: The Giỏ hàng navigation entry must expose its updated numeric badge.
  1556 |     const updatedCartBadgeCount = await updatedCartBadge.count();
  1557 |     if (
  1558 |       updatedCartBadgeCount === testCase.expected.counts.cartBadges
  1559 |     ) {
  1560 |       await expect.soft(updatedCartBadge).toBeVisible();
  1561 |       if (await updatedCartBadge.isVisible()) {
  1562 |         try {
  1563 |           const observedUpdatedBadgeCount =
  1564 |             await cart.semanticCartBadgeCount(updatedCartBadge);
  1565 |           expect.soft(observedUpdatedBadgeCount).toBe(
  1566 |             testCase.initialState.cartBadgeCount +
  1567 |               testCase.badge.expectedDelta,
  1568 |           );
  1569 |           if (observedInitialBadgeCount !== null) {
  1570 |             expect.soft(
  1571 |               observedUpdatedBadgeCount - observedInitialBadgeCount,
  1572 |             ).toBe(testCase.badge.expectedDelta);
  1573 |           }
  1574 |         } catch (error) {
  1575 |           expect.soft(
  1576 |             error,
  1577 |             'The updated associated cart badge must contain only a strict integer.',
  1578 |           ).toBeNull();
  1579 |         }
  1580 |       }
  1581 |     }
  1582 |   });
  1583 | });
  1584 | 
```