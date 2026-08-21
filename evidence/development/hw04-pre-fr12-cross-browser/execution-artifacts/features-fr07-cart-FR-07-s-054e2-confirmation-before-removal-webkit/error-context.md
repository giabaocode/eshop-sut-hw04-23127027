# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC06 dangerous delete action is red and opens confirmation before removal
- Location: tests/features/fr07-cart.spec.ts:700:7

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
      - heading "Giỏ hàng của bạn đang trống" [level=2] [ref=e12]
      - link "Tiếp tục mua sắm" [ref=e13]:
        - /url: /
  - contentinfo [ref=e14]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  680 |     );
  681 |     expect(afterTarget.lineAmount).toBe(
  682 |       beforeTarget.lineAmount - testCase.targetProduct.unitPrice,
  683 |     );
  684 |     expect(afterComparison.quantity - beforeComparison.quantity).toBe(
  685 |       testCase.expected.deltas.comparisonQuantity,
  686 |     );
  687 |     expect(afterComparison.lineAmount - beforeComparison.lineAmount).toBe(
  688 |       testCase.expected.deltas.comparisonLineAmount,
  689 |     );
  690 |     expect(afterCart.total).toBe(testCase.expected.finalTotal);
  691 |     expect(afterCart.total - beforeCart.total).toBe(
  692 |       testCase.expected.deltas.cartTotal,
  693 |     );
  694 |     expect(afterCart.total).toBe(
  695 |       beforeCart.total - testCase.targetProduct.unitPrice,
  696 |     );
  697 |     expect(afterCart.total).toBe(afterCart.lineAmountSum);
  698 |   });
  699 | 
  700 |   test(`${deletableItemCase.id} ${deletableItemCase.title}`, async ({
  701 |     page,
  702 |   }) => {
  703 |     const testCase = deletableItemCase;
  704 |     const catalog = new CatalogPage(page);
  705 |     const cart = new CartPage(page);
  706 | 
  707 |     await catalog.goto(testCase.paths.home);
  708 |     const addButton = catalog.addToCartButton(
  709 |       testCase.product.name,
  710 |       testCase.navigation.addToCartButton,
  711 |     );
  712 |     await expect(addButton).toBeVisible();
  713 |     await catalog.addProductOnce(
  714 |       testCase.product.name,
  715 |       testCase.navigation.addToCartButton,
  716 |     );
  717 |     await catalog.openCart(testCase.navigation.cartLink);
  718 |     await assertCurrentPath(page, testCase.paths.cart);
  719 | 
  720 |     const dataRows = cart.dataRows();
  721 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  722 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  723 |       testCase.expected.counts.rowsForProduct,
  724 |     );
  725 |     const targetRow = cart.productRow(testCase.product.name);
  726 |     const targetQuantityCell = cart.quantityCell(
  727 |       targetRow,
  728 |       testCase.expected.columns,
  729 |     );
  730 |     const targetLineAmountCell = cart.lineAmountCell(
  731 |       targetRow,
  732 |       testCase.expected.columns,
  733 |     );
  734 |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  735 |     const deleteButton = cart.deleteButton(targetRow, testCase.actions.delete);
  736 | 
  737 |     await expect(targetQuantityCell).toHaveText(
  738 |       String(testCase.product.quantity),
  739 |     );
  740 |     await expect(targetLineAmountCell).toBeVisible();
  741 |     await expect(summaryAmount).toBeVisible();
  742 |     await expect(targetLineAmountCell).toHaveText(
  743 |       displayedCurrencyAmountPattern(
  744 |         testCase.product.lineAmount,
  745 |         testCase.expected.currency,
  746 |       ),
  747 |     );
  748 |     await expect(summaryAmount).toHaveText(
  749 |       displayedCurrencyAmountPattern(
  750 |         testCase.expected.total,
  751 |         testCase.expected.currency,
  752 |       ),
  753 |     );
  754 |     await expect(deleteButton).toHaveCount(
  755 |       testCase.expected.counts.deleteActionsForProduct,
  756 |     );
  757 |     await expect(deleteButton).toBeVisible();
  758 |     expect(await cart.dangerousActionColorCategory(deleteButton)).toBe(
  759 |       testCase.expected.dangerousColorCategory,
  760 |     );
  761 | 
  762 |     const baselineCart = await cart.readCartStateFromSummary(
  763 |       testCase.expected.columns,
  764 |       testCase.expected.currency,
  765 |     );
  766 |     const baselineTarget = await cart.readRowState(
  767 |       testCase.product.name,
  768 |       targetRow,
  769 |       testCase.expected.columns,
  770 |       testCase.expected.currency,
  771 |     );
  772 |     expect(baselineTarget.quantity).toBe(testCase.product.quantity);
  773 |     expect(baselineTarget.lineAmount).toBe(testCase.product.lineAmount);
  774 |     expect(baselineCart.total).toBe(testCase.expected.total);
  775 |     expect(baselineCart.total).toBe(baselineCart.lineAmountSum);
  776 | 
  777 |     await deleteButton.click();
  778 | 
  779 |     const dialog = cart.confirmationDialog();
> 780 |     await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
      |                          ^ Error: expect(locator).toHaveCount(expected) failed
  781 |     await expect(dialog).toBeVisible();
  782 |     await expect(dataRows).toHaveCount(baselineCart.rowCount);
  783 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  784 |       testCase.expected.counts.rowsForProduct,
  785 |     );
  786 |     await expect(targetQuantityCell).toHaveText(
  787 |       String(baselineTarget.quantity),
  788 |     );
  789 |     await expect(targetLineAmountCell).toBeVisible();
  790 |     await expect(summaryAmount).toBeVisible();
  791 |     await expect(targetLineAmountCell).toHaveText(
  792 |       displayedCurrencyAmountPattern(
  793 |         testCase.product.lineAmount,
  794 |         testCase.expected.currency,
  795 |       ),
  796 |     );
  797 |     await expect(summaryAmount).toHaveText(
  798 |       displayedCurrencyAmountPattern(
  799 |         testCase.expected.total,
  800 |         testCase.expected.currency,
  801 |       ),
  802 |     );
  803 | 
  804 |     const awaitingDecisionCart = await cart.readCartStateFromSummary(
  805 |       testCase.expected.columns,
  806 |       testCase.expected.currency,
  807 |     );
  808 |     const awaitingDecisionTarget = await cart.readRowState(
  809 |       testCase.product.name,
  810 |       targetRow,
  811 |       testCase.expected.columns,
  812 |       testCase.expected.currency,
  813 |     );
  814 |     expect(awaitingDecisionCart).toEqual(baselineCart);
  815 |     expect(awaitingDecisionTarget).toEqual(baselineTarget);
  816 | 
  817 |     const dismissAction = cart.semanticDialogAction(
  818 |       dialog,
  819 |       testCase.actions.dismiss,
  820 |     );
  821 |     await expect(dismissAction).toHaveCount(
  822 |       testCase.expected.counts.dismissActions,
  823 |     );
  824 |     await expect(dismissAction).toBeVisible();
  825 |     await dismissAction.click();
  826 |     await expect(dialog).toBeHidden();
  827 |     await expect(dataRows).toHaveCount(baselineCart.rowCount);
  828 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  829 |       testCase.expected.counts.rowsForProduct,
  830 |     );
  831 |     await expect(targetQuantityCell).toHaveText(
  832 |       String(baselineTarget.quantity),
  833 |     );
  834 |     await expect(targetLineAmountCell).toHaveText(
  835 |       displayedCurrencyAmountPattern(
  836 |         testCase.product.lineAmount,
  837 |         testCase.expected.currency,
  838 |       ),
  839 |     );
  840 |     await expect(summaryAmount).toHaveText(
  841 |       displayedCurrencyAmountPattern(
  842 |         testCase.expected.total,
  843 |         testCase.expected.currency,
  844 |       ),
  845 |     );
  846 |     expect(
  847 |       await cart.readCartStateFromSummary(
  848 |         testCase.expected.columns,
  849 |         testCase.expected.currency,
  850 |       ),
  851 |     ).toEqual(baselineCart);
  852 |   });
  853 | 
  854 |   test(`${deletionCancelCase.id} ${deletionCancelCase.title}`, async ({
  855 |     page,
  856 |   }) => {
  857 |     const testCase = deletionCancelCase;
  858 |     const catalog = new CatalogPage(page);
  859 |     const cart = new CartPage(page);
  860 | 
  861 |     await catalog.goto(testCase.paths.home);
  862 |     const addButton = catalog.addToCartButton(
  863 |       testCase.product.name,
  864 |       testCase.navigation.addToCartButton,
  865 |     );
  866 |     await expect(addButton).toBeVisible();
  867 |     await catalog.addProductOnce(
  868 |       testCase.product.name,
  869 |       testCase.navigation.addToCartButton,
  870 |     );
  871 |     await catalog.openCart(testCase.navigation.cartLink);
  872 |     await assertCurrentPath(page, testCase.paths.cart);
  873 | 
  874 |     const dataRows = cart.dataRows();
  875 |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  876 |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  877 |       testCase.expected.counts.rowsForProduct,
  878 |     );
  879 |     const targetRow = cart.productRow(testCase.product.name);
  880 |     const targetQuantityCell = cart.quantityCell(
```