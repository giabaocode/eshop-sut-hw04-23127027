# Interaction 0010

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-20T05:36:32Z

## Exact prompt

````text
Extend the existing reviewed FR-01 Playwright automation with increment 2 covering exactly FR01-TC05 through FR01-TC08.

Read and preserve the existing design in:
- docs/hw04-traceability-test-matrix.md
- tests/data/fr01-registration.json
- tests/features/fr01-registration.spec.ts
- tests/pages/registration.page.ts
- tests/support/data-loader.ts
- README.md

Modify only these automation files when necessary:
- tests/data/fr01-registration.json
- tests/features/fr01-registration.spec.ts
- tests/pages/registration.page.ts
- tests/support/data-loader.ts

Do not modify frontend-web, frontend-admin, frontend-mobile, backend, documentation, evidence, configuration, package files, or ai-audit files. Do not run tests.

Requirements:

1. Add exactly four test declarations, with IDs and titles loaded from external JSON:
   - FR01-TC05: password minimum 8 characters.
   - FR01-TC06: password requires uppercase.
   - FR01-TC07: password requires lowercase.
   - FR01-TC08: password requires a digit.

2. Add external JSON objects with these exact keys:
   - password_length_boundary
   - password_missing_uppercase
   - password_missing_lowercase
   - password_missing_digit

3. Keep all test-case IDs, titles, inputs, variants, expected values, and fieldsToFill in external JSON. Do not introduce inline test-case arrays or duplicate case data in the spec.

4. For every TC05-TC08 submission, fill exactly the existing controls:
   ["fullName", "email", "password"]
   Do not depend on confirmationPassword because these cases isolate password-rule behavior.

5. Use collision-safe unique email templates through the existing generateCollisionSafeEmail helper.

6. Use these password partitions so each case isolates its target rule:
   - TC05 seven-character invalid boundary: "Aa1!bbb"
   - TC05 eight-character valid boundary: "Aa1!bbbb"
   - TC06 missing uppercase: "abcdef1!"
   - TC07 missing lowercase: "ABCDEF1!"
   - TC08 missing digit: "Abcdefg!"
   The exclamation mark is an allowed special character in FR-01.

7. TC05 must exercise both boundaries through the UI:
   - The 7-character value must remain on registration, show a visible non-empty application validation error above submit, and must not send POST /api/register.
   - The 8-character value satisfies every specified password class and must reach the documented login destination. Capture registration requests without weakening this success oracle.
   - Do not assert an exact validation message because the matrix marks it EVIDENCE MISSING.

8. TC06-TC08 must each:
   - Submit through the UI.
   - Remain on the registration page.
   - Show a visible non-empty application validation error above submit without requiring exact wording.
   - Verify that POST /api/register was not sent, providing the state-delta evidence that the registration creation path was not invoked.

9. Add or reuse robust Page Object helpers for:
   - observing/counting POST /api/register requests;
   - locating a visible, non-empty application error within the registration view;
   - checking that the error is geometrically above the submit button.
   Keep locators form-scoped and compatible with the current label-parent-input DOM. Prefer web-first Playwright assertions. Do not use waitForTimeout, arbitrary sleeps, brittle CSS chains, getByLabel for the current unlabeled DOM, or exact browser validation wording.

10. Preserve FR01-TC01 through FR01-TC04 unchanged in intent and strength. Do not remove, skip, conditionally bypass, soften, or reorder their requirement assertions merely because the current SUT fails them.

11. Keep TypeScript strict-compatible and Playwright 1.62.1-compatible. Do not use unsupported matchers such as toBeRequired.

12. Do not change the SUT to make tests pass. Do not claim any pass/fail result or defect because no execution is authorized in this interaction.

After editing, report:
- exact files changed;
- the four JSON keys and four generated test IDs;
- the assertion/oracle used by each case;
- confirmation that no tests were run and no SUT or audit file was modified.
````

## Exact AI output
````text
Implemented FR-01 increment 2 with exactly four new test declarations.

Changed files:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json:211)
- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts:287)
- [registration.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/registration.page.ts:103)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:22)

JSON keys and generated IDs:

- `password_length_boundary` → `FR01-TC05`
- `password_missing_uppercase` → `FR01-TC06`
- `password_missing_lowercase` → `FR01-TC07`
- `password_missing_digit` → `FR01-TC08`

Oracles:

- TC05: seven-character value remains on registration, shows a visible non-empty application error above submit, and records zero registration POSTs. Eight-character value records one POST and must expose the documented login heading, form, email, and password controls.
- TC06: remains on registration, visible non-empty error above submit, zero registration POSTs.
- TC07: same rejection and zero-POST oracle.
- TC08: same rejection and zero-POST oracle.

All submissions fill only `fullName`, `email`, and `password`, using collision-safe email templates. TC01–TC04 assertions remain intact.

No Playwright tests or SUT were run. Static TypeScript, JSON syntax, and diff checks completed successfully. No SUT, documentation, configuration, package, evidence, or audit file was modified; the pre-existing untracked audit files were left untouched.

````

## Human review/action
Tôi đã review toàn bộ bốn file automation và xác nhận increment 2 bổ sung đúng FR01-TC05 đến FR01-TC08. ID, title, input, fieldsToFill và expected values được lấy từ external JSON; mỗi case chỉ điền fullName, email và password. Các password partition cô lập đúng boundary 7/8 ký tự, thiếu chữ hoa, thiếu chữ thường và thiếu chữ số. Invalid cases giữ oracle lỗi ứng dụng không rỗng nằm trên submit cùng zero POST /api/register; boundary 8 giữ success oracle tới trang đăng nhập và một registration POST. TC01-TC04 không bị làm yếu. Typecheck thành công và Playwright liệt kê đúng 8 test FR01 trên Chromium. Chưa thực thi browser test, chưa có pass/fail hoặc defect claim và source SUT không bị sửa.
