# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC07 cancelling deletion preserves the complete cart state
- Location: tests/features/fr07-cart.spec.ts:850:7

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
  827  |     await expect(targetQuantityCell).toHaveText(
  828  |       String(baselineTarget.quantity),
  829  |     );
  830  |     await expect(targetLineAmountCell).toHaveText(
  831  |       displayedCurrencyAmountPattern(
  832  |         testCase.product.lineAmount,
  833  |         testCase.expected.currency,
  834  |       ),
  835  |     );
  836  |     await expect(summaryAmount).toHaveText(
  837  |       displayedCurrencyAmountPattern(
  838  |         testCase.expected.total,
  839  |         testCase.expected.currency,
  840  |       ),
  841  |     );
  842  |     expect(
  843  |       await cart.readCartStateFromSummary(
  844  |         testCase.expected.columns,
  845  |         testCase.expected.currency,
  846  |       ),
  847  |     ).toEqual(baselineCart);
  848  |   });
  849  | 
  850  |   test(`${deletionCancelCase.id} ${deletionCancelCase.title}`, async ({
  851  |     page,
  852  |   }) => {
  853  |     const testCase = deletionCancelCase;
  854  |     const catalog = new CatalogPage(page);
  855  |     const cart = new CartPage(page);
  856  | 
  857  |     await catalog.goto(testCase.paths.home);
  858  |     const addButton = catalog.addToCartButton(
  859  |       testCase.product.name,
  860  |       testCase.navigation.addToCartButton,
  861  |     );
  862  |     await expect(addButton).toBeVisible();
  863  |     await catalog.addProductOnce(
  864  |       testCase.product.name,
  865  |       testCase.navigation.addToCartButton,
  866  |     );
  867  |     await catalog.openCart(testCase.navigation.cartLink);
  868  |     await assertCurrentPath(page, testCase.paths.cart);
  869  | 
  870  |     const dataRows = cart.dataRows();
  871  |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  872  |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  873  |       testCase.expected.counts.rowsForProduct,
  874  |     );
  875  |     const targetRow = cart.productRow(testCase.product.name);
  876  |     const targetQuantityCell = cart.quantityCell(
  877  |       targetRow,
  878  |       testCase.expected.columns,
  879  |     );
  880  |     const targetLineAmountCell = cart.lineAmountCell(
  881  |       targetRow,
  882  |       testCase.expected.columns,
  883  |     );
  884  |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  885  |     const deleteButton = cart.deleteButton(targetRow, testCase.actions.delete);
  886  | 
  887  |     await expect(targetQuantityCell).toHaveText(
  888  |       String(testCase.product.quantity),
  889  |     );
  890  |     await expect(targetLineAmountCell).toBeVisible();
  891  |     await expect(summaryAmount).toBeVisible();
  892  |     await expect(targetLineAmountCell).toHaveText(
  893  |       displayedCurrencyAmountPattern(
  894  |         testCase.product.lineAmount,
  895  |         testCase.expected.currency,
  896  |       ),
  897  |     );
  898  |     await expect(summaryAmount).toHaveText(
  899  |       displayedCurrencyAmountPattern(
  900  |         testCase.expected.total,
  901  |         testCase.expected.currency,
  902  |       ),
  903  |     );
  904  |     await expect(deleteButton).toHaveCount(
  905  |       testCase.expected.counts.deleteActionsForProduct,
  906  |     );
  907  |     await expect(deleteButton).toBeVisible();
  908  | 
  909  |     const baselineCart = await cart.readCartStateFromSummary(
  910  |       testCase.expected.columns,
  911  |       testCase.expected.currency,
  912  |     );
  913  |     const baselineTarget = await cart.readRowState(
  914  |       testCase.product.name,
  915  |       targetRow,
  916  |       testCase.expected.columns,
  917  |       testCase.expected.currency,
  918  |     );
  919  |     expect(baselineTarget.quantity).toBe(testCase.product.quantity);
  920  |     expect(baselineTarget.lineAmount).toBe(testCase.product.lineAmount);
  921  |     expect(baselineCart.total).toBe(testCase.expected.total);
  922  |     expect(baselineCart.lineAmountSum).toBe(testCase.expected.lineAmountSum);
  923  |     expect(baselineCart.total).toBe(baselineCart.lineAmountSum);
  924  | 
  925  |     await deleteButton.click();
  926  |     const dialog = cart.confirmationDialog();
> 927  |     await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
       |                          ^ Error: expect(locator).toHaveCount(expected) failed
  928  |     await expect(dialog).toBeVisible();
  929  |     const cancelAction = cart.semanticDialogAction(
  930  |       dialog,
  931  |       testCase.actions.cancel,
  932  |     );
  933  |     await expect(cancelAction).toHaveCount(
  934  |       testCase.expected.counts.cancelActions,
  935  |     );
  936  |     await expect(cancelAction).toBeVisible();
  937  |     await cancelAction.click();
  938  | 
  939  |     await expect(dialog).toBeHidden();
  940  |     await expect(dataRows).toHaveCount(baselineCart.rowCount);
  941  |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  942  |       testCase.expected.counts.rowsForProduct,
  943  |     );
  944  |     await expect(targetQuantityCell).toHaveText(
  945  |       String(baselineTarget.quantity),
  946  |     );
  947  |     await expect(targetLineAmountCell).toBeVisible();
  948  |     await expect(summaryAmount).toBeVisible();
  949  |     await expect(targetLineAmountCell).toHaveText(
  950  |       displayedCurrencyAmountPattern(
  951  |         testCase.product.lineAmount,
  952  |         testCase.expected.currency,
  953  |       ),
  954  |     );
  955  |     await expect(summaryAmount).toHaveText(
  956  |       displayedCurrencyAmountPattern(
  957  |         testCase.expected.total,
  958  |         testCase.expected.currency,
  959  |       ),
  960  |     );
  961  | 
  962  |     const afterCancelCart = await cart.readCartStateFromSummary(
  963  |       testCase.expected.columns,
  964  |       testCase.expected.currency,
  965  |     );
  966  |     const afterCancelTarget = await cart.readRowState(
  967  |       testCase.product.name,
  968  |       targetRow,
  969  |       testCase.expected.columns,
  970  |       testCase.expected.currency,
  971  |     );
  972  |     expect(afterCancelCart).toEqual(baselineCart);
  973  |     expect(afterCancelTarget).toEqual(baselineTarget);
  974  |   });
  975  | 
  976  |   test(`${deletionConfirmCase.id} ${deletionConfirmCase.title}`, async ({
  977  |     page,
  978  |   }) => {
  979  |     const testCase = deletionConfirmCase;
  980  |     const catalog = new CatalogPage(page);
  981  |     const cart = new CartPage(page);
  982  |     const selectedProduct = testCase.products.selectedForDeletion;
  983  |     const remainingProduct = testCase.products.remaining;
  984  | 
  985  |     expect(selectedProduct.id).not.toBe(remainingProduct.id);
  986  |     expect(selectedProduct.name).not.toBe(remainingProduct.name);
  987  | 
  988  |     await catalog.goto(testCase.paths.home);
  989  |     const selectedAddButton = catalog.addToCartButton(
  990  |       selectedProduct.name,
  991  |       testCase.navigation.addToCartButton,
  992  |     );
  993  |     await expect(selectedAddButton).toBeVisible();
  994  |     await catalog.addProductOnce(
  995  |       selectedProduct.name,
  996  |       testCase.navigation.addToCartButton,
  997  |     );
  998  |     const remainingAddButton = catalog.addToCartButton(
  999  |       remainingProduct.name,
  1000 |       testCase.navigation.addToCartButton,
  1001 |     );
  1002 |     await expect(remainingAddButton).toBeVisible();
  1003 |     await catalog.addProductOnce(
  1004 |       remainingProduct.name,
  1005 |       testCase.navigation.addToCartButton,
  1006 |     );
  1007 |     await catalog.openCart(testCase.navigation.cartLink);
  1008 |     await assertCurrentPath(page, testCase.paths.cart);
  1009 | 
  1010 |     const dataRows = cart.dataRows();
  1011 |     await expect(dataRows).toHaveCount(testCase.expected.counts.initialRows);
  1012 |     await expect(cart.productRows(selectedProduct.name)).toHaveCount(
  1013 |       testCase.expected.counts.initialRowsForSelectedProduct,
  1014 |     );
  1015 |     await expect(cart.productRows(remainingProduct.name)).toHaveCount(
  1016 |       testCase.expected.counts.rowsForRemainingProduct,
  1017 |     );
  1018 | 
  1019 |     const selectedRow = cart.productRow(selectedProduct.name);
  1020 |     const remainingRow = cart.productRow(remainingProduct.name);
  1021 |     const selectedQuantityCell = cart.quantityCell(
  1022 |       selectedRow,
  1023 |       testCase.expected.columns,
  1024 |     );
  1025 |     const remainingQuantityCell = cart.quantityCell(
  1026 |       remainingRow,
  1027 |       testCase.expected.columns,
```