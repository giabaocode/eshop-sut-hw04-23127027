# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC05 decrement quantity from 2 to 1 and recalculate totals
- Location: tests/features/fr07-cart.spec.ts:457:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table').getByRole('row').filter({ has: getByRole('cell') })
Expected: 2
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('table').getByRole('row').filter({ has: getByRole('cell') })
    - locator resolved to 0 elements
    - unexpected value "0"
    13 × locator resolved to 1 element
       - unexpected value "1"

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
  429 |     );
  430 |     const afterLineAmountSum = await cart.sumDisplayedLineAmounts(
  431 |       testCase.expected.columns,
  432 |       testCase.expected.currency,
  433 |     );
  434 |     const afterCartTotal = await cart.cartTotal(
  435 |       testCase.expected.totalLabel,
  436 |       testCase.expected.currency,
  437 |     );
  438 | 
  439 |     expect(afterRowCount).toBe(beforeRowCount);
  440 |     expect(afterQuantity).toBe(beforeQuantity + 1);
  441 |     expect(afterQuantity).toBe(testCase.product.incrementedQuantity);
  442 |     expect(afterLineAmount).toBe(
  443 |       testCase.product.unitPrice * testCase.product.incrementedQuantity,
  444 |     );
  445 |     expect(afterLineAmount - beforeLineAmount).toBe(testCase.product.unitPrice);
  446 |     expect(afterLineAmountSum - beforeLineAmountSum).toBe(
  447 |       afterLineAmount - beforeLineAmount,
  448 |     );
  449 |     expect(afterCartTotal).toBe(afterLineAmountSum);
  450 |     expect(afterCartTotal - beforeCartTotal).toBe(
  451 |       afterLineAmount - beforeLineAmount,
  452 |     );
  453 |   });
  454 | });
  455 | 
  456 | test.describe('FR-07 shopping cart — increment 2', () => {
  457 |   test(`${quantityDecrementAboveMinimumCase.id} ${quantityDecrementAboveMinimumCase.title}`, async ({
  458 |     page,
  459 |   }) => {
  460 |     const testCase = quantityDecrementAboveMinimumCase;
  461 |     const catalog = new CatalogPage(page);
  462 |     const productDetail = new ProductDetailPage(page);
  463 |     const cart = new CartPage(page);
  464 | 
  465 |     expect(testCase.targetProduct.id).not.toBe(testCase.comparisonProduct.id);
  466 |     expect(testCase.targetProduct.name).not.toBe(
  467 |       testCase.comparisonProduct.name,
  468 |     );
  469 | 
  470 |     await catalog.goto(testCase.paths.home);
  471 |     await expect(
  472 |       catalog.productDetailLink(
  473 |         testCase.targetProduct.name,
  474 |         testCase.navigation.productDetailLink,
  475 |       ),
  476 |     ).toBeVisible();
  477 |     await catalog.openProductDetail(
  478 |       testCase.targetProduct.name,
  479 |       testCase.navigation.productDetailLink,
  480 |     );
  481 |     await assertCurrentPath(page, testCase.paths.productDetail);
  482 | 
  483 |     await expect(
  484 |       productDetail.productHeading(testCase.targetProduct.name),
  485 |     ).toBeVisible();
  486 |     await expect(
  487 |       productDetail.quantityLabel(
  488 |         testCase.targetProduct.name,
  489 |         testCase.navigation.quantityLabel,
  490 |       ),
  491 |     ).toBeVisible();
  492 |     const detailQuantityInput = productDetail.quantityInput(
  493 |       testCase.targetProduct.name,
  494 |     );
  495 |     await expect(detailQuantityInput).toBeVisible();
  496 |     await productDetail.setQuantity(
  497 |       testCase.targetProduct.name,
  498 |       testCase.targetProduct.initialQuantity,
  499 |     );
  500 |     await expect(detailQuantityInput).toHaveValue(
  501 |       String(testCase.targetProduct.initialQuantity),
  502 |     );
  503 | 
  504 |     const detailAddButton = productDetail.addToCartButton(
  505 |       testCase.targetProduct.name,
  506 |       testCase.navigation.productDetailAddToCartButton,
  507 |     );
  508 |     await expect(detailAddButton).toBeVisible();
  509 |     await productDetail.addToCartOnce(
  510 |       testCase.targetProduct.name,
  511 |       testCase.navigation.productDetailAddToCartButton,
  512 |     );
  513 | 
  514 |     await productDetail.openHome(testCase.navigation.homeLink);
  515 |     await assertCurrentPath(page, testCase.paths.home);
  516 |     const comparisonAddButton = catalog.addToCartButton(
  517 |       testCase.comparisonProduct.name,
  518 |       testCase.navigation.homeAddToCartButton,
  519 |     );
  520 |     await expect(comparisonAddButton).toBeVisible();
  521 |     await catalog.addProductOnce(
  522 |       testCase.comparisonProduct.name,
  523 |       testCase.navigation.homeAddToCartButton,
  524 |     );
  525 |     await catalog.openCart(testCase.navigation.cartLink);
  526 |     await assertCurrentPath(page, testCase.paths.cart);
  527 | 
  528 |     const dataRows = cart.dataRows();
> 529 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
      |                            ^ Error: expect(locator).toHaveCount(expected) failed
  530 |     await expect(cart.productRows(testCase.targetProduct.name)).toHaveCount(
  531 |       testCase.expected.counts.rowsForTargetProduct,
  532 |     );
  533 |     await expect(
  534 |       cart.productRows(testCase.comparisonProduct.name),
  535 |     ).toHaveCount(testCase.expected.counts.rowsForComparisonProduct);
  536 | 
  537 |     const targetRow = cart.productRow(testCase.targetProduct.name);
  538 |     const comparisonRow = cart.productRow(testCase.comparisonProduct.name);
  539 |     const targetQuantityCell = cart.quantityCell(
  540 |       targetRow,
  541 |       testCase.expected.columns,
  542 |     );
  543 |     const comparisonQuantityCell = cart.quantityCell(
  544 |       comparisonRow,
  545 |       testCase.expected.columns,
  546 |     );
  547 |     const targetLineAmountCell = cart.lineAmountCell(
  548 |       targetRow,
  549 |       testCase.expected.columns,
  550 |     );
  551 |     const comparisonLineAmountCell = cart.lineAmountCell(
  552 |       comparisonRow,
  553 |       testCase.expected.columns,
  554 |     );
  555 |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  556 |     const decrementButton = cart.decrementButton(
  557 |       targetRow,
  558 |       testCase.expected.controls.decrement,
  559 |     );
  560 | 
  561 |     await expect(targetQuantityCell).toHaveText(
  562 |       String(testCase.targetProduct.initialQuantity),
  563 |     );
  564 |     await expect(comparisonQuantityCell).toHaveText(
  565 |       String(testCase.comparisonProduct.quantity),
  566 |     );
  567 |     await expect(targetLineAmountCell).toBeVisible();
  568 |     await expect(comparisonLineAmountCell).toBeVisible();
  569 |     await expect(summaryAmount).toBeVisible();
  570 |     await expect(targetLineAmountCell).toHaveText(
  571 |       displayedCurrencyAmountPattern(
  572 |         testCase.targetProduct.initialLineAmount,
  573 |         testCase.expected.currency,
  574 |       ),
  575 |     );
  576 |     await expect(comparisonLineAmountCell).toHaveText(
  577 |       displayedCurrencyAmountPattern(
  578 |         testCase.comparisonProduct.lineAmount,
  579 |         testCase.expected.currency,
  580 |       ),
  581 |     );
  582 |     await expect(summaryAmount).toHaveText(
  583 |       displayedCurrencyAmountPattern(
  584 |         testCase.expected.initialTotal,
  585 |         testCase.expected.currency,
  586 |       ),
  587 |     );
  588 |     await expect(decrementButton).toHaveCount(
  589 |       testCase.expected.counts.decrementControlsForTargetProduct,
  590 |     );
  591 |     await expect(decrementButton).toBeVisible();
  592 | 
  593 |     const beforeCart = await cart.readCartStateFromSummary(
  594 |       testCase.expected.columns,
  595 |       testCase.expected.currency,
  596 |     );
  597 |     const beforeTarget = await cart.readRowState(
  598 |       testCase.targetProduct.name,
  599 |       targetRow,
  600 |       testCase.expected.columns,
  601 |       testCase.expected.currency,
  602 |     );
  603 |     const beforeComparison = await cart.readRowState(
  604 |       testCase.comparisonProduct.name,
  605 |       comparisonRow,
  606 |       testCase.expected.columns,
  607 |       testCase.expected.currency,
  608 |     );
  609 | 
  610 |     expect(beforeTarget.quantity).toBe(testCase.targetProduct.initialQuantity);
  611 |     expect(beforeTarget.lineAmount).toBe(
  612 |       testCase.targetProduct.initialLineAmount,
  613 |     );
  614 |     expect(beforeComparison.quantity).toBe(
  615 |       testCase.comparisonProduct.quantity,
  616 |     );
  617 |     expect(beforeComparison.lineAmount).toBe(
  618 |       testCase.comparisonProduct.lineAmount,
  619 |     );
  620 |     expect(beforeCart.total).toBe(testCase.expected.initialTotal);
  621 |     expect(beforeCart.total).toBe(beforeCart.lineAmountSum);
  622 | 
  623 |     await decrementButton.click();
  624 | 
  625 |     await expect(dataRows).toHaveCount(
  626 |       beforeCart.rowCount + testCase.expected.deltas.rowCount,
  627 |     );
  628 |     await expect(targetQuantityCell).toHaveText(
  629 |       String(testCase.targetProduct.finalQuantity),
```