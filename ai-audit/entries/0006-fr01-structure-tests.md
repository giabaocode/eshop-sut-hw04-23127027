# Interaction 0006

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T12:20:40Z

## Exact prompt

````text
Implement only the first reviewed FR-01 Playwright increment for HW04 student 23127027. You may create exactly these files: tests/data/fr01-registration.json, tests/support/data-loader.ts, tests/pages/registration.page.ts, tests/features/fr01-registration.spec.ts. Do not modify any existing file, SUT source, configuration, package, documentation, or audit file. Use the authoritative requirements and docs/hw04-traceability-test-matrix.md. Implement exactly logical IDs FR01-TC01 through FR01-TC04; every test title must begin with its ID. Put all case-specific inputs, expected labels, omission variants, and email templates in the JSON file. The spec must not contain inline test-case arrays or objects. Load JSON from disk through a typed reusable loader. Generate collision-safe emails at runtime from external templates without committing live credentials. Create a registration page object with form-scoped Playwright locators and action methods; do not use fixed sleeps. TC01 must cover valid registration destination plus one h1, Vietnamese registration content, and blue positive submit behavior without inventing an exact shade. TC02 must cover required controls, visible asterisk markers, blank/one-field omission rejection, and application-error placement above submit when such an error is produced. TC03 must cover input type=email plus invalid and valid email-format partitions while avoiding assertions on browser-specific native validation wording. TC04 must cover the confirmation-password control, both password controls using type=password, exactly one h1, and top-to-bottom keyboard focus order. Missing required UI must cause clear failing assertions; do not conditionally bypass it. Do not use test.skip, test.fail, weak placeholder assertions, source-code assertions, or post-edit evidence. Do not run tests, servers, package installation, Git commands, or commits. After editing, summarize exactly the allowed files created and any design assumptions.
````

## Exact AI output
````text
Implemented exactly FR01-TC01 through FR01-TC04 and created only:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)
- [registration.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/registration.page.ts)
- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts)

Design assumptions:

- Login destination is verified semantically through login-form content, since the exact redirect URL is unspecified.
- “Blue” means the computed color’s blue channel is dominant; no exact shade is asserted.
- Email partitions use native validity state, never browser-specific messages.
- Application-error placement is checked whenever an application error is rendered; native validation need not produce one.
- Focus traversal begins at the first form control and verifies visual and Tab order through submit.
- No documented safe account-deletion interface exists, so created accounts use collision-safe runtime emails from external templates.

Per instruction, I did not run tests, servers, package commands, Git commands, or post-edit verification.
````

## Human review/action
Tôi đã review code trước khi chạy và phát hiện locator getByLabel không phù hợp DOM hiện tại, exact button name có thể làm mất form locator, fill luôn phụ thuộc confirmation làm nhiễu TC03, ID/title chưa nằm trong JSON và error locator có thể bỏ sót error thật. Tôi yêu cầu sửa automation để locator form-scoped theo cấu trúc label-parent-input, dùng accessible-name case-insensitive, cho phép điền đúng tập field cần kiểm tra, lấy ID/title từ external JSON và phát hiện error mà không sửa SUT hoặc né assertion. Chưa có test execution hoặc defect claim.
