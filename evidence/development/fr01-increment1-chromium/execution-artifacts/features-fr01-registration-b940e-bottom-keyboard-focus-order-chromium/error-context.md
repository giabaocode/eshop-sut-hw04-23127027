# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 1 >> FR01-TC04 confirmation and password semantics have one h1 and top-to-bottom keyboard focus order
- Location: tests/features/fr01-registration.spec.ts:180:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng ký\s*$/i }) }).locator('label').filter({ hasText: /^\s*Xác nhận mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng ký\s*$/i }) }).locator('label').filter({ hasText: /^\s*Xác nhận mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

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
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Họ Tên
  - textbox
  - text: Email
  - textbox
  - text: Mật khẩu
  - textbox
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  88  |         variant.fieldsToFill,
  89  |       );
  90  | 
  91  |       for (const field of testCase.expected.requiredFields) {
  92  |         const input = registration.inputFor(field);
  93  |         if (variant.omittedFields.includes(field)) {
  94  |           await expect(
  95  |             input,
  96  |             `${variant.name} must leave ${field} blank`,
  97  |           ).toHaveValue('');
  98  |         } else {
  99  |           await expect(
  100 |             input,
  101 |             `${variant.name} must populate non-omitted ${field}`,
  102 |           ).not.toHaveValue('');
  103 |         }
  104 |       }
  105 | 
  106 |       expect(
  107 |         await registration.formIsValid(),
  108 |         `${variant.name} must be invalid before submission`,
  109 |       ).toBe(false);
  110 | 
  111 |       const registrationUrl = page.url();
  112 |       await registration.submit();
  113 |       await expect(
  114 |         page,
  115 |         `${variant.name} must remain on the registration page`,
  116 |       ).toHaveURL(registrationUrl);
  117 |       await expect(registration.form).toBeVisible();
  118 | 
  119 |       // Native constraint validation need not create an application error.
  120 |       // If the application does render one, its required placement is asserted.
  121 |       for (const applicationError of await registration.visibleApplicationErrors()) {
  122 |         expect(
  123 |           await registration.applicationErrorIsAboveSubmit(applicationError),
  124 |           `${variant.name} application error must appear above submit`,
  125 |         ).toBe(true);
  126 |       }
  127 |     }
  128 |   });
  129 | 
  130 |   test(`${emailFormatPartitionsCase.id} ${emailFormatPartitionsCase.title}`, async ({
  131 |     page,
  132 |   }) => {
  133 |     const testCase = emailFormatPartitionsCase;
  134 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  135 | 
  136 |     await registration.goto(testCase.registrationPath);
  137 |     await expect(registration.emailInput).toHaveAttribute(
  138 |       'type',
  139 |       testCase.expected.emailType,
  140 |     );
  141 | 
  142 |     for (const partition of testCase.invalid) {
  143 |       await registration.goto(testCase.registrationPath);
  144 |       const email = generateCollisionSafeEmail(partition.input.emailTemplate);
  145 |       await registration.fillSelectedFields(
  146 |         partition.input,
  147 |         email,
  148 |         testCase.fieldsToFill,
  149 |       );
  150 | 
  151 |       expect(
  152 |         await registration.emailIsValid(),
  153 |         `${partition.name} must be rejected by email-format validity`,
  154 |       ).toBe(false);
  155 | 
  156 |       const registrationUrl = page.url();
  157 |       await registration.submit();
  158 |       await expect(
  159 |         page,
  160 |         `${partition.name} must not complete registration`,
  161 |       ).toHaveURL(registrationUrl);
  162 |       await expect(registration.form).toBeVisible();
  163 |     }
  164 | 
  165 |     await registration.goto(testCase.registrationPath);
  166 |     const validEmail = generateCollisionSafeEmail(
  167 |       testCase.valid.input.emailTemplate,
  168 |     );
  169 |     await registration.fillSelectedFields(
  170 |       testCase.valid.input,
  171 |       validEmail,
  172 |       testCase.fieldsToFill,
  173 |     );
  174 |     expect(
  175 |       await registration.emailIsValid(),
  176 |       `${testCase.valid.name} must not be rejected for email format alone`,
  177 |     ).toBe(true);
  178 |   });
  179 | 
  180 |   test(`${registrationFormSemanticsCase.id} ${registrationFormSemanticsCase.title}`, async ({
  181 |     page,
  182 |   }) => {
  183 |     const testCase = registrationFormSemanticsCase;
  184 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  185 | 
  186 |     await registration.goto(testCase.registrationPath);
  187 | 
> 188 |     await expect(registration.confirmationPasswordInput).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  189 |     await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
  190 |     await expect(registration.passwordInput).toHaveAttribute(
  191 |       'type',
  192 |       testCase.expected.passwordType,
  193 |     );
  194 |     await expect(registration.confirmationPasswordInput).toHaveAttribute(
  195 |       'type',
  196 |       testCase.expected.passwordType,
  197 |     );
  198 |     await expect(registration.allLevelOneHeadings).toHaveCount(1);
  199 |     await expect(registration.heading).toBeVisible();
  200 | 
  201 |     const focusOrder = testCase.expected.focusOrder;
  202 |     const firstControl = registration.focusControlFor(focusOrder[0]);
  203 |     await firstControl.focus();
  204 | 
  205 |     for (let index = 0; index < focusOrder.length; index += 1) {
  206 |       const current = registration.focusControlFor(focusOrder[index]);
  207 |       await expect(
  208 |         current,
  209 |         `${focusOrder[index]} must receive focus at position ${index + 1}`,
  210 |       ).toBeFocused();
  211 | 
  212 |       if (index + 1 < focusOrder.length) {
  213 |         const next = registration.focusControlFor(focusOrder[index + 1]);
  214 |         expect(
  215 |           await registration.followsVisualReadingOrder(current, next),
  216 |           `${focusOrder[index + 1]} must follow ${focusOrder[index]} visually`,
  217 |         ).toBe(true);
  218 |         await page.keyboard.press('Tab');
  219 |       }
  220 |     }
  221 |   });
  222 | });
  223 | 
```