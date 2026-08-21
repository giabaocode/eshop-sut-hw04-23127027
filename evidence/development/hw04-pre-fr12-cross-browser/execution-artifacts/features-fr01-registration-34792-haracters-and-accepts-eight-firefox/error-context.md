# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 2 >> FR01-TC05 password minimum length rejects seven characters and accepts eight
- Location: tests/features/fr01-registration.spec.ts:293:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

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
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc05-eight-mt29xq57-i89-b88d94cc3dbf4948aa4e1503e114a293@example.test
  - text: Mật khẩu
  - textbox: Aa1!bbbb
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
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
> 330 |       ).toBeVisible();
      |         ^ Error: expect(locator).toBeVisible() failed
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
  357 |       registration,
  358 |       testCase.registrationPath,
  359 |       testCase.input,
  360 |       testCase.fieldsToFill,
  361 |       testCase.expected.registrationEndpoint,
  362 |       testCase.expected.registrationRequestCount,
  363 |       testCase.id,
  364 |     );
  365 |   });
  366 | 
  367 |   test(`${passwordMissingLowercaseCase.id} ${passwordMissingLowercaseCase.title}`, async ({
  368 |     page,
  369 |   }) => {
  370 |     const testCase = passwordMissingLowercaseCase;
  371 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  372 | 
  373 |     await submitAndAssertPasswordRejection(
  374 |       page,
  375 |       registration,
  376 |       testCase.registrationPath,
  377 |       testCase.input,
  378 |       testCase.fieldsToFill,
  379 |       testCase.expected.registrationEndpoint,
  380 |       testCase.expected.registrationRequestCount,
  381 |       testCase.id,
  382 |     );
  383 |   });
  384 | 
  385 |   test(`${passwordMissingDigitCase.id} ${passwordMissingDigitCase.title}`, async ({
  386 |     page,
  387 |   }) => {
  388 |     const testCase = passwordMissingDigitCase;
  389 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  390 | 
  391 |     await submitAndAssertPasswordRejection(
  392 |       page,
  393 |       registration,
  394 |       testCase.registrationPath,
  395 |       testCase.input,
  396 |       testCase.fieldsToFill,
  397 |       testCase.expected.registrationEndpoint,
  398 |       testCase.expected.registrationRequestCount,
  399 |       testCase.id,
  400 |     );
  401 |   });
  402 | });
  403 | 
  404 | test.describe('FR-01 account registration — reviewed increment 3', () => {
  405 |   test(`${passwordMissingAllowedSpecialCase.id} ${passwordMissingAllowedSpecialCase.title}`, async ({
  406 |     page,
  407 |   }) => {
  408 |     const testCase = passwordMissingAllowedSpecialCase;
  409 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  410 | 
  411 |     await submitAndAssertPasswordRejection(
  412 |       page,
  413 |       registration,
  414 |       testCase.registrationPath,
  415 |       testCase.input,
  416 |       testCase.fieldsToFill,
  417 |       testCase.expected.registrationEndpoint,
  418 |       testCase.expected.registrationRequestCount,
  419 |       testCase.id,
  420 |     );
  421 |   });
  422 | 
  423 |   test(`${passwordEachAllowedSpecialCase.id} ${passwordEachAllowedSpecialCase.title}`, async ({
  424 |     page,
  425 |   }) => {
  426 |     test.slow();
  427 |     const testCase = passwordEachAllowedSpecialCase;
  428 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  429 | 
  430 |     for (const row of testCase.rows) {
```