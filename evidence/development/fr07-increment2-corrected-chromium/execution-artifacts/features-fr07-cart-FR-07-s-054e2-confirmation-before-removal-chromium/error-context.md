# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC06 dangerous delete action is red and opens confirmation before removal
- Location: tests/features/fr07-cart.spec.ts:696:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('dialog').or(getByRole('alertdialog'))
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('dialog').or(getByRole('alertdialog'))
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [ref=e7] [cursor=pointer]:
        - /url: /cart
      - link "Đăng nhập" [ref=e8] [cursor=pointer]:
        - /url: /login
      - link "Đăng ký" [ref=e9] [cursor=pointer]:
        - /url: /register
  - main [ref=e10]:
    - generic [ref=e11]:
      - heading "Giỏ hàng của bạn đang trống" [level=2] [ref=e12]
      - link "Tiếp tục mua sắm" [ref=e13] [cursor=pointer]:
        - /url: /
  - contentinfo [ref=e14]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  676 |     );
  677 |     expect(afterTarget.lineAmount).toBe(
  678 |       beforeTarget.lineAmount - testCase.targetProduct.unitPrice,
  679 |     );
  680 |     expect(afterComparison.quantity - beforeComparison.quantity).toBe(
  681 |       testCase.expected.deltas.comparisonQuantity,
  682 |     );
  683 |     expect(afterComparison.lineAmount - beforeComparison.lineAmount).toBe(
  684 |       testCase.expected.deltas.comparisonLineAmount,
  685 |     );
  686 |     expect(afterCart.total).toBe(testCase.expected.finalTotal);
  687 |     expect(afterCart.total - beforeCart.total).toBe(
  688 |       testCase.expected.deltas.cartTotal,
  689 |     );
  690 |     expect(afterCart.total).toBe(
  691 |       beforeCart.total - testCase.targetProduct.unitPrice,
  692 |     );
  693 |     expect(afterCart.total).toBe(afterCart.lineAmountSum);
  694 |   });
  695 | 
  696 |   test(`${deletableItemCase.id} ${deletableItemCase.title}`, async ({
  697 |     page,
  698 |   }) => {
  699 |     const testCase = deletableItemCase;
  700 |     const catalog = new CatalogPage(page);
  701 |     const cart = new CartPage(page);
  702 | 
  703 |     await catalog.goto(testCase.paths.home);
  704 |     const addButton = catalog.addToCartButton(
  705 |       testCase.product.name,
  706 |       testCase.navigation.addToCartButton,
  707 |     );
  708 |     await expect(addButton).toBeVisible();
  709 |     await catalog.addProductOnce(
  710 |       testCase.product.name,
  711 |       testCase.navigation.addToCartButton,
  712 |     );
  713 |     await catalog.openCart(testCase.navigation.cartLink);
  714 |     await assertCurrentPath(page, testCase.paths.cart);
  715 | 
  716 |     const dataRows = cart.dataRows();
  717 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  718 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  719 |       testCase.expected.counts.rowsForProduct,
  720 |     );
  721 |     const targetRow = cart.productRow(testCase.product.name);
  722 |     const targetQuantityCell = cart.quantityCell(
  723 |       targetRow,
  724 |       testCase.expected.columns,
  725 |     );
  726 |     const targetLineAmountCell = cart.lineAmountCell(
  727 |       targetRow,
  728 |       testCase.expected.columns,
  729 |     );
  730 |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  731 |     const deleteButton = cart.deleteButton(targetRow, testCase.actions.delete);
  732 | 
  733 |     await expect(targetQuantityCell).toHaveText(
  734 |       String(testCase.product.quantity),
  735 |     );
  736 |     await expect(targetLineAmountCell).toBeVisible();
  737 |     await expect(summaryAmount).toBeVisible();
  738 |     await expect(targetLineAmountCell).toHaveText(
  739 |       displayedCurrencyAmountPattern(
  740 |         testCase.product.lineAmount,
  741 |         testCase.expected.currency,
  742 |       ),
  743 |     );
  744 |     await expect(summaryAmount).toHaveText(
  745 |       displayedCurrencyAmountPattern(
  746 |         testCase.expected.total,
  747 |         testCase.expected.currency,
  748 |       ),
  749 |     );
  750 |     await expect(deleteButton).toHaveCount(
  751 |       testCase.expected.counts.deleteActionsForProduct,
  752 |     );
  753 |     await expect(deleteButton).toBeVisible();
  754 |     expect(await cart.dangerousActionColorCategory(deleteButton)).toBe(
  755 |       testCase.expected.dangerousColorCategory,
  756 |     );
  757 | 
  758 |     const baselineCart = await cart.readCartStateFromSummary(
  759 |       testCase.expected.columns,
  760 |       testCase.expected.currency,
  761 |     );
  762 |     const baselineTarget = await cart.readRowState(
  763 |       testCase.product.name,
  764 |       targetRow,
  765 |       testCase.expected.columns,
  766 |       testCase.expected.currency,
  767 |     );
  768 |     expect(baselineTarget.quantity).toBe(testCase.product.quantity);
  769 |     expect(baselineTarget.lineAmount).toBe(testCase.product.lineAmount);
  770 |     expect(baselineCart.total).toBe(testCase.expected.total);
  771 |     expect(baselineCart.total).toBe(baselineCart.lineAmountSum);
  772 | 
  773 |     await deleteButton.click();
  774 | 
  775 |     const dialog = cart.confirmationDialog();
> 776 |     await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
      |                          ^ Error: expect(locator).toHaveCount(expected) failed
  777 |     await expect(dialog).toBeVisible();
  778 |     await expect(dataRows).toHaveCount(baselineCart.rowCount);
  779 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  780 |       testCase.expected.counts.rowsForProduct,
  781 |     );
  782 |     await expect(targetQuantityCell).toHaveText(
  783 |       String(baselineTarget.quantity),
  784 |     );
  785 |     await expect(targetLineAmountCell).toBeVisible();
  786 |     await expect(summaryAmount).toBeVisible();
  787 |     await expect(targetLineAmountCell).toHaveText(
  788 |       displayedCurrencyAmountPattern(
  789 |         testCase.product.lineAmount,
  790 |         testCase.expected.currency,
  791 |       ),
  792 |     );
  793 |     await expect(summaryAmount).toHaveText(
  794 |       displayedCurrencyAmountPattern(
  795 |         testCase.expected.total,
  796 |         testCase.expected.currency,
  797 |       ),
  798 |     );
  799 | 
  800 |     const awaitingDecisionCart = await cart.readCartStateFromSummary(
  801 |       testCase.expected.columns,
  802 |       testCase.expected.currency,
  803 |     );
  804 |     const awaitingDecisionTarget = await cart.readRowState(
  805 |       testCase.product.name,
  806 |       targetRow,
  807 |       testCase.expected.columns,
  808 |       testCase.expected.currency,
  809 |     );
  810 |     expect(awaitingDecisionCart).toEqual(baselineCart);
  811 |     expect(awaitingDecisionTarget).toEqual(baselineTarget);
  812 | 
  813 |     const dismissAction = cart.semanticDialogAction(
  814 |       dialog,
  815 |       testCase.actions.dismiss,
  816 |     );
  817 |     await expect(dismissAction).toHaveCount(
  818 |       testCase.expected.counts.dismissActions,
  819 |     );
  820 |     await expect(dismissAction).toBeVisible();
  821 |     await dismissAction.click();
  822 |     await expect(dialog).toBeHidden();
  823 |     await expect(dataRows).toHaveCount(baselineCart.rowCount);
  824 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  825 |       testCase.expected.counts.rowsForProduct,
  826 |     );
  827 |     await expect(targetQuantityCell).toHaveText(
  828 |       String(baselineTarget.quantity),
  829 |     );
  830 |     await expect(targetLineAmountCell).toHaveText(
  831 |       displayedCurrencyAmountPattern(
  832 |         testCase.product.lineAmount,
  833 |         testCase.expected.currency,
  834 |       ),
  835 |     );
  836 |     await expect(summaryAmount).toHaveText(
  837 |       displayedCurrencyAmountPattern(
  838 |         testCase.expected.total,
  839 |         testCase.expected.currency,
  840 |       ),
  841 |     );
  842 |     expect(
  843 |       await cart.readCartStateFromSummary(
  844 |         testCase.expected.columns,
  845 |         testCase.expected.currency,
  846 |       ),
  847 |     ).toEqual(baselineCart);
  848 |   });
  849 | 
  850 |   test(`${deletionCancelCase.id} ${deletionCancelCase.title}`, async ({
  851 |     page,
  852 |   }) => {
  853 |     const testCase = deletionCancelCase;
  854 |     const catalog = new CatalogPage(page);
  855 |     const cart = new CartPage(page);
  856 | 
  857 |     await catalog.goto(testCase.paths.home);
  858 |     const addButton = catalog.addToCartButton(
  859 |       testCase.product.name,
  860 |       testCase.navigation.addToCartButton,
  861 |     );
  862 |     await expect(addButton).toBeVisible();
  863 |     await catalog.addProductOnce(
  864 |       testCase.product.name,
  865 |       testCase.navigation.addToCartButton,
  866 |     );
  867 |     await catalog.openCart(testCase.navigation.cartLink);
  868 |     await assertCurrentPath(page, testCase.paths.cart);
  869 | 
  870 |     const dataRows = cart.dataRows();
  871 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  872 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  873 |       testCase.expected.counts.rowsForProduct,
  874 |     );
  875 |     const targetRow = cart.productRow(testCase.product.name);
  876 |     const targetQuantityCell = cart.quantityCell(
```