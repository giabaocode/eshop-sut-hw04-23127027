# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 2 >> FR01-TC05 password minimum length rejects seven characters and accepts eight
- Location: tests/features/fr01-registration.spec.ts:288:7

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
  - textbox: fr01-tc05-eight-mt13ymgp-1phy-e42644a288b442e7bed11a84a05698ae@example.test
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
  225 |       await expect(registration.form).toBeVisible();
  226 |     }
  227 | 
  228 |     await registration.goto(testCase.registrationPath);
  229 |     const validEmail = generateCollisionSafeEmail(
  230 |       testCase.valid.input.emailTemplate,
  231 |     );
  232 |     await registration.fillSelectedFields(
  233 |       testCase.valid.input,
  234 |       validEmail,
  235 |       testCase.fieldsToFill,
  236 |     );
  237 |     expect(
  238 |       await registration.emailIsValid(),
  239 |       `${testCase.valid.name} must not be rejected for email format alone`,
  240 |     ).toBe(true);
  241 |   });
  242 | 
  243 |   test(`${registrationFormSemanticsCase.id} ${registrationFormSemanticsCase.title}`, async ({
  244 |     page,
  245 |   }) => {
  246 |     const testCase = registrationFormSemanticsCase;
  247 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  248 | 
  249 |     await registration.goto(testCase.registrationPath);
  250 | 
  251 |     await expect(registration.confirmationPasswordInput).toBeVisible();
  252 |     await expect(registration.confirmationPasswordInput).toHaveAttribute("required", "");
  253 |     await expect(registration.passwordInput).toHaveAttribute(
  254 |       'type',
  255 |       testCase.expected.passwordType,
  256 |     );
  257 |     await expect(registration.confirmationPasswordInput).toHaveAttribute(
  258 |       'type',
  259 |       testCase.expected.passwordType,
  260 |     );
  261 |     await expect(registration.allLevelOneHeadings).toHaveCount(1);
  262 |     await expect(registration.heading).toBeVisible();
  263 | 
  264 |     const focusOrder = testCase.expected.focusOrder;
  265 |     const firstControl = registration.focusControlFor(focusOrder[0]);
  266 |     await firstControl.focus();
  267 | 
  268 |     for (let index = 0; index < focusOrder.length; index += 1) {
  269 |       const current = registration.focusControlFor(focusOrder[index]);
  270 |       await expect(
  271 |         current,
  272 |         `${focusOrder[index]} must receive focus at position ${index + 1}`,
  273 |       ).toBeFocused();
  274 | 
  275 |       if (index + 1 < focusOrder.length) {
  276 |         const next = registration.focusControlFor(focusOrder[index + 1]);
  277 |         expect(
  278 |           await registration.followsVisualReadingOrder(current, next),
  279 |           `${focusOrder[index + 1]} must follow ${focusOrder[index]} visually`,
  280 |         ).toBe(true);
  281 |         await page.keyboard.press('Tab');
  282 |       }
  283 |     }
  284 |   });
  285 | });
  286 | 
  287 | test.describe('FR-01 account registration — reviewed increment 2', () => {
  288 |   test(`${passwordLengthBoundaryCase.id} ${passwordLengthBoundaryCase.title}`, async ({
  289 |     page,
  290 |   }) => {
  291 |     const testCase = passwordLengthBoundaryCase;
  292 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  293 |     const invalidBoundary = testCase.variants.sevenCharacterInvalid;
  294 | 
  295 |     await submitAndAssertPasswordRejection(
  296 |       page,
  297 |       registration,
  298 |       testCase.registrationPath,
  299 |       invalidBoundary.input,
  300 |       testCase.fieldsToFill,
  301 |       testCase.expected.registrationEndpoint,
  302 |       invalidBoundary.expected.registrationRequestCount,
  303 |       invalidBoundary.name,
  304 |     );
  305 | 
  306 |     const validBoundary = testCase.variants.eightCharacterValid;
  307 |     await registration.goto(testCase.registrationPath);
  308 |     const registrationRequests = registration.observeRegistrationPostRequests(
  309 |       testCase.expected.registrationEndpoint,
  310 |     );
  311 | 
  312 |     try {
  313 |       const email = generateCollisionSafeEmail(
  314 |         validBoundary.input.emailTemplate,
  315 |       );
  316 |       await registration.fillSelectedFields(
  317 |         validBoundary.input,
  318 |         email,
  319 |         testCase.fieldsToFill,
  320 |       );
  321 |       await registration.submit();
  322 | 
  323 |       await expect(
  324 |         registration.loginHeading(testCase.expected.loginDestination),
> 325 |       ).toBeVisible();
      |         ^ Error: expect(locator).toBeVisible() failed
  326 |       await expect(
  327 |         registration.loginForm(testCase.expected.loginDestination),
  328 |       ).toBeVisible();
  329 |       await expect(
  330 |         registration.loginEmailInput(testCase.expected.loginDestination),
  331 |       ).toBeVisible();
  332 |       await expect(
  333 |         registration.loginPasswordInput(testCase.expected.loginDestination),
  334 |       ).toBeVisible();
  335 |       expect(
  336 |         registrationRequests.count(),
  337 |         `${validBoundary.name} must submit exactly one registration request`,
  338 |       ).toBe(validBoundary.expected.registrationRequestCount);
  339 |     } finally {
  340 |       registrationRequests.stop();
  341 |     }
  342 |   });
  343 | 
  344 |   test(`${passwordMissingUppercaseCase.id} ${passwordMissingUppercaseCase.title}`, async ({
  345 |     page,
  346 |   }) => {
  347 |     const testCase = passwordMissingUppercaseCase;
  348 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  349 | 
  350 |     await submitAndAssertPasswordRejection(
  351 |       page,
  352 |       registration,
  353 |       testCase.registrationPath,
  354 |       testCase.input,
  355 |       testCase.fieldsToFill,
  356 |       testCase.expected.registrationEndpoint,
  357 |       testCase.expected.registrationRequestCount,
  358 |       testCase.id,
  359 |     );
  360 |   });
  361 | 
  362 |   test(`${passwordMissingLowercaseCase.id} ${passwordMissingLowercaseCase.title}`, async ({
  363 |     page,
  364 |   }) => {
  365 |     const testCase = passwordMissingLowercaseCase;
  366 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  367 | 
  368 |     await submitAndAssertPasswordRejection(
  369 |       page,
  370 |       registration,
  371 |       testCase.registrationPath,
  372 |       testCase.input,
  373 |       testCase.fieldsToFill,
  374 |       testCase.expected.registrationEndpoint,
  375 |       testCase.expected.registrationRequestCount,
  376 |       testCase.id,
  377 |     );
  378 |   });
  379 | 
  380 |   test(`${passwordMissingDigitCase.id} ${passwordMissingDigitCase.title}`, async ({
  381 |     page,
  382 |   }) => {
  383 |     const testCase = passwordMissingDigitCase;
  384 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  385 | 
  386 |     await submitAndAssertPasswordRejection(
  387 |       page,
  388 |       registration,
  389 |       testCase.registrationPath,
  390 |       testCase.input,
  391 |       testCase.fieldsToFill,
  392 |       testCase.expected.registrationEndpoint,
  393 |       testCase.expected.registrationRequestCount,
  394 |       testCase.id,
  395 |     );
  396 |   });
  397 | });
  398 | 
```