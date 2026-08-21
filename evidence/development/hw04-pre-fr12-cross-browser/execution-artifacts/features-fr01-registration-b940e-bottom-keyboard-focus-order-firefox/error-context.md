# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 1 >> FR01-TC04 confirmation and password semantics have one h1 and top-to-bottom keyboard focus order
- Location: tests/features/fr01-registration.spec.ts:248:7

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
> 256 |     await expect(registration.confirmationPasswordInput).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
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
  306 |       testCase.expected.registrationEndpoint,
  307 |       invalidBoundary.expected.registrationRequestCount,
  308 |       invalidBoundary.name,
  309 |     );
  310 | 
  311 |     const validBoundary = testCase.variants.eightCharacterValid;
  312 |     await registration.goto(testCase.registrationPath);
  313 |     const registrationRequests = registration.observeRegistrationPostRequests(
  314 |       testCase.expected.registrationEndpoint,
  315 |     );
  316 | 
  317 |     try {
  318 |       const email = generateCollisionSafeEmail(
  319 |         validBoundary.input.emailTemplate,
  320 |       );
  321 |       await registration.fillSelectedFields(
  322 |         validBoundary.input,
  323 |         email,
  324 |         testCase.fieldsToFill,
  325 |       );
  326 |       await registration.submit();
  327 | 
  328 |       await expect(
  329 |         registration.loginHeading(testCase.expected.loginDestination),
  330 |       ).toBeVisible();
  331 |       await expect(
  332 |         registration.loginForm(testCase.expected.loginDestination),
  333 |       ).toBeVisible();
  334 |       await expect(
  335 |         registration.loginEmailInput(testCase.expected.loginDestination),
  336 |       ).toBeVisible();
  337 |       await expect(
  338 |         registration.loginPasswordInput(testCase.expected.loginDestination),
  339 |       ).toBeVisible();
  340 |       expect(
  341 |         registrationRequests.count(),
  342 |         `${validBoundary.name} must submit exactly one registration request`,
  343 |       ).toBe(validBoundary.expected.registrationRequestCount);
  344 |     } finally {
  345 |       registrationRequests.stop();
  346 |     }
  347 |   });
  348 | 
  349 |   test(`${passwordMissingUppercaseCase.id} ${passwordMissingUppercaseCase.title}`, async ({
  350 |     page,
  351 |   }) => {
  352 |     const testCase = passwordMissingUppercaseCase;
  353 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  354 | 
  355 |     await submitAndAssertPasswordRejection(
  356 |       page,
```