# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC05 decrement quantity from 2 to 1 and recalculate totals
- Location: tests/features/fr07-cart.spec.ts:453:7

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
  425 |     );
  426 |     const afterLineAmountSum = await cart.sumDisplayedLineAmounts(
  427 |       testCase.expected.columns,
  428 |       testCase.expected.currency,
  429 |     );
  430 |     const afterCartTotal = await cart.cartTotal(
  431 |       testCase.expected.totalLabel,
  432 |       testCase.expected.currency,
  433 |     );
  434 | 
  435 |     expect(afterRowCount).toBe(beforeRowCount);
  436 |     expect(afterQuantity).toBe(beforeQuantity + 1);
  437 |     expect(afterQuantity).toBe(testCase.product.incrementedQuantity);
  438 |     expect(afterLineAmount).toBe(
  439 |       testCase.product.unitPrice * testCase.product.incrementedQuantity,
  440 |     );
  441 |     expect(afterLineAmount - beforeLineAmount).toBe(testCase.product.unitPrice);
  442 |     expect(afterLineAmountSum - beforeLineAmountSum).toBe(
  443 |       afterLineAmount - beforeLineAmount,
  444 |     );
  445 |     expect(afterCartTotal).toBe(afterLineAmountSum);
  446 |     expect(afterCartTotal - beforeCartTotal).toBe(
  447 |       afterLineAmount - beforeLineAmount,
  448 |     );
  449 |   });
  450 | });
  451 | 
  452 | test.describe('FR-07 shopping cart — increment 2', () => {
  453 |   test(`${quantityDecrementAboveMinimumCase.id} ${quantityDecrementAboveMinimumCase.title}`, async ({
  454 |     page,
  455 |   }) => {
  456 |     const testCase = quantityDecrementAboveMinimumCase;
  457 |     const catalog = new CatalogPage(page);
  458 |     const productDetail = new ProductDetailPage(page);
  459 |     const cart = new CartPage(page);
  460 | 
  461 |     expect(testCase.targetProduct.id).not.toBe(testCase.comparisonProduct.id);
  462 |     expect(testCase.targetProduct.name).not.toBe(
  463 |       testCase.comparisonProduct.name,
  464 |     );
  465 | 
  466 |     await catalog.goto(testCase.paths.home);
  467 |     await expect(
  468 |       catalog.productDetailLink(
  469 |         testCase.targetProduct.name,
  470 |         testCase.navigation.productDetailLink,
  471 |       ),
  472 |     ).toBeVisible();
  473 |     await catalog.openProductDetail(
  474 |       testCase.targetProduct.name,
  475 |       testCase.navigation.productDetailLink,
  476 |     );
  477 |     await assertCurrentPath(page, testCase.paths.productDetail);
  478 | 
  479 |     await expect(
  480 |       productDetail.productHeading(testCase.targetProduct.name),
  481 |     ).toBeVisible();
  482 |     await expect(
  483 |       productDetail.quantityLabel(
  484 |         testCase.targetProduct.name,
  485 |         testCase.navigation.quantityLabel,
  486 |       ),
  487 |     ).toBeVisible();
  488 |     const detailQuantityInput = productDetail.quantityInput(
  489 |       testCase.targetProduct.name,
  490 |     );
  491 |     await expect(detailQuantityInput).toBeVisible();
  492 |     await productDetail.setQuantity(
  493 |       testCase.targetProduct.name,
  494 |       testCase.targetProduct.initialQuantity,
  495 |     );
  496 |     await expect(detailQuantityInput).toHaveValue(
  497 |       String(testCase.targetProduct.initialQuantity),
  498 |     );
  499 | 
  500 |     const detailAddButton = productDetail.addToCartButton(
  501 |       testCase.targetProduct.name,
  502 |       testCase.navigation.productDetailAddToCartButton,
  503 |     );
  504 |     await expect(detailAddButton).toBeVisible();
  505 |     await productDetail.addToCartOnce(
  506 |       testCase.targetProduct.name,
  507 |       testCase.navigation.productDetailAddToCartButton,
  508 |     );
  509 | 
  510 |     await productDetail.openHome(testCase.navigation.homeLink);
  511 |     await assertCurrentPath(page, testCase.paths.home);
  512 |     const comparisonAddButton = catalog.addToCartButton(
  513 |       testCase.comparisonProduct.name,
  514 |       testCase.navigation.homeAddToCartButton,
  515 |     );
  516 |     await expect(comparisonAddButton).toBeVisible();
  517 |     await catalog.addProductOnce(
  518 |       testCase.comparisonProduct.name,
  519 |       testCase.navigation.homeAddToCartButton,
  520 |     );
  521 |     await catalog.openCart(testCase.navigation.cartLink);
  522 |     await assertCurrentPath(page, testCase.paths.cart);
  523 | 
  524 |     const dataRows = cart.dataRows();
> 525 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
      |                            ^ Error: expect(locator).toHaveCount(expected) failed
  526 |     await expect(cart.productRows(testCase.targetProduct.name)).toHaveCount(
  527 |       testCase.expected.counts.rowsForTargetProduct,
  528 |     );
  529 |     await expect(
  530 |       cart.productRows(testCase.comparisonProduct.name),
  531 |     ).toHaveCount(testCase.expected.counts.rowsForComparisonProduct);
  532 | 
  533 |     const targetRow = cart.productRow(testCase.targetProduct.name);
  534 |     const comparisonRow = cart.productRow(testCase.comparisonProduct.name);
  535 |     const targetQuantityCell = cart.quantityCell(
  536 |       targetRow,
  537 |       testCase.expected.columns,
  538 |     );
  539 |     const comparisonQuantityCell = cart.quantityCell(
  540 |       comparisonRow,
  541 |       testCase.expected.columns,
  542 |     );
  543 |     const targetLineAmountCell = cart.lineAmountCell(
  544 |       targetRow,
  545 |       testCase.expected.columns,
  546 |     );
  547 |     const comparisonLineAmountCell = cart.lineAmountCell(
  548 |       comparisonRow,
  549 |       testCase.expected.columns,
  550 |     );
  551 |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  552 |     const decrementButton = cart.decrementButton(
  553 |       targetRow,
  554 |       testCase.expected.controls.decrement,
  555 |     );
  556 | 
  557 |     await expect(targetQuantityCell).toHaveText(
  558 |       String(testCase.targetProduct.initialQuantity),
  559 |     );
  560 |     await expect(comparisonQuantityCell).toHaveText(
  561 |       String(testCase.comparisonProduct.quantity),
  562 |     );
  563 |     await expect(targetLineAmountCell).toBeVisible();
  564 |     await expect(comparisonLineAmountCell).toBeVisible();
  565 |     await expect(summaryAmount).toBeVisible();
  566 |     await expect(targetLineAmountCell).toHaveText(
  567 |       displayedCurrencyAmountPattern(
  568 |         testCase.targetProduct.initialLineAmount,
  569 |         testCase.expected.currency,
  570 |       ),
  571 |     );
  572 |     await expect(comparisonLineAmountCell).toHaveText(
  573 |       displayedCurrencyAmountPattern(
  574 |         testCase.comparisonProduct.lineAmount,
  575 |         testCase.expected.currency,
  576 |       ),
  577 |     );
  578 |     await expect(summaryAmount).toHaveText(
  579 |       displayedCurrencyAmountPattern(
  580 |         testCase.expected.initialTotal,
  581 |         testCase.expected.currency,
  582 |       ),
  583 |     );
  584 |     await expect(decrementButton).toHaveCount(
  585 |       testCase.expected.counts.decrementControlsForTargetProduct,
  586 |     );
  587 |     await expect(decrementButton).toBeVisible();
  588 | 
  589 |     const beforeCart = await cart.readCartStateFromSummary(
  590 |       testCase.expected.columns,
  591 |       testCase.expected.currency,
  592 |     );
  593 |     const beforeTarget = await cart.readRowState(
  594 |       testCase.targetProduct.name,
  595 |       targetRow,
  596 |       testCase.expected.columns,
  597 |       testCase.expected.currency,
  598 |     );
  599 |     const beforeComparison = await cart.readRowState(
  600 |       testCase.comparisonProduct.name,
  601 |       comparisonRow,
  602 |       testCase.expected.columns,
  603 |       testCase.expected.currency,
  604 |     );
  605 | 
  606 |     expect(beforeTarget.quantity).toBe(testCase.targetProduct.initialQuantity);
  607 |     expect(beforeTarget.lineAmount).toBe(
  608 |       testCase.targetProduct.initialLineAmount,
  609 |     );
  610 |     expect(beforeComparison.quantity).toBe(
  611 |       testCase.comparisonProduct.quantity,
  612 |     );
  613 |     expect(beforeComparison.lineAmount).toBe(
  614 |       testCase.comparisonProduct.lineAmount,
  615 |     );
  616 |     expect(beforeCart.total).toBe(testCase.expected.initialTotal);
  617 |     expect(beforeCart.total).toBe(beforeCart.lineAmountSum);
  618 | 
  619 |     await decrementButton.click();
  620 | 
  621 |     await expect(dataRows).toHaveCount(
  622 |       beforeCart.rowCount + testCase.expected.deltas.rowCount,
  623 |     );
  624 |     await expect(targetQuantityCell).toHaveText(
  625 |       String(testCase.targetProduct.finalQuantity),
```