# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 1 >> FR01-TC03 email control enforces invalid and valid format partitions without browser-specific wording
- Location: tests/features/fr01-registration.spec.ts:130:7

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng ký\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: "email"
Received: "text"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng ký\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
    14 × locator resolved to <input value="" required="" type="text" class="w-full border p-2 rounded"/>
       - unexpected value "text"

```

```yaml
- textbox
```

# Test source

```ts
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
  66  |     await expect(registration.confirmationPasswordInput).toBeVisible();
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
> 137 |     await expect(registration.emailInput).toHaveAttribute(
      |                                           ^ Error: expect(locator).toHaveAttribute(expected) failed
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
  188 |     await expect(registration.confirmationPasswordInput).toBeVisible();
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