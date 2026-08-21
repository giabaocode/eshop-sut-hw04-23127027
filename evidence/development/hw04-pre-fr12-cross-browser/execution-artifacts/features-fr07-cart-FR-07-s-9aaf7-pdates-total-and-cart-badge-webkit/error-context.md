# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC08 confirming deletion removes only the selected row and updates total and cart badge
- Location: tests/features/fr07-cart.spec.ts:980:7

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
          - link "← Mua tiếp" [ref=e33]:
            - /url: /
          - button "Tiến hành thanh toán" [ref=e34] [cursor=pointer]
  - contentinfo [ref=e35]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
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
  1032 |     );
  1033 |     const selectedLineAmountCell = cart.lineAmountCell(
  1034 |       selectedRow,
  1035 |       testCase.expected.columns,
  1036 |     );
  1037 |     const remainingLineAmountCell = cart.lineAmountCell(
  1038 |       remainingRow,
  1039 |       testCase.expected.columns,
  1040 |     );
  1041 |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  1042 |     const deleteButton = cart.deleteButton(
  1043 |       selectedRow,
  1044 |       testCase.actions.delete,
  1045 |     );
  1046 | 
  1047 |     await expect(selectedQuantityCell).toHaveText(
  1048 |       String(selectedProduct.quantity),
  1049 |     );
  1050 |     await expect(remainingQuantityCell).toHaveText(
  1051 |       String(remainingProduct.quantity),
  1052 |     );
  1053 |     await expect(selectedLineAmountCell).toBeVisible();
  1054 |     await expect(remainingLineAmountCell).toBeVisible();
  1055 |     await expect(summaryAmount).toBeVisible();
  1056 |     await expect(selectedLineAmountCell).toHaveText(
  1057 |       displayedCurrencyAmountPattern(
  1058 |         selectedProduct.lineAmount,
  1059 |         testCase.expected.currency,
  1060 |       ),
  1061 |     );
  1062 |     await expect(remainingLineAmountCell).toHaveText(
  1063 |       displayedCurrencyAmountPattern(
  1064 |         remainingProduct.lineAmount,
  1065 |         testCase.expected.currency,
  1066 |       ),
  1067 |     );
  1068 |     await expect(summaryAmount).toHaveText(
  1069 |       displayedCurrencyAmountPattern(
  1070 |         testCase.expected.initialTotal,
  1071 |         testCase.expected.currency,
  1072 |       ),
  1073 |     );
  1074 |     await expect(deleteButton).toHaveCount(
  1075 |       testCase.expected.counts.deleteActionsForSelectedProduct,
  1076 |     );
  1077 |     await expect(deleteButton).toBeVisible();
  1078 | 
  1079 |     const baselineCart = await cart.readCartStateFromSummary(
  1080 |       testCase.expected.columns,
  1081 |       testCase.expected.currency,
  1082 |     );
  1083 |     const baselineSelected = await cart.readRowState(
  1084 |       selectedProduct.name,
  1085 |       selectedRow,
  1086 |       testCase.expected.columns,
  1087 |       testCase.expected.currency,
  1088 |     );
  1089 |     const baselineRemaining = await cart.readRowState(
  1090 |       remainingProduct.name,
  1091 |       remainingRow,
  1092 |       testCase.expected.columns,
  1093 |       testCase.expected.currency,
  1094 |     );
  1095 |     expect(baselineSelected.quantity).toBe(selectedProduct.quantity);
  1096 |     expect(baselineSelected.lineAmount).toBe(selectedProduct.lineAmount);
  1097 |     expect(baselineRemaining.quantity).toBe(remainingProduct.quantity);
  1098 |     expect(baselineRemaining.lineAmount).toBe(remainingProduct.lineAmount);
  1099 |     expect(baselineCart.total).toBe(testCase.expected.initialTotal);
  1100 |     expect(baselineCart.lineAmountSum).toBe(
  1101 |       testCase.expected.initialLineAmountSum,
  1102 |     );
  1103 |     expect(baselineCart.total).toBe(baselineCart.lineAmountSum);
  1104 | 
  1105 |     await deleteButton.click();
  1106 |     const dialog = cart.confirmationDialog();
> 1107 |     await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
       |                          ^ Error: expect(locator).toHaveCount(expected) failed
  1108 |     await expect(dialog).toBeVisible();
  1109 |     const confirmAction = cart.semanticDialogAction(
  1110 |       dialog,
  1111 |       testCase.actions.confirm,
  1112 |     );
  1113 |     await expect(confirmAction).toHaveCount(
  1114 |       testCase.expected.counts.confirmActions,
  1115 |     );
  1116 |     await expect(confirmAction).toBeVisible();
  1117 |     await confirmAction.click();
  1118 | 
  1119 |     await expect(dialog).toBeHidden();
  1120 |     await expect(cart.productRows(selectedProduct.name)).toHaveCount(
  1121 |       testCase.expected.counts.finalRowsForSelectedProduct,
  1122 |     );
  1123 |     await expect(dataRows).toHaveCount(testCase.expected.counts.finalRows);
  1124 |     await expect(dataRows).toHaveCount(
  1125 |       baselineCart.rowCount + testCase.expected.deltas.rowCount,
  1126 |     );
  1127 |     await expect(cart.productRows(remainingProduct.name)).toHaveCount(
  1128 |       testCase.expected.counts.rowsForRemainingProduct,
  1129 |     );
  1130 |     await expect(remainingQuantityCell).toHaveText(
  1131 |       String(baselineRemaining.quantity),
  1132 |     );
  1133 |     await expect(remainingLineAmountCell).toBeVisible();
  1134 |     await expect(summaryAmount).toBeVisible();
  1135 |     await expect(remainingLineAmountCell).toHaveText(
  1136 |       displayedCurrencyAmountPattern(
  1137 |         remainingProduct.lineAmount,
  1138 |         testCase.expected.currency,
  1139 |       ),
  1140 |     );
  1141 |     await expect(summaryAmount).toHaveText(
  1142 |       displayedCurrencyAmountPattern(
  1143 |         testCase.expected.finalTotal,
  1144 |         testCase.expected.currency,
  1145 |       ),
  1146 |     );
  1147 | 
  1148 |     const afterConfirmCart = await cart.readCartStateFromSummary(
  1149 |       testCase.expected.columns,
  1150 |       testCase.expected.currency,
  1151 |     );
  1152 |     const afterConfirmRemaining = await cart.readRowState(
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
```