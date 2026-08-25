# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC07 cancelling deletion preserves the complete cart state
- Location: tests/features/fr07-cart.spec.ts:854:7

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
  831  |     await expect(targetQuantityCell).toHaveText(
  832  |       String(baselineTarget.quantity),
  833  |     );
  834  |     await expect(targetLineAmountCell).toHaveText(
  835  |       displayedCurrencyAmountPattern(
  836  |         testCase.product.lineAmount,
  837  |         testCase.expected.currency,
  838  |       ),
  839  |     );
  840  |     await expect(summaryAmount).toHaveText(
  841  |       displayedCurrencyAmountPattern(
  842  |         testCase.expected.total,
  843  |         testCase.expected.currency,
  844  |       ),
  845  |     );
  846  |     expect(
  847  |       await cart.readCartStateFromSummary(
  848  |         testCase.expected.columns,
  849  |         testCase.expected.currency,
  850  |       ),
  851  |     ).toEqual(baselineCart);
  852  |   });
  853  | 
  854  |   test(`${deletionCancelCase.id} ${deletionCancelCase.title}`, async ({
  855  |     page,
  856  |   }) => {
  857  |     const testCase = deletionCancelCase;
  858  |     const catalog = new CatalogPage(page);
  859  |     const cart = new CartPage(page);
  860  | 
  861  |     await catalog.goto(testCase.paths.home);
  862  |     const addButton = catalog.addToCartButton(
  863  |       testCase.product.name,
  864  |       testCase.navigation.addToCartButton,
  865  |     );
  866  |     await expect(addButton).toBeVisible();
  867  |     await catalog.addProductOnce(
  868  |       testCase.product.name,
  869  |       testCase.navigation.addToCartButton,
  870  |     );
  871  |     await catalog.openCart(testCase.navigation.cartLink);
  872  |     await assertCurrentPath(page, testCase.paths.cart);
  873  | 
  874  |     const dataRows = cart.dataRows();
  875  |     await expect(dataRows).toHaveCount(testCase.expected.counts.rows);
  876  |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  877  |       testCase.expected.counts.rowsForProduct,
  878  |     );
  879  |     const targetRow = cart.productRow(testCase.product.name);
  880  |     const targetQuantityCell = cart.quantityCell(
  881  |       targetRow,
  882  |       testCase.expected.columns,
  883  |     );
  884  |     const targetLineAmountCell = cart.lineAmountCell(
  885  |       targetRow,
  886  |       testCase.expected.columns,
  887  |     );
  888  |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  889  |     const deleteButton = cart.deleteButton(targetRow, testCase.actions.delete);
  890  | 
  891  |     await expect(targetQuantityCell).toHaveText(
  892  |       String(testCase.product.quantity),
  893  |     );
  894  |     await expect(targetLineAmountCell).toBeVisible();
  895  |     await expect(summaryAmount).toBeVisible();
  896  |     await expect(targetLineAmountCell).toHaveText(
  897  |       displayedCurrencyAmountPattern(
  898  |         testCase.product.lineAmount,
  899  |         testCase.expected.currency,
  900  |       ),
  901  |     );
  902  |     await expect(summaryAmount).toHaveText(
  903  |       displayedCurrencyAmountPattern(
  904  |         testCase.expected.total,
  905  |         testCase.expected.currency,
  906  |       ),
  907  |     );
  908  |     await expect(deleteButton).toHaveCount(
  909  |       testCase.expected.counts.deleteActionsForProduct,
  910  |     );
  911  |     await expect(deleteButton).toBeVisible();
  912  | 
  913  |     const baselineCart = await cart.readCartStateFromSummary(
  914  |       testCase.expected.columns,
  915  |       testCase.expected.currency,
  916  |     );
  917  |     const baselineTarget = await cart.readRowState(
  918  |       testCase.product.name,
  919  |       targetRow,
  920  |       testCase.expected.columns,
  921  |       testCase.expected.currency,
  922  |     );
  923  |     expect(baselineTarget.quantity).toBe(testCase.product.quantity);
  924  |     expect(baselineTarget.lineAmount).toBe(testCase.product.lineAmount);
  925  |     expect(baselineCart.total).toBe(testCase.expected.total);
  926  |     expect(baselineCart.lineAmountSum).toBe(testCase.expected.lineAmountSum);
  927  |     expect(baselineCart.total).toBe(baselineCart.lineAmountSum);
  928  | 
  929  |     await deleteButton.click();
  930  |     const dialog = cart.confirmationDialog();
> 931  |     await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
       |                          ^ Error: expect(locator).toHaveCount(expected) failed
  932  |     await expect(dialog).toBeVisible();
  933  |     const cancelAction = cart.semanticDialogAction(
  934  |       dialog,
  935  |       testCase.actions.cancel,
  936  |     );
  937  |     await expect(cancelAction).toHaveCount(
  938  |       testCase.expected.counts.cancelActions,
  939  |     );
  940  |     await expect(cancelAction).toBeVisible();
  941  |     await cancelAction.click();
  942  | 
  943  |     await expect(dialog).toBeHidden();
  944  |     await expect(dataRows).toHaveCount(baselineCart.rowCount);
  945  |     await expect(cart.productRows(testCase.product.name)).toHaveCount(
  946  |       testCase.expected.counts.rowsForProduct,
  947  |     );
  948  |     await expect(targetQuantityCell).toHaveText(
  949  |       String(baselineTarget.quantity),
  950  |     );
  951  |     await expect(targetLineAmountCell).toBeVisible();
  952  |     await expect(summaryAmount).toBeVisible();
  953  |     await expect(targetLineAmountCell).toHaveText(
  954  |       displayedCurrencyAmountPattern(
  955  |         testCase.product.lineAmount,
  956  |         testCase.expected.currency,
  957  |       ),
  958  |     );
  959  |     await expect(summaryAmount).toHaveText(
  960  |       displayedCurrencyAmountPattern(
  961  |         testCase.expected.total,
  962  |         testCase.expected.currency,
  963  |       ),
  964  |     );
  965  | 
  966  |     const afterCancelCart = await cart.readCartStateFromSummary(
  967  |       testCase.expected.columns,
  968  |       testCase.expected.currency,
  969  |     );
  970  |     const afterCancelTarget = await cart.readRowState(
  971  |       testCase.product.name,
  972  |       targetRow,
  973  |       testCase.expected.columns,
  974  |       testCase.expected.currency,
  975  |     );
  976  |     expect(afterCancelCart).toEqual(baselineCart);
  977  |     expect(afterCancelTarget).toEqual(baselineTarget);
  978  |   });
  979  | 
  980  |   test(`${deletionConfirmCase.id} ${deletionConfirmCase.title}`, async ({
  981  |     page,
  982  |   }) => {
  983  |     const testCase = deletionConfirmCase;
  984  |     const catalog = new CatalogPage(page);
  985  |     const cart = new CartPage(page);
  986  |     const selectedProduct = testCase.products.selectedForDeletion;
  987  |     const remainingProduct = testCase.products.remaining;
  988  | 
  989  |     expect(selectedProduct.id).not.toBe(remainingProduct.id);
  990  |     expect(selectedProduct.name).not.toBe(remainingProduct.name);
  991  | 
  992  |     await catalog.goto(testCase.paths.home);
  993  |     const selectedAddButton = catalog.addToCartButton(
  994  |       selectedProduct.name,
  995  |       testCase.navigation.addToCartButton,
  996  |     );
  997  |     await expect(selectedAddButton).toBeVisible();
  998  |     await catalog.addProductOnce(
  999  |       selectedProduct.name,
  1000 |       testCase.navigation.addToCartButton,
  1001 |     );
  1002 |     const remainingAddButton = catalog.addToCartButton(
  1003 |       remainingProduct.name,
  1004 |       testCase.navigation.addToCartButton,
  1005 |     );
  1006 |     await expect(remainingAddButton).toBeVisible();
  1007 |     await catalog.addProductOnce(
  1008 |       remainingProduct.name,
  1009 |       testCase.navigation.addToCartButton,
  1010 |     );
  1011 |     await catalog.openCart(testCase.navigation.cartLink);
  1012 |     await assertCurrentPath(page, testCase.paths.cart);
  1013 | 
  1014 |     const dataRows = cart.dataRows();
  1015 |     await expect(dataRows).toHaveCount(testCase.expected.counts.initialRows);
  1016 |     await expect(cart.productRows(selectedProduct.name)).toHaveCount(
  1017 |       testCase.expected.counts.initialRowsForSelectedProduct,
  1018 |     );
  1019 |     await expect(cart.productRows(remainingProduct.name)).toHaveCount(
  1020 |       testCase.expected.counts.rowsForRemainingProduct,
  1021 |     );
  1022 | 
  1023 |     const selectedRow = cart.productRow(selectedProduct.name);
  1024 |     const remainingRow = cart.productRow(remainingProduct.name);
  1025 |     const selectedQuantityCell = cart.quantityCell(
  1026 |       selectedRow,
  1027 |       testCase.expected.columns,
  1028 |     );
  1029 |     const remainingQuantityCell = cart.quantityCell(
  1030 |       remainingRow,
  1031 |       testCase.expected.columns,
```