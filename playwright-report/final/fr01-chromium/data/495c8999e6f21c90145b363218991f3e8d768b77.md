# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 1 >> FR01-TC03 email control enforces invalid and valid format partitions without browser-specific wording
- Location: tests/features/fr01-registration.spec.ts:198:7

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
  134 |     await expect(registration.confirmationPasswordInput).toBeVisible();
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
> 205 |     await expect(registration.emailInput).toHaveAttribute(
      |                                           ^ Error: expect(locator).toHaveAttribute(expected) failed
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
  235 |       testCase.valid.input.emailTemplate,
  236 |     );
  237 |     await registration.fillSelectedFields(
  238 |       testCase.valid.input,
  239 |       validEmail,
  240 |       testCase.fieldsToFill,
  241 |     );
  242 |     expect(
  243 |       await registration.emailIsValid(),
  244 |       `${testCase.valid.name} must not be rejected for email format alone`,
  245 |     ).toBe(true);
  246 |   });
  247 | 
  248 |   test(`${registrationFormSemanticsCase.id} ${registrationFormSemanticsCase.title}`, async ({
  249 |     page,
  250 |   }) => {
  251 |     const testCase = registrationFormSemanticsCase;
  252 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  253 | 
  254 |     await registration.goto(testCase.registrationPath);
  255 | 
  256 |     await expect(registration.confirmationPasswordInput).toBeVisible();
  257 |     await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
  258 |     await expect(registration.passwordInput).toHaveAttribute(
  259 |       'type',
  260 |       testCase.expected.passwordType,
  261 |     );
  262 |     await expect(registration.confirmationPasswordInput).toHaveAttribute(
  263 |       'type',
  264 |       testCase.expected.passwordType,
  265 |     );
  266 |     await expect(registration.allLevelOneHeadings).toHaveCount(1);
  267 |     await expect(registration.heading).toBeVisible();
  268 | 
  269 |     const focusOrder = testCase.expected.focusOrder;
  270 |     const firstControl = registration.focusControlFor(focusOrder[0]);
  271 |     await firstControl.focus();
  272 | 
  273 |     for (let index = 0; index < focusOrder.length; index += 1) {
  274 |       const current = registration.focusControlFor(focusOrder[index]);
  275 |       await expect(
  276 |         current,
  277 |         `${focusOrder[index]} must receive focus at position ${index + 1}`,
  278 |       ).toBeFocused();
  279 | 
  280 |       if (index + 1 < focusOrder.length) {
  281 |         const next = registration.focusControlFor(focusOrder[index + 1]);
  282 |         expect(
  283 |           await registration.followsVisualReadingOrder(current, next),
  284 |           `${focusOrder[index + 1]} must follow ${focusOrder[index]} visually`,
  285 |         ).toBe(true);
  286 |         await page.keyboard.press('Tab');
  287 |       }
  288 |     }
  289 |   });
  290 | });
  291 | 
  292 | test.describe('FR-01 account registration — reviewed increment 2', () => {
  293 |   test(`${passwordLengthBoundaryCase.id} ${passwordLengthBoundaryCase.title}`, async ({
  294 |     page,
  295 |   }) => {
  296 |     const testCase = passwordLengthBoundaryCase;
  297 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  298 |     const invalidBoundary = testCase.variants.sevenCharacterInvalid;
  299 | 
  300 |     await submitAndAssertPasswordRejection(
  301 |       page,
  302 |       registration,
  303 |       testCase.registrationPath,
  304 |       invalidBoundary.input,
  305 |       testCase.fieldsToFill,
```