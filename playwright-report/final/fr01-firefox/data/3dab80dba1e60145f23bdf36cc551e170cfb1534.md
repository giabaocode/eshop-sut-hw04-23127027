# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 1 >> FR01-TC02 required controls reject blank and one-field omissions with correctly placed application errors
- Location: tests/features/fr01-registration.spec.ts:126:7

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
  34  |   registrationPath: string,
  35  |   input: RegistrationFillInput,
  36  |   fieldsToFill: RegistrationFieldKey[],
  37  |   registrationEndpoint: string,
  38  |   expectedRegistrationRequestCount: number,
  39  |   scenarioName: string,
  40  | ): Promise<void> {
  41  |   await registration.goto(registrationPath);
  42  |   const registrationRequests = registration.observeRegistrationPostRequests(
  43  |     registrationEndpoint,
  44  |   );
  45  | 
  46  |   try {
  47  |     const email = generateCollisionSafeEmail(input.emailTemplate);
  48  |     await registration.fillSelectedFields(input, email, fieldsToFill);
  49  |     const registrationUrl = page.url();
  50  | 
  51  |     await registration.submit();
  52  | 
  53  |     await expect(
  54  |       page,
  55  |       `${scenarioName} must remain on the registration page`,
  56  |     ).toHaveURL(registrationUrl);
  57  |     await expect(registration.form).toBeVisible();
  58  | 
  59  |     const applicationError = registration.visibleNonEmptyApplicationError();
  60  |     await expect(
  61  |       applicationError,
  62  |       `${scenarioName} must show an application validation error`,
  63  |     ).toBeVisible();
  64  |     await expect(
  65  |       applicationError,
  66  |       `${scenarioName} application validation error must be non-empty`,
  67  |     ).toContainText(/\S/);
  68  |     await expect
  69  |       .poll(
  70  |         () => registration.applicationErrorIsAboveSubmit(applicationError),
  71  |         {
  72  |           message: `${scenarioName} application validation error must appear above submit`,
  73  |         },
  74  |       )
  75  |       .toBe(true);
  76  |     expect(
  77  |       registrationRequests.count(),
  78  |       `${scenarioName} must not invoke the registration creation path`,
  79  |     ).toBe(expectedRegistrationRequestCount);
  80  |   } finally {
  81  |     registrationRequests.stop();
  82  |   }
  83  | }
  84  | 
  85  | test.describe('FR-01 account registration — reviewed increment 1', () => {
  86  |   test(`${validRegistrationUiCase.id} ${validRegistrationUiCase.title}`, async ({
  87  |     page,
  88  |   }) => {
  89  |     const testCase = validRegistrationUiCase;
  90  |     const registration = new RegistrationPage(page, testCase.expected.labels);
  91  | 
  92  |     await registration.goto(testCase.registrationPath);
  93  | 
  94  |     await expect(registration.allLevelOneHeadings).toHaveCount(1);
  95  |     await expect(registration.heading).toBeVisible();
  96  |     await expect(registration.confirmationPasswordInput).toBeVisible();
  97  |     await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
  98  |     for (const expectedText of testCase.expected.vietnameseContent) {
  99  |       await expect(registration.visibleContent(expectedText)).toBeVisible();
  100 |     }
  101 | 
  102 |     const submitColor = await registration.submitColorAssessment();
  103 |     expect(
  104 |       submitColor.isBlue,
  105 |       `Expected the positive registration submit action to be blue; computed background was ${submitColor.cssValue}`,
  106 |     ).toBe(true);
  107 | 
  108 |     const email = generateCollisionSafeEmail(testCase.input.emailTemplate);
  109 |     await registration.fillSelectedFields(
  110 |       testCase.input,
  111 |       email,
  112 |       testCase.fieldsToFill,
  113 |     );
  114 |     await registration.submit();
  115 | 
  116 |     await expect(registration.loginHeading(testCase.expected.loginDestination)).toBeVisible();
  117 |     await expect(registration.loginForm(testCase.expected.loginDestination)).toBeVisible();
  118 |     await expect(
  119 |       registration.loginEmailInput(testCase.expected.loginDestination),
  120 |     ).toBeVisible();
  121 |     await expect(
  122 |       registration.loginPasswordInput(testCase.expected.loginDestination),
  123 |     ).toBeVisible();
  124 |   });
  125 | 
  126 |   test(`${requiredFieldOmissionsCase.id} ${requiredFieldOmissionsCase.title}`, async ({
  127 |     page,
  128 |   }) => {
  129 |     const testCase = requiredFieldOmissionsCase;
  130 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  131 | 
  132 |     await registration.goto(testCase.registrationPath);
  133 | 
> 134 |     await expect(registration.confirmationPasswordInput).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  135 |     await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
  136 |     for (const field of testCase.expected.requiredFields) {
  137 |       const input = registration.inputFor(field);
  138 |       const label = registration.requiredLabelFor(field);
  139 |       await expect(input, `Required ${field} control must be visible`).toBeVisible();
  140 |       await expect(input, `Required ${field} control must be marked required`).toHaveAttribute("required", "");
  141 |       await expect(label, `Required ${field} label must be visible`).toBeVisible();
  142 |       await expect(
  143 |         label,
  144 |         `Required ${field} label must show ${testCase.expected.requiredMarker}`,
  145 |       ).toContainText(testCase.expected.requiredMarker);
  146 |     }
  147 | 
  148 |     for (const variant of testCase.variants) {
  149 |       await registration.goto(testCase.registrationPath);
  150 |       const attemptedEmail = generateCollisionSafeEmail(
  151 |         variant.input.emailTemplate,
  152 |       );
  153 |       await registration.fillSelectedFields(
  154 |         variant.input,
  155 |         attemptedEmail,
  156 |         variant.fieldsToFill,
  157 |       );
  158 | 
  159 |       for (const field of testCase.expected.requiredFields) {
  160 |         const input = registration.inputFor(field);
  161 |         if (variant.omittedFields.includes(field)) {
  162 |           await expect(
  163 |             input,
  164 |             `${variant.name} must leave ${field} blank`,
  165 |           ).toHaveValue('');
  166 |         } else {
  167 |           await expect(
  168 |             input,
  169 |             `${variant.name} must populate non-omitted ${field}`,
  170 |           ).not.toHaveValue('');
  171 |         }
  172 |       }
  173 | 
  174 |       expect(
  175 |         await registration.formIsValid(),
  176 |         `${variant.name} must be invalid before submission`,
  177 |       ).toBe(false);
  178 | 
  179 |       const registrationUrl = page.url();
  180 |       await registration.submit();
  181 |       await expect(
  182 |         page,
  183 |         `${variant.name} must remain on the registration page`,
  184 |       ).toHaveURL(registrationUrl);
  185 |       await expect(registration.form).toBeVisible();
  186 | 
  187 |       // Native constraint validation need not create an application error.
  188 |       // If the application does render one, its required placement is asserted.
  189 |       for (const applicationError of await registration.visibleApplicationErrors()) {
  190 |         expect(
  191 |           await registration.applicationErrorIsAboveSubmit(applicationError),
  192 |           `${variant.name} application error must appear above submit`,
  193 |         ).toBe(true);
  194 |       }
  195 |     }
  196 |   });
  197 | 
  198 |   test(`${emailFormatPartitionsCase.id} ${emailFormatPartitionsCase.title}`, async ({
  199 |     page,
  200 |   }) => {
  201 |     const testCase = emailFormatPartitionsCase;
  202 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  203 | 
  204 |     await registration.goto(testCase.registrationPath);
  205 |     await expect(registration.emailInput).toHaveAttribute(
  206 |       'type',
  207 |       testCase.expected.emailType,
  208 |     );
  209 | 
  210 |     for (const partition of testCase.invalid) {
  211 |       await registration.goto(testCase.registrationPath);
  212 |       const email = generateCollisionSafeEmail(partition.input.emailTemplate);
  213 |       await registration.fillSelectedFields(
  214 |         partition.input,
  215 |         email,
  216 |         testCase.fieldsToFill,
  217 |       );
  218 | 
  219 |       expect(
  220 |         await registration.emailIsValid(),
  221 |         `${partition.name} must be rejected by email-format validity`,
  222 |       ).toBe(false);
  223 | 
  224 |       const registrationUrl = page.url();
  225 |       await registration.submit();
  226 |       await expect(
  227 |         page,
  228 |         `${partition.name} must not complete registration`,
  229 |       ).toHaveURL(registrationUrl);
  230 |       await expect(registration.form).toBeVisible();
  231 |     }
  232 | 
  233 |     await registration.goto(testCase.registrationPath);
  234 |     const validEmail = generateCollisionSafeEmail(
```