# Interaction 0011

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-20T06:35:45Z

## Exact prompt

````text
Extend the existing reviewed FR-01 Playwright automation with increment 3 covering exactly FR01-TC09 through FR01-TC12.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- api_specification.md
- playwright.config.ts
- .env.example
- tests/data/fr01-registration.json
- tests/features/fr01-registration.spec.ts
- tests/pages/registration.page.ts
- tests/support/data-loader.ts

Modify only these automation files when necessary:
- tests/data/fr01-registration.json
- tests/features/fr01-registration.spec.ts
- tests/pages/registration.page.ts
- tests/support/data-loader.ts

Do not modify SUT source, documentation, configuration, package files, evidence, or ai-audit files. Do not run tests.

Add exactly four test declarations whose IDs and titles come from external JSON:
- FR01-TC09: password requires an allowed special character.
- FR01-TC10: each of @, $, !, %, *, ?, & satisfies the special-character rule.
- FR01-TC11: confirmation equal-versus-unequal decision table and error placement.
- FR01-TC12: unique-email registration followed by duplicate registration through the API.

Add these exact external JSON keys:
- password_missing_allowed_special
- password_each_allowed_special
- confirmation_match_matrix
- api_unique_then_duplicate

General rules:
1. Keep IDs, titles, row names, inputs, fieldsToFill, endpoints, expected statuses/messages/counts, symbols, and decision-table values in external JSON. Do not add inline case arrays.
2. Continue using collision-safe run-unique email templates.
3. Preserve FR01-TC01 through FR01-TC08 unchanged in intent and assertion strength.
4. Keep current form-scoped label-parent-input locators. Do not use getByLabel for the current DOM.
5. Do not use waitForTimeout, arbitrary sleeps, test.skip, test.fixme, conditionally bypassed requirement assertions, exact browser-native wording, or unsupported Playwright matchers.
6. Exact application validation wording remains EVIDENCE MISSING and must not be asserted.
7. Do not change the SUT to make tests pass.

TC09:
- Use password "Abcdefg1": eight characters with uppercase, lowercase, and digit, but none of the seven permitted special characters.
- Fill exactly ["fullName", "email", "password"].
- Submit through the UI.
- Assert it remains on registration, displays a visible non-empty application error above submit, and sends zero POST /api/register requests.
- Reuse the reviewed rejection helper where appropriate.

TC10:
- Store exactly seven JSON rows, one for each symbol: @, $, !, %, *, ?, &.
- Vary only the permitted symbol in these passwords:
  "Abcdef1@", "Abcdef1$", "Abcdef1!", "Abcdef1%",
  "Abcdef1*", "Abcdef1?", "Abcdef1&".
- Fill exactly ["fullName", "email", "password"].
- Every row must use a distinct collision-safe email.
- Every row must submit through the UI, reach the documented login destination, and send exactly one POST /api/register.
- Use test.step for readable row evidence.
- Use expect.soft only within this seven-row test so all listed symbols are exercised in one test declaration even when one or more rows fail. Soft assertions must retain the full navigation and request-count requirements.
- Use test.slow() rather than reducing assertion timeouts, so all seven rows can complete.
- Do not test unlisted special characters.
- Runtime users created by successful rows will be removed by restoring the controlled database backup after execution; do not invent a cleanup endpoint.

TC11:
- Store exactly two JSON rows: unequal and equal.
- Use a specification-valid password such as "Abcdef1!".
- Unequal row confirmation must differ while remaining a valid password value.
- Equal row confirmation must equal the password.
- Fill exactly ["fullName", "email", "password", "confirmationPassword"].
- First assert the confirmation-password control is visible, required, and type=password as a hard prerequisite.
- Unequal row must remain on registration, show a visible non-empty application error above submit, and send zero POST /api/register.
- Equal row must not be rejected for mismatch: it must reach the documented login destination and send exactly one POST /api/register.
- Any visible application error asserted for the unequal row must be geometrically above submit.
- Do not weaken or bypass the prerequisite if the current SUT lacks the control.
- Any user created by the equal row will be removed by restoring the controlled database backup after execution.

TC12:
- Use Playwright's request fixture and an absolute API URL composed from:
  process.env.PW_API_URL ?? "http://localhost:3000"
  plus the endpoint stored in JSON.
- Do not accidentally send TC12 to the frontend baseURL.
- JSON must contain a first valid registration record and a second record that reuses the same generated email.
- The API body must follow the documented contract and omit confirmationPassword.
- First POST must return the documented 200 status, documented success message, and a numeric id.
- Capture the first id.
- Second POST with the same email must be rejected. Because duplicate failure status/body are EVIDENCE MISSING, assert that the second response is not successful without inventing an exact status or wording.
- Preserve response bodies sufficiently for clear assertion diagnostics.
- This test must demonstrate the unique-then-duplicate state transition; do not mock or intercept the API.
- Runtime records will be removed by restoring the controlled database backup after execution; do not invent a cleanup endpoint.

Keep TypeScript strict-compatible and Playwright 1.62.1-compatible. The final file must contain exactly twelve FR01 test declarations total.

After editing, report:
- exact files changed;
- the four added JSON keys and IDs;
- the seven TC10 symbols;
- the TC11 decision-table rows;
- the TC12 API transition oracle;
- confirmation that no tests were run and no SUT or audit file was modified.
````

## Exact AI output
````text
Implemented FR-01 increment 3 with exactly 12 total test declarations.

Changed files:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json)
- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

Added JSON keys and IDs:

- `password_missing_allowed_special` — `FR01-TC09`
- `password_each_allowed_special` — `FR01-TC10`
- `confirmation_match_matrix` — `FR01-TC11`
- `api_unique_then_duplicate` — `FR01-TC12`

TC10 symbols: `@`, `$`, `!`, `%`, `*`, `?`, `&`.

TC11 decision table:

- `unequal`: `Abcdef1!` / `Abcdef1?` → remain on registration, application error above submit, zero registration POSTs.
- `equal`: `Abcdef1!` / `Abcdef1!` → reach login, exactly one registration POST.

TC12 oracle:

- First unique-email POST → status `200`, documented success message, numeric `id`.
- Capture that `id`.
- Second POST reusing the generated email → `response.ok()` is false, without asserting undocumented status or wording.

Static JSON, diff, and strict TypeScript checks passed. No tests were run. No SUT, documentation, configuration, package, evidence, page-object, or audit file was modified; existing untracked audit artifacts were left untouched.

````

## Human review/action
Tôi đã review toàn bộ increment 3 và xác nhận automation bổ sung đúng FR01-TC09 đến FR01-TC12, nâng tổng FR-01 lên đúng 12 test. TC09 cô lập trường hợp thiếu allowed special; TC10 dùng bảy external JSON rows cho @, $, !, %, *, ?, & với test.step, test.slow và soft assertions giữ nguyên navigation cùng one-POST oracle cho từng row; TC11 giữ confirmation control visible, required và type=password làm hard prerequisite trước decision table unequal/equal; TC12 dùng absolute PW_API_URL, body đúng API contract, kiểm tra first 200/success message/numeric id rồi yêu cầu duplicate response không successful mà không suy diễn status hoặc wording. TC01-TC08 không bị làm yếu, Page Object không cần sửa. Typecheck thành công và Playwright liệt kê đúng FR01-TC09 đến FR01-TC12 trên Chromium. Chưa thực thi browser/API test, chưa có pass/fail hoặc defect claim và source SUT không bị sửa.
