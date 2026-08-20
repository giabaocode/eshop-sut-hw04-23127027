# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr07-cart.spec.ts >> FR-07 shopping cart — increment 2 >> FR07-TC08 confirming deletion removes only the selected row and updates total and cart badge
- Location: tests/features/fr07-cart.spec.ts:976:7

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
              - button "Xóa" [active] [ref=e28] [cursor=pointer]
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
  1028 |     );
  1029 |     const selectedLineAmountCell = cart.lineAmountCell(
  1030 |       selectedRow,
  1031 |       testCase.expected.columns,
  1032 |     );
  1033 |     const remainingLineAmountCell = cart.lineAmountCell(
  1034 |       remainingRow,
  1035 |       testCase.expected.columns,
  1036 |     );
  1037 |     const summaryAmount = cart.cartSummaryAmount(testCase.expected.currency);
  1038 |     const deleteButton = cart.deleteButton(
  1039 |       selectedRow,
  1040 |       testCase.actions.delete,
  1041 |     );
  1042 | 
  1043 |     await expect(selectedQuantityCell).toHaveText(
  1044 |       String(selectedProduct.quantity),
  1045 |     );
  1046 |     await expect(remainingQuantityCell).toHaveText(
  1047 |       String(remainingProduct.quantity),
  1048 |     );
  1049 |     await expect(selectedLineAmountCell).toBeVisible();
  1050 |     await expect(remainingLineAmountCell).toBeVisible();
  1051 |     await expect(summaryAmount).toBeVisible();
  1052 |     await expect(selectedLineAmountCell).toHaveText(
  1053 |       displayedCurrencyAmountPattern(
  1054 |         selectedProduct.lineAmount,
  1055 |         testCase.expected.currency,
  1056 |       ),
  1057 |     );
  1058 |     await expect(remainingLineAmountCell).toHaveText(
  1059 |       displayedCurrencyAmountPattern(
  1060 |         remainingProduct.lineAmount,
  1061 |         testCase.expected.currency,
  1062 |       ),
  1063 |     );
  1064 |     await expect(summaryAmount).toHaveText(
  1065 |       displayedCurrencyAmountPattern(
  1066 |         testCase.expected.initialTotal,
  1067 |         testCase.expected.currency,
  1068 |       ),
  1069 |     );
  1070 |     await expect(deleteButton).toHaveCount(
  1071 |       testCase.expected.counts.deleteActionsForSelectedProduct,
  1072 |     );
  1073 |     await expect(deleteButton).toBeVisible();
  1074 | 
  1075 |     const baselineCart = await cart.readCartStateFromSummary(
  1076 |       testCase.expected.columns,
  1077 |       testCase.expected.currency,
  1078 |     );
  1079 |     const baselineSelected = await cart.readRowState(
  1080 |       selectedProduct.name,
  1081 |       selectedRow,
  1082 |       testCase.expected.columns,
  1083 |       testCase.expected.currency,
  1084 |     );
  1085 |     const baselineRemaining = await cart.readRowState(
  1086 |       remainingProduct.name,
  1087 |       remainingRow,
  1088 |       testCase.expected.columns,
  1089 |       testCase.expected.currency,
  1090 |     );
  1091 |     expect(baselineSelected.quantity).toBe(selectedProduct.quantity);
  1092 |     expect(baselineSelected.lineAmount).toBe(selectedProduct.lineAmount);
  1093 |     expect(baselineRemaining.quantity).toBe(remainingProduct.quantity);
  1094 |     expect(baselineRemaining.lineAmount).toBe(remainingProduct.lineAmount);
  1095 |     expect(baselineCart.total).toBe(testCase.expected.initialTotal);
  1096 |     expect(baselineCart.lineAmountSum).toBe(
  1097 |       testCase.expected.initialLineAmountSum,
  1098 |     );
  1099 |     expect(baselineCart.total).toBe(baselineCart.lineAmountSum);
  1100 | 
  1101 |     await deleteButton.click();
  1102 |     const dialog = cart.confirmationDialog();
> 1103 |     await expect(dialog).toHaveCount(testCase.expected.counts.dialogs);
       |                          ^ Error: expect(locator).toHaveCount(expected) failed
  1104 |     await expect(dialog).toBeVisible();
  1105 |     const confirmAction = cart.semanticDialogAction(
  1106 |       dialog,
  1107 |       testCase.actions.confirm,
  1108 |     );
  1109 |     await expect(confirmAction).toHaveCount(
  1110 |       testCase.expected.counts.confirmActions,
  1111 |     );
  1112 |     await expect(confirmAction).toBeVisible();
  1113 |     await confirmAction.click();
  1114 | 
  1115 |     await expect(dialog).toBeHidden();
  1116 |     await expect(cart.productRows(selectedProduct.name)).toHaveCount(
  1117 |       testCase.expected.counts.finalRowsForSelectedProduct,
  1118 |     );
  1119 |     await expect(dataRows).toHaveCount(testCase.expected.counts.finalRows);
  1120 |     await expect(dataRows).toHaveCount(
  1121 |       baselineCart.rowCount + testCase.expected.deltas.rowCount,
  1122 |     );
  1123 |     await expect(cart.productRows(remainingProduct.name)).toHaveCount(
  1124 |       testCase.expected.counts.rowsForRemainingProduct,
  1125 |     );
  1126 |     await expect(remainingQuantityCell).toHaveText(
  1127 |       String(baselineRemaining.quantity),
  1128 |     );
  1129 |     await expect(remainingLineAmountCell).toBeVisible();
  1130 |     await expect(summaryAmount).toBeVisible();
  1131 |     await expect(remainingLineAmountCell).toHaveText(
  1132 |       displayedCurrencyAmountPattern(
  1133 |         remainingProduct.lineAmount,
  1134 |         testCase.expected.currency,
  1135 |       ),
  1136 |     );
  1137 |     await expect(summaryAmount).toHaveText(
  1138 |       displayedCurrencyAmountPattern(
  1139 |         testCase.expected.finalTotal,
  1140 |         testCase.expected.currency,
  1141 |       ),
  1142 |     );
  1143 | 
  1144 |     const afterConfirmCart = await cart.readCartStateFromSummary(
  1145 |       testCase.expected.columns,
  1146 |       testCase.expected.currency,
  1147 |     );
  1148 |     const afterConfirmRemaining = await cart.readRowState(
  1149 |       remainingProduct.name,
  1150 |       remainingRow,
  1151 |       testCase.expected.columns,
  1152 |       testCase.expected.currency,
  1153 |     );
  1154 |     expect(afterConfirmRemaining).toEqual(baselineRemaining);
  1155 |     expect(afterConfirmCart.total).toBe(testCase.expected.finalTotal);
  1156 |     expect(afterConfirmCart.lineAmountSum).toBe(
  1157 |       testCase.expected.finalLineAmountSum,
  1158 |     );
  1159 |     expect(afterConfirmCart.total - baselineCart.total).toBe(
  1160 |       testCase.expected.deltas.cartTotal,
  1161 |     );
  1162 |     expect(afterConfirmCart.total).toBe(
  1163 |       baselineCart.total - baselineSelected.lineAmount,
  1164 |     );
  1165 |     expect(afterConfirmCart.total).toBe(afterConfirmCart.lineAmountSum);
  1166 | 
  1167 |     const cartBadge = cart.cartBadge(
  1168 |       testCase.navigation.cartLink,
  1169 |       testCase.badge.numericTextPattern,
  1170 |     );
  1171 |     await expect(cartBadge).toHaveCount(testCase.expected.counts.cartBadges);
  1172 |     await expect(cartBadge).toBeVisible();
  1173 |     await expect(cartBadge).toHaveText(
  1174 |       String(testCase.badge.remainingCartCount),
  1175 |     );
  1176 |     expect(
  1177 |       await cart.cartBadgeCount(
  1178 |         testCase.navigation.cartLink,
  1179 |         testCase.badge.numericTextPattern,
  1180 |       ),
  1181 |     ).toBe(testCase.badge.remainingCartCount);
  1182 |   });
  1183 | });
  1184 | 
```