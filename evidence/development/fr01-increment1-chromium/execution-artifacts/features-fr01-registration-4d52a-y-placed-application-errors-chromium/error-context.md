# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 1 >> FR01-TC02 required controls reject blank and one-field omissions with correctly placed application errors
- Location: tests/features/fr01-registration.spec.ts:58:7

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
  1   | import { expect, test } from '@playwright/test';
  2   | import { RegistrationPage } from '../pages/registration.page.js';
  3   | import {
  4   |   generateCollisionSafeEmail,
  5   |   loadJsonFile,
  6   | } from '../support/data-loader.js';
  7   | import type { Fr01RegistrationData } from '../support/data-loader.js';
  8   | 
  9   | const data = loadJsonFile<Fr01RegistrationData>(
  10  |   'tests/data/fr01-registration.json',
  11  | );
  12  | const validRegistrationUiCase = data.valid_registration_ui;
  13  | const requiredFieldOmissionsCase = data.required_field_omissions;
  14  | const emailFormatPartitionsCase = data.email_format_partitions;
  15  | const registrationFormSemanticsCase = data.registration_form_semantics;
  16  | 
  17  | test.describe('FR-01 account registration — reviewed increment 1', () => {
  18  |   test(`${validRegistrationUiCase.id} ${validRegistrationUiCase.title}`, async ({
  19  |     page,
  20  |   }) => {
  21  |     const testCase = validRegistrationUiCase;
  22  |     const registration = new RegistrationPage(page, testCase.expected.labels);
  23  | 
  24  |     await registration.goto(testCase.registrationPath);
  25  | 
  26  |     await expect(registration.allLevelOneHeadings).toHaveCount(1);
  27  |     await expect(registration.heading).toBeVisible();
  28  |     await expect(registration.confirmationPasswordInput).toBeVisible();
  29  |     await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
  30  |     for (const expectedText of testCase.expected.vietnameseContent) {
  31  |       await expect(registration.visibleContent(expectedText)).toBeVisible();
  32  |     }
  33  | 
  34  |     const submitColor = await registration.submitColorAssessment();
  35  |     expect(
  36  |       submitColor.isBlue,
  37  |       `Expected the positive registration submit action to be blue; computed background was ${submitColor.cssValue}`,
  38  |     ).toBe(true);
  39  | 
  40  |     const email = generateCollisionSafeEmail(testCase.input.emailTemplate);
  41  |     await registration.fillSelectedFields(
  42  |       testCase.input,
  43  |       email,
  44  |       testCase.fieldsToFill,
  45  |     );
  46  |     await registration.submit();
  47  | 
  48  |     await expect(registration.loginHeading(testCase.expected.loginDestination)).toBeVisible();
  49  |     await expect(registration.loginForm(testCase.expected.loginDestination)).toBeVisible();
  50  |     await expect(
  51  |       registration.loginEmailInput(testCase.expected.loginDestination),
  52  |     ).toBeVisible();
  53  |     await expect(
  54  |       registration.loginPasswordInput(testCase.expected.loginDestination),
  55  |     ).toBeVisible();
  56  |   });
  57  | 
  58  |   test(`${requiredFieldOmissionsCase.id} ${requiredFieldOmissionsCase.title}`, async ({
  59  |     page,
  60  |   }) => {
  61  |     const testCase = requiredFieldOmissionsCase;
  62  |     const registration = new RegistrationPage(page, testCase.expected.labels);
  63  | 
  64  |     await registration.goto(testCase.registrationPath);
  65  | 
> 66  |     await expect(registration.confirmationPasswordInput).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  67  |     await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
  68  |     for (const field of testCase.expected.requiredFields) {
  69  |       const input = registration.inputFor(field);
  70  |       const label = registration.requiredLabelFor(field);
  71  |       await expect(input, `Required ${field} control must be visible`).toBeVisible();
  72  |       await expect(input, `Required ${field} control must be marked required`).toHaveAttribute("required", "");
  73  |       await expect(label, `Required ${field} label must be visible`).toBeVisible();
  74  |       await expect(
  75  |         label,
  76  |         `Required ${field} label must show ${testCase.expected.requiredMarker}`,
  77  |       ).toContainText(testCase.expected.requiredMarker);
  78  |     }
  79  | 
  80  |     for (const variant of testCase.variants) {
  81  |       await registration.goto(testCase.registrationPath);
  82  |       const attemptedEmail = generateCollisionSafeEmail(
  83  |         variant.input.emailTemplate,
  84  |       );
  85  |       await registration.fillSelectedFields(
  86  |         variant.input,
  87  |         attemptedEmail,
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
```