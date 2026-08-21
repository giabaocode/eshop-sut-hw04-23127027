# HW04 AI Audit Report

- Student ID: 23127027

I use AI tools for the following tasks: repository safety review, audit-workflow design, test planning, automation generation, human review support, debugging, and documentation.

# Interaction 0001

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-17T09:11:28Z

## Exact prompt

````text
Act as a documentation assistant for HW04 of student 23127027. Inspect only the existing ai-audit directory. Propose one concise Markdown audit-entry template with exactly five fields: AI tool, ISO date/time, Exact prompt, Exact AI output, Human review/action. Do not modify files and do not invent evidence.
````

## Exact AI output
````text
```markdown
## AI tool
[Record the tool used]

## ISO date/time
[YYYY-MM-DDThh:mm:ssZ]

## Exact prompt
[Paste verbatim]

## Exact AI output
[Paste verbatim]

## Human review/action
[Record verification, edits, acceptance, or rejection]
```

No files were modified.
````

## Human review/action
Tôi đã đối chiếu ba file, xác nhận prompt và output được lưu nguyên văn, template có đủ năm trường, không có evidence bị bịa và không có source file nào bị sửa.


# Interaction 0002

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T01:27:52Z

## Exact prompt

````text
Act as an implementation-inventory assistant for HW04 student 23127027. Inspect only repository documentation and source files relevant to FR-01 Account registration, FR-07 Shopping cart, and FR-12 Access control. Produce a concise Markdown table with columns: Feature, frontend files/components, backend routes or middleware, client state or data storage, and evidence as file:line. Do not propose test cases. Do not modify files. Do not label any discrepancy as a bug. Explicitly mark anything not found.
````

## Exact AI output
````text
Implementation inventory based only on scoped documentation and source files. “Not found” means no corresponding implementation was located in those files.

| Feature | Frontend files/components | Backend routes or middleware | Client state or data storage | Evidence as file:line |
|---|---|---|---|---|
| **FR-01 Account registration** | Web: `Register` form and `/register` route; collects name, email, and password, then redirects to login. Mobile: `renderRegister` and `handleRegister` with local password validation. **Not found:** confirmation-password field in either client; admin registration UI. | `POST /api/register` inserts name, email, and password into `users`. **Not found:** route middleware, backend input/password-strength validation, password hashing, or explicit email-uniqueness enforcement. | Web and mobile form values use transient React state. Registered accounts are stored in SQLite’s `users` table; its `role` defaults to `user`. Registration-state persistence: **Not found**. | Requirements: `README.md:30-36`.<br>Web: `frontend-web/src/App.jsx:50-58`, `frontend-web/src/pages/Register.jsx:5-28`, `frontend-web/src/pages/Register.jsx:34-67`.<br>Mobile: `frontend-mobile/App.js:42-46`, `frontend-mobile/App.js:209-240`, `frontend-mobile/App.js:797-837`.<br>Backend/storage: `backend/server.js:20-30`, `backend/database.js:48-61`. |
| **FR-07 Shopping cart** | Web: `Home` and `ProductDetail` add items; `Cart` displays/removes items and total; `CartProvider` supplies cart operations. Mobile: product detail, `addToCart`, and `renderCart`; duplicate product IDs are merged. **Not found:** deletion confirmation or empty-cart illustration in web/mobile; web quantity adjustment controls. | Authenticated `GET /api/cart` and `POST /api/cart`; carts are held in the server’s `userCarts` object. **Not found:** update/delete cart routes or calls to these cart routes from the web/mobile clients. | Web: in-memory `CartContext` state; adding always appends. Mobile: in-memory component state with duplicate-item merging. Server: in-memory cart arrays keyed by user ID. Persistent cart table/storage: **Not found**. | Requirements: `README.md:93-100`; API docs: `api_specification.md:110-127`.<br>Web: `frontend-web/src/context/CartContext.jsx:5-30`, `frontend-web/src/pages/Home.jsx:97-102`, `frontend-web/src/pages/ProductDetail.jsx:21-30`, `frontend-web/src/pages/Cart.jsx:6-76`.<br>Mobile: `frontend-mobile/App.js:61-77`, `frontend-mobile/App.js:134-159`, `frontend-mobile/App.js:590-655`.<br>Backend: `backend/server.js:14`, `backend/server.js:284-295`; database table initialization: `backend/database.js:15-20`. |
| **FR-12 Access control** | Separate admin `App` provides a login gate, checks `res.data.user.role === "admin"`, and renders admin functions only when a token exists. **Not found:** admin-access components in the customer web or mobile clients. | Login JWT contains `id` and `role`; `authenticateToken` verifies JWTs. Admin routes use this token middleware. Product mutations have no middleware; category and admin coupon mutations use token authentication. Role-checking backend middleware or a server-side `role === "admin"` authorization check: **Not found**. | Admin token is held in React state and persisted as `localStorage.adminToken`; it becomes Axios’s default Authorization header. Server roles reside in SQLite and are embedded in JWTs. Persisted client-side role state: **Not found**. | Requirements: `README.md:174-179`; API docs: `api_specification.md:171-181`.<br>Admin client: `frontend-admin/src/App.jsx:7-10`, `frontend-admin/src/App.jsx:34-70`, `frontend-admin/src/App.jsx:188-215`, `frontend-admin/src/App.jsx:263-268`.<br>JWT/middleware: `backend/server.js:46-52`, `backend/server.js:100-110`.<br>Product routes: `backend/server.js:167-196`; category routes: `backend/server.js:249-278`; admin routes: `backend/server.js:199-241`, `backend/server.js:457-488`, `backend/server.js:494-568`.<br>Role storage: `backend/database.js:48-61`. |
````

## Human review/action
Tôi đã đối chiếu các dẫn chiếu web và backend cho FR-01, FR-07 và FR-12; các nhận định chính phù hợp source. Tôi loại phần frontend-mobile khỏi test basis HW04 vì phạm vi Playwright là web. Các discrepancy được giữ làm test target và chưa được báo cáo là defect khi chưa có execution evidence.


# Interaction 0003

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T01:45:03Z

## Exact prompt

````text
Act as a test-design assistant for HW04 student 23127027. Create exactly one file: docs/hw04-traceability-test-matrix.md. Do not modify any other file. Base the matrix on README.md version 2.0 requirements for FR-01, FR-07, FR-12, relevant FR-21 through FR-24, and SEC-02, SEC-03, SEC-06. Use api_specification.md only as supporting API contract. Exclude frontend-mobile and all HW02 test cases/results. Create exactly 36 planned automated test cases: exactly 12 IDs FR01-TC01 through FR01-TC12, exactly 12 IDs FR07-TC01 through FR07-TC12, and exactly 12 IDs FR12-TC01 through FR12-TC12. For each case include: source requirement, UI or API layer, test-design technique or data partition, objective and external-data intent, expected result derived from the requirement, assertion pattern, Chromium/Firefox/WebKit applicability, and mutation/cleanup note. Plan separate JSON data files tests/data/fr01-registration.json, tests/data/fr07-cart.json, and tests/data/fr12-access-control.json; never propose inline test-case arrays or objects in spec files. Ensure at least three distinct assertion patterns within each feature. Mark implementation discrepancies only as test targets, never as confirmed defects. Mark unsupported expectations as EVIDENCE MISSING instead of inventing them. For FR-12 distinguish authentication from authorization, include ordinary-user and admin-token coverage, and mark data-mutating checks for controlled backup/restore or cleanup. Add concise sections for evidence hierarchy, execution policy, and requirement coverage. Do not claim tests were executed or passed. Do not run servers, tests, package installation, Git commands, or commits. If the target file already exists, do not overwrite it and report that fact.
````

## Exact AI output
````text
Created [docs/hw04-traceability-test-matrix.md](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/docs/hw04-traceability-test-matrix.md).

It contains exactly 36 planned cases:

- 12 × FR01-TC01–FR01-TC12
- 12 × FR07-TC01–FR07-TC12
- 12 × FR12-TC01–FR12-TC12

No other files were modified, and no tests, servers, installations, or Git commands were run.
````

## Human review/action
Tôi đã kiểm tra đủ 36 case và không chấp nhận draft 0003 ở trạng thái hiện tại. Tôi yêu cầu loại suy diễn ảnh sản phẩm khỏi FR07-TC01; đổi FR07-TC03 thành kiểm tra gộp sản phẩm hoàn toàn qua UI; làm oracle badge FR07-TC12 xác định bằng trạng thái ban đầu không có sản phẩm và thêm đúng một đơn vị; bổ sung chính sách 9 feature-browser runs, 9 HTML reports với student ID và ISO timestamp từ execution thật; đồng thời cập nhật coverage FR-12 gồm TC11-TC12. Không thay đổi số lượng 12 case cho mỗi feature và chưa gọi discrepancy nào là defect.


# Interaction 0004

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T01:58:09Z

## Exact prompt

````text
Act as a correction-only editor for docs/hw04-traceability-test-matrix.md. Modify exactly that one file and no other file. Preserve the existing 36-case structure, IDs, evidence hierarchy, and all content not required by these corrections. Apply only these human-reviewed corrections: (1) In FR07-TC01 remove the unsupported requirement that Cart must display product images and remove its FR-24 image-alt mapping; keep the SRS-required cart columns, h1, and currency checks. (2) Change FR07-TC03 to a UI-only same-product test using external data: start with the target product absent, add the same product twice through visible web UI, then assert exactly one cart row for that product, quantity 2, and consistent line/cart totals. Do not use or cross-check backend /api/cart in this case. (3) Make FR07-TC12 deterministic: start with the target product absent and a known initial badge, add exactly one unit through UI, assert visual feedback and badge increment exactly 1; because this case uses a product page/card image, assert any displayed product image has a non-empty descriptive alt. (4) Add execution policy requiring exactly 9 independent feature-browser runs: FR-01, FR-07, FR-12 each on Chromium, Firefox, WebKit; each run must generate its own genuine HTML report displaying exactly Run by: 23127027 and an ISO timestamp generated during execution, with no post-editing. (5) Update requirement coverage so FR-12 includes FR12-TC01 through FR12-TC12 and FR-24 no longer maps FR07-TC01 while retaining the corrected FR07-TC12 mapping. Keep exactly 12 IDs per feature, external JSON data, at least three assertion patterns per feature, C/F/W applicability, EVIDENCE MISSING handling, mutation safety, and no claimed execution or defects. Do not run tests, servers, installations, Git commands, or commits.
````

## Exact AI output
````text
Updated only [docs/hw04-traceability-test-matrix.md](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/docs/hw04-traceability-test-matrix.md).

Applied all five requested corrections and verified the structure remains exactly 36 cases: 12 each for FR-01, FR-07, and FR-12. No tests, servers, installations, or Git commands were run.
````

## Human review/action
Tôi đã so sánh corrected matrix với rejected artifact 0003 và xác nhận Codex chỉ áp dụng các correction đã yêu cầu. Matrix giữ đúng 12 case cho mỗi feature, dùng external JSON, có ít nhất ba assertion patterns cho mỗi feature, áp dụng Chromium/Firefox/WebKit, quy định 9 run và 9 genuine HTML reports với Run by: 23127027 cùng ISO timestamp sinh trong execution. Không có source SUT bị sửa và chưa có pass/fail hoặc defect nào được tuyên bố.


# Interaction 0005

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T07:11:10Z

## Exact prompt

````text
Act as a Playwright infrastructure implementer for HW04 student 23127027. Work only at repository root. You may modify package.json and create exactly these files: playwright.config.ts, tsconfig.json, .env.example, tests/smoke/infrastructure.spec.ts. Do not modify .gitignore, package-lock.json, SUT source, documentation, audit files, or any backend/frontend package. Add package scripts for playwright test, test listing, infrastructure smoke, TypeScript noEmit checking, and opening the default HTML report. Configure exactly three Playwright projects named chromium, firefox, webkit with the matching desktop devices. Use testDir tests, strict deterministic defaults with fullyParallel false, workers 1, retries 0, forbidOnly on CI, and reasonable test/expect timeouts. Use PW_WEB_URL with default http://localhost:5173 as baseURL. Configure list plus HTML reporters. Read PW_REPORT_DIR with default playwright-report for the HTML output folder and never post-edit reports. At config evaluation, generate one new Date().toISOString() value and use it both in config metadata and the visible HTML reporter title. The title must contain the exact text Run by: 23127027 and the ISO timestamp. Metadata must include Run by with value 23127027, ISO timestamp, and PW_RUN_LABEL with a safe local default. Keep screenshots only on failure, traces retained on failure, and video off. The committed .env.example may contain only non-secret PW_WEB_URL, PW_ADMIN_URL, PW_API_URL, PW_REPORT_DIR, and PW_RUN_LABEL examples. Create one infrastructure smoke spec that does not contact the SUT: it must run in all three projects, verify the metadata values and ISO timestamp shape, set simple local page content, and use a web-first assertion to prove the selected browser can execute. Do not add feature tests or test-data arrays. Do not install packages, browsers, run tests, start servers, use Git, or commit. After editing, summarize exactly which allowed files changed.
````

## Exact AI output
````text
Implemented the Playwright infrastructure without running tests, installing packages, starting servers, or using Git.

Changed exactly these allowed files:

- Modified [package.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/package.json)
- Created [playwright.config.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/playwright.config.ts)
- Created [tsconfig.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tsconfig.json)
- Created [.env.example](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/.env.example)
- Created [tests/smoke/infrastructure.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/smoke/infrastructure.spec.ts)

No prohibited files were edited.
````

## Human review/action
Tôi đã review package.json, Playwright config, TypeScript config, environment example và infrastructure smoke spec. Typecheck thành công, test listing có đúng ba browser projects và smoke execution thật pass 3/3. Tôi đã mở HTML report và xác nhận hiển thị Run by: 23127027, ISO timestamp 2026-08-18T07:20:21.847Z cùng kết quả Chromium, Firefox và WebKit. Report này chỉ dùng kiểm chứng infrastructure, không được tính vào chín feature-browser reports cuối và không có source SUT nào bị sửa.


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


# Interaction 0007

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T12:32:41Z

## Exact prompt

````text
Act as a correction-only editor for the rejected FR-01 increment. Modify exactly these four files and no others: tests/data/fr01-registration.json, tests/support/data-loader.ts, tests/pages/registration.page.ts, tests/features/fr01-registration.spec.ts. Preserve logical scope FR01-TC01 through FR01-TC04 and all hard requirement assertions. Apply these human-reviewed fixes only. Add id and title to each of the four top-level external JSON cases, type them, and construct every Playwright test title from those JSON values rather than hardcoding IDs/titles in the spec. Replace getByLabel-based registration and login input locators: source labels are unassociated siblings, so locate each label inside its form using an escaped anchored case-insensitive pattern, move to its containing element, and then locate the corresponding input. Use anchored case-insensitive accessible-name patterns for form submit buttons and headings so capitalization does not make the form locator empty; do not weaken actual required text assertions. Replace the unconditional fill method with a selected-field method whose field list comes from external JSON. TC01, TC02, and TC04 must still clearly assert the required confirmation control; TC03 must fill only the externally configured fields needed to isolate email validity and must not fail first because confirmation is absent. Improve application-error discovery to include visible non-heading siblings immediately before the form as well as semantic alert/live/error candidates, without relying on exact undocumented error wording; placement above submit must still be asserted whenever such an application error exists. Keep data external, collision-safe email generation, no fixed sleeps, no inline test-case arrays/objects, and no test.skip/test.fail/conditional pass. Do not modify SUT source or weaken assertions to match the current implementation. Do not run tests, servers, package commands, Git commands, or commits. Summarize exact corrections.
````

## Exact AI output
````text
Corrected exactly these four files:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json)
  - Added external `id`, `title`, and selected `fieldsToFill` data.
  - Configured TC03 to fill every required non-email-validity control, including confirmation.

- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)
  - Typed case identity and field-selection properties.

- [registration.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/registration.page.ts)
  - Replaced registration/login `getByLabel` locators with anchored, escaped, case-insensitive label-to-container-to-input locators.
  - Added anchored case-insensitive accessible-name patterns for headings and submit buttons.
  - Replaced unconditional filling with externally driven selected-field filling.
  - Expanded application-error discovery to semantic candidates and the visible non-heading sibling immediately preceding the form.

- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts)
  - Builds all four test titles from external JSON `id` and `title`.
  - Uses external field selections.
  - Explicitly asserts the required confirmation control in TC01, TC02, and TC04.
  - Preserves all existing requirement assertions and error-placement checks.

No tests, servers, package commands, Git commands, or commits were run.
````

## Human review/action
Tôi đã đối chiếu correction với prompt và phát hiện email_format_partitions.fieldsToFill vẫn chứa confirmationPassword, nên TC03 chưa cô lập đúng email validity. Tôi yêu cầu bỏ confirmationPassword khỏi riêng field list của TC03, giữ nguyên confirmation assertions ở TC01, TC02 và TC04, không thay đổi requirement assertions hoặc source SUT. Chưa chạy test và chưa có defect claim.


# Interaction 0008

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-18T12:45:38Z

## Exact prompt

````text
Correct only tests/data/fr01-registration.json. In the email_format_partitions object, change fieldsToFill to exactly ["fullName", "email", "password"] so FR01-TC03 isolates email validity without depending on the missing confirmation field. Do not change any other JSON value, case ID, title, variant, assertion, test code, support code, page object, SUT source, or audit file. Do not run tests. Report the exact file and change made.
````

## Exact AI output
````text
Updated [tests/data/fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json): changed `email_format_partitions.fieldsToFill` to exactly `["fullName", "email", "password"]`.

No other values changed. Tests were not run.
````

## Human review/action
Tôi đã kiểm tra toàn bộ execution output và final diff. Codex ban đầu sửa nhầm fieldsToFill của TC01 nhưng đã tự hoàn tác trước khi hoàn thành; final diff chỉ loại confirmationPassword khỏi email_format_partitions.fieldsToFill của TC03. Ba file TypeScript không thay đổi, TC01/TC02/TC04 vẫn giữ confirmation assertions, chưa chạy test, chưa có defect claim và source SUT không bị sửa.


# Interaction 0009

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-18T12:52:15Z

## Exact prompt

````text
Fix only tests/features/fr01-registration.spec.ts. Typecheck showed exactly four errors because Playwright 1.62.1 does not provide expect(locator).toBeRequired(). Replace exactly those four matcher calls with the supported assertion toHaveAttribute("required", ""), preserving each locator, custom assertion message, test ID, title, test flow, and the requirement that the control must be required. Do not change any other assertion or file. Do not modify test data, page objects, support code, SUT source, or audit files. Do not run tests. Report the exact replacements made.
````

## Exact AI output
````text
Updated only [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts).

Exact replacements:

- Lines 29, 67, and 189:
  `expect(registration.confirmationPasswordInput).toBeRequired()`
  → `expect(registration.confirmationPasswordInput).toHaveAttribute("required", "")`

- Line 72:
  `expect(input, \`Required ${field} control must be marked required\`).toBeRequired()`
  → `expect(input, \`Required ${field} control must be marked required\`).toHaveAttribute("required", "")`

No tests were run. No other assertions or files were changed.
````

## Human review/action
Tôi đã review final diff và xác nhận Codex chỉ thay đúng bốn matcher toBeRequired không được Playwright 1.62.1 hỗ trợ bằng toHaveAttribute("required", ""), không làm yếu requirement assertion. FR01 JSON, page object và data loader không thay đổi. Typecheck đã thành công và Playwright liệt kê đúng bốn test FR01-TC01 đến FR01-TC04 trên Chromium. Chưa thực thi browser test, chưa có pass/fail hoặc defect claim và source SUT không bị sửa.


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


# Interaction 0012

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-20T08:53:09.072Z

## Exact prompt

````text
Extend the reviewed Playwright automation with FR-07 increment 1 covering exactly FR07-TC01 through FR07-TC04.

Read and preserve:
- README.md
- api_specification.md
- docs/hw04-traceability-test-matrix.md
- playwright.config.ts
- tests/support/data-loader.ts
- the existing FR-01 automation
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- backend/server.js
- backend/database.js

Create or modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/catalog.page.ts
- tests/pages/cart.page.ts
- tests/support/data-loader.ts

Do not modify FR-01 data, specs, or page objects. Do not modify SUT source, documentation, configuration, packages, evidence, database files, or ai-audit files. Do not run Playwright tests and do not start the SUT. Static JSON parsing and TypeScript typechecking are allowed.

Add exactly four test declarations. IDs and titles must come from external JSON:
- FR07-TC01 populated cart structure, currency, and one descriptive h1.
- FR07-TC02 invalid cart API authentication partitions.
- FR07-TC03 adding the same product twice produces one row with quantity two.
- FR07-TC04 the plus control increments only the selected row and recalculates totals.

Add these exact external JSON keys:
- populated_cart_two_products
- cart_invalid_authentication
- same_product_ui_addition
- quantity_increment

Keep IDs, titles, paths, endpoints, product identities, expected headings, headers, quantities, prices, currency rules, token partitions, request bodies, login credentials, and expected counts in external JSON. Do not add inline case arrays or duplicate case data in the spec.

UI fixture rules:
- The web cart is React in-memory state and is not connected to the backend cart API.
- Build UI cart state only through visible product-card actions on the home page within the current browser context.
- Do not inject React state, use local storage, call private component functions, or use the backend cart API to seed UI cases.
- Scope each product card by its visible product heading, then locate its add-to-cart button inside that card.
- Navigate to the cart through the visible Giỏ hàng navigation link.
- Keep locators semantic and page-object based. Do not use brittle CSS chains, nth-based product selection, arbitrary sleeps, or waitForTimeout.
- Each Playwright test receives a fresh browser context, so UI cart state is isolated without database mutation.

TC01 requirements:
- Seed exactly two distinct products by activating each selected home product card add action once.
- Assert exactly two product rows.
- Assert exactly one descriptive h1 for the cart.
- Assert the required column labels: Sản phẩm, Đơn giá, Số lượng, Thành tiền, and Thao tác.
- Assert each row exposes plus and minus quantity controls.
- Assert displayed unit prices and line totals contain ₫, contain a thousands separator, and numerically match the external product prices and quantities.
- Use expect.soft where useful so independent structural requirements are all evaluated without weakening any assertion.

TC02 requirements:
- Use the Playwright request fixture and an absolute API URL composed from process.env.PW_API_URL ?? "http://localhost:3000" plus endpoints stored in JSON.
- Store exactly three invalid-authentication rows in JSON: missing token, malformed token, and expired token.
- The expired token must be a real JWT fixture signed for the current SUT with an exp value in the past, stored as a token literal in external JSON. Do not expose the signing secret in the spec.
- Obtain a valid baseline token by logging in with the seeded dedicated user credentials from external JSON.
- Snapshot that users cart with authenticated GET /api/cart before the invalid attempts.
- For every invalid-authentication row, exercise both GET /api/cart and POST /api/cart using test.step.
- Assert each invalid request is not successful without inventing an exact status or response wording. Preserve response status and body in assertion diagnostics.
- Use soft assertions for the six rejection responses so all authentication partitions execute.
- Fetch the cart again with the valid token and assert deep equality with the baseline snapshot, proving rejected POST attempts caused no mutation.
- Do not mock or intercept the API.

TC03 requirements:
- Start with a fresh empty UI cart.
- Activate the same home product cards add action exactly twice.
- Open the cart and assert exactly one row for that product, quantity 2, line total equal to twice the external unit price, and cart total equal to the sum of all displayed line totals.
- Do not compensate for or retry failed add actions. The two activations are the tested state transition.
- After asserting row count, use a deterministic row-scoped locator for the remaining assertions without conditionally bypassing them.

TC04 requirements:
- Seed one target product through one visible home product-card add action, then open the cart.
- Capture row count, selected-row quantity, selected-row line total, and cart total before interaction.
- Require a row-scoped button whose accessible name is exactly + as a hard prerequisite.
- Click it once.
- Assert only the selected row quantity changes from n to n+1, its line total changes consistently, total row count is unchanged, and the cart total is recalculated consistently.
- Do not skip, soften, synthesize, or bypass the plus-control requirement if the current SUT does not provide it.

Page-object and calculation rules:
- Use role-based table, row, columnheader, cell, button, link, and heading locators where available.
- Scope cart row locators by external product name.
- Provide helpers that parse displayed currency by removing presentation separators while retaining a numeric comparison.
- Verify a displayed thousands separator without requiring one locale-specific separator character.
- Provide helpers for unit price, quantity, line amount, cart total, and summing displayed line amounts.
- Keep TypeScript strict-compatible and Playwright 1.62.1-compatible.
- Do not use unsupported matchers such as toBeRequired.

Preserve every existing FR01-TC01 through FR01-TC12 declaration and assertion unchanged in intent and strength.
Do not claim pass, failure, or defect because no execution is authorized.

After editing, report:
- exact files changed;
- the four JSON keys and generated test IDs;
- how each UI fixture is built;
- the assertion and state-delta oracle for each case;
- confirmation that no Playwright tests ran and no SUT, database, evidence, configuration, documentation, package, or audit file was modified.
````

## Exact AI output
````text
Implemented FR-07 increment 1 with exactly four test declarations.

Changed files:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

External JSON keys and generated IDs:

- `populated_cart_two_products` → `FR07-TC01`
- `cart_invalid_authentication` → `FR07-TC02`
- `same_product_ui_addition` → `FR07-TC03`
- `quantity_increment` → `FR07-TC04`

Fixture construction and oracles:

- TC01: clicks two distinct heading-scoped home product cards once each, then uses the visible cart link. Verifies two rows, one descriptive `h1`, required headers, row-scoped `+`/`-` controls, quantities, unit prices, line totals, `₫`, and locale-independent thousands separators.
- TC02: logs in as the external seeded user, snapshots authenticated `/api/cart`, exercises GET and POST for missing, malformed, and genuinely expired JWT partitions, records status/body diagnostics, and deep-compares the final authenticated cart with the baseline.
- TC03: clicks the same heading-scoped product card exactly twice from a fresh context. Verifies one product row, quantity two, doubled line amount, and cart total equal to all displayed line amounts.
- TC04: adds one target product once, requires an exact row-scoped `+` button, captures pre-interaction row/quantity/line/total state, clicks once, and verifies the `n → n+1` quantity and corresponding line/sum/cart-total deltas without changing row count.

Static validation completed successfully:

- JSON parsing and structural checks
- Expired JWT signature/expiry verification
- Strict TypeScript typechecking
- Exactly four FR-07 test declarations
- No FR-01 diff

No Playwright tests ran and no SUT was started. No SUT, database, evidence, configuration, documentation, package, or audit file was modified. The two pre-existing untracked `ai-audit` files remained untouched. No pass, failure, or defect result is claimed.
````

## Human review/action
Tôi đã review toàn bộ năm file automation và xác nhận FR-07 increment 1 bổ sung đúng FR07-TC01 đến FR07-TC04. ID, title, product fixture, authentication partitions, paths, labels, prices, quantities và expected counts đều lấy từ external JSON. TC01 tạo cart qua hai product card riêng biệt và giữ đầy đủ structure, h1, column, quantity-control cùng currency assertions. TC02 dùng login token hợp lệ để snapshot cart, thực hiện đủ missing, malformed và JWT đã ký nhưng hết hạn qua cả GET và POST, sau đó so sánh cart trước/sau mà không suy diễn status hoặc wording. TC03 kích hoạt cùng product card đúng hai lần, không retry hoặc bù hành vi. TC04 giữ nút + row-scoped làm hard prerequisite trước state-delta assertions. FR01-TC01 đến FR01-TC12 không thay đổi. Typecheck thành công và Playwright liệt kê đúng bốn test FR07-TC01 đến FR07-TC04 trên Chromium. Chưa thực thi browser/API test, chưa có pass/fail hoặc defect claim và source SUT không bị sửa.


# Interaction 0013

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-20T09:49:04.512Z

## Exact prompt

````text
Correct only tests/features/fr07-cart.spec.ts after the first FR-07 increment 1 Chromium development run.

Do not modify JSON data, page objects, support code, FR-01 automation, SUT source, database, evidence, configuration, documentation, packages, or ai-audit files. Do not run Playwright tests and do not start or stop the SUT. TypeScript typechecking is allowed.

Make exactly these two corrections:

1. FR07-TC01 accumulated multiple independent soft missing-locator assertions and reached the default 30-second test timeout before every soft assertion finished. Add test.slow() inside FR07-TC01 so Playwright provides the standard extended test budget. Preserve every existing soft assertion, locator, expected count, ID, title, fixture action, and requirement oracle. Do not reduce assertion timeouts, remove assertions, convert failures to warnings, or otherwise weaken the test.

2. FR07-TC04 used an immediate locator.count() followed by a synchronous expect and observed zero rows even though the failure DOM snapshot already contained the seeded AirPods row. Replace the initial row-count check with a web-first await expect(cart.dataRows()).toHaveCount(testCase.expected.counts.rows), then capture beforeRowCount from the same locator for the later unchanged-row-count comparison. Preserve the product-row assertion, exact row-scoped plus-button hard prerequisite, quantities, prices, line totals, cart-total assertions, and every post-click state-delta oracle.

Do not change any other line or file. Do not claim a pass, failure, or defect because no corrected execution is authorized in this interaction.

After editing, report the exact file changed, the exact two corrections, confirmation that all four FR07 test declarations and all existing assertions remain, and confirmation that no Playwright test or SUT was run.
````

## Exact AI output
````text
Changed only [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts).

- FR07-TC01: added `test.slow()` inside the test.
- FR07-TC04: added a shared `dataRows` locator, awaited `toHaveCount(...)`, then captured `beforeRowCount` from that locator.

All four FR07 test declarations and all existing assertions remain. TypeScript typechecking completed without diagnostics. No Playwright test was run, and the SUT was neither started nor stopped.
````

## Human review/action
Tôi đã review final diff và xác nhận Codex chỉ sửa tests/features/fr07-cart.spec.ts tại đúng hai điểm. FR07-TC01 thêm test.slow để toàn bộ independent soft assertions có đủ test budget mà không giảm timeout hoặc làm yếu oracle. FR07-TC04 thay immediate count bằng web-first toHaveCount trước khi ghi nhận beforeRowCount, khắc phục timing issue đã được failure DOM chứng minh trong khi giữ nguyên hard prerequisite nút + và toàn bộ state-delta assertions. Cả bốn FR07 test declarations và các assertion hiện có vẫn được giữ nguyên. Typecheck thành công, chưa rerun Playwright, chưa có kết quả corrected run hoặc defect claim mới và source SUT không bị sửa.


# Interaction 0014

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol). The initial Codex CLI 0.147.0 attempt was aborted by a model-cache incompatibility; the user authorized updating the CLI before the successful final execution.

## ISO date/time

2026-08-20T10:49:08Z

## Exact prompt

```text
Extend the existing reviewed FR-07 Playwright automation with increment 2 covering exactly FR07-TC05 through FR07-TC08.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- playwright.config.ts
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/support/data-loader.ts

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Do not modify SUT source, FR-01 automation, documentation, configuration, package files, evidence, database files, or ai-audit files. Do not run Playwright tests.

Add exactly four test declarations whose IDs and titles come from external JSON:
- FR07-TC05: decrement quantity from 2 to 1 and recalculate totals.
- FR07-TC06: dangerous delete action is red and opens confirmation before removal.
- FR07-TC07: cancelling deletion preserves the complete cart state.
- FR07-TC08: confirming deletion removes only the selected row and updates total and cart badge.

Add these exact external JSON keys:
- quantity_decrement_above_minimum
- deletable_item
- deletion_cancel
- deletion_confirm

General rules:
1. Keep IDs, titles, paths, product identities, prices, quantities, labels, action semantics, expected counts, expected totals, and fixture values in external JSON. Do not add inline test-case arrays or duplicate case data in the spec.
2. Build all UI cart fixtures through visible user interactions in a fresh Playwright context. Do not mutate React internals, inject cart state, call implementation functions, mock cart behavior, or modify the SUT.
3. Preserve FR07-TC01 through FR07-TC04 unchanged in intent and assertion strength, including the reviewed interaction-0013 stabilization.
4. Preserve FR01-TC01 through FR01-TC12 unchanged.
5. Keep locators page- and row-scoped. Prefer accessible roles and names. Avoid brittle CSS chains, positional selectors when semantic scoping is available, and implementation-only selectors.
6. Do not use waitForTimeout, arbitrary sleeps, test.skip, test.fixme, retries, compensating duplicate clicks, conditional requirement bypasses, or unsupported Playwright matchers.
7. Exact dialog, cancel, confirmation, toast, and success wording is EVIDENCE MISSING. Do not assert invented exact wording.
8. Use web-first assertions before reading numeric or geometric state.
9. Do not change the SUT to make tests pass and do not claim pass/fail or a defect because no execution is authorized in this interaction.

TC05 — quantity_decrement_above_minimum:
- Construct a two-product cart so “only the selected row changes” is observable.
- For the target product, use its visible Product Detail quantity control to enter 2 and activate Add to cart exactly once.
- Do not double-click, retry, or compensate if the current SUT ignores the activation.
- Add one distinct comparison product once through the visible UI.
- Navigate through the visible cart link.
- Hard prerequisites must establish exactly two rows, exactly one target row at quantity 2, exactly one comparison row at quantity 1, and exactly one row-scoped `-` control for the target.
- Capture row count, both quantities, both line amounts, and displayed cart total only after web-first prerequisites.
- Click the target row’s `-` exactly once.
- Assert row count is unchanged; target quantity changes 2 to 1; target line amount decreases by one target unit price; comparison quantity and line amount are unchanged; cart total decreases by one target unit price and equals the sum of displayed line amounts.
- Do not infer behavior at quantity 1.

TC06 — deletable_item:
- Add exactly one externally defined product once through the visible Home UI and open the cart.
- Hard prerequisites must establish the target row and its row-scoped delete action.
- Assess the computed dangerous-action color semantically as red without asserting an exact shade.
- Capture row count, target quantity, target line amount, and cart total.
- Activate Delete exactly once without confirming.
- Require a visible accessible confirmation dialog before deletion.
- While the dialog awaits a decision, assert the target row and captured cart state remain unchanged.
- Close or cancel the dialog after assertions so this case intentionally performs no deletion.

TC07 — deletion_cancel:
- Add exactly one externally defined product once through the visible Home UI and open the cart.
- Capture the complete baseline: row count, target row, quantity, line amount, displayed cart total, and sum of displayed line amounts.
- Open the accessible confirmation dialog through the target row’s delete action.
- Locate the semantic cancel/dismiss action supplied by the dialog without asserting one invented exact label. Keep any locator vocabulary or action semantics in external JSON.
- Activate cancel/dismiss once.
- Assert the dialog closes and the complete captured cart state is unchanged.

TC08 — deletion_confirm:
- Add two distinct externally defined products once each through the visible Home UI and open the cart.
- Capture both row states, deleted-row line amount, remaining-row state, row count, and displayed cart total.
- Open the accessible confirmation dialog from the selected row.
- Locate the semantic confirm/destructive action without asserting invented exact dialog wording. Keep locator vocabulary or action semantics in external JSON.
- Confirm exactly once.
- Assert the dialog closes, only the selected row disappears, the other row quantity and line amount remain unchanged, row count decreases by one, displayed cart total decreases by the deleted line amount, and the resulting total equals the sum of remaining displayed line amounts.
- Assert the cart navbar badge is visible and reflects the externally defined remaining cart count. Do not invent a badge or silently skip this requirement if the current SUT lacks one.

Page Object expectations:
- Reuse current CartPage and CatalogPage behavior where appropriate.
- Add a ProductDetailPage only if needed for TC05’s visible quantity fixture.
- Add robust helpers for a row-scoped delete action, accessible confirmation dialog, semantic cancel/confirm actions, dangerous red-color assessment, cart badge lookup/parsing, and stable cart-state reads.
- Keep product-detail quantity and Add controls scoped to the displayed product view.
- Prefer Playwright web-first assertions in the spec; Page Object methods may read values only after those prerequisites.

Keep TypeScript strict-compatible and Playwright 1.62.1-compatible. The final FR07 spec must contain exactly eight FR07 test declarations total.

After editing, report:
- exact files changed;
- the four added JSON keys and generated IDs;
- the TC05 two-product fixture and state-delta oracle;
- the TC06 dialog-before-delete oracle;
- the TC07 cancel/no-mutation oracle;
- the TC08 confirmed-delete, total, and badge oracle;
- static validation performed;
- confirmation that no tests were run and no SUT, FR-01, audit, evidence, database, configuration, documentation, or package file was modified.

```

## Exact AI output

```text
Implemented FR-07 increment 2 with exactly eight total FR-07 test declarations.

Changed automation files:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [product-detail.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/product-detail.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

Added JSON records:

- `quantity_decrement_above_minimum` → `FR07-TC05`
- `deletable_item` → `FR07-TC06`
- `deletion_cancel` → `FR07-TC07`
- `deletion_confirm` → `FR07-TC08`

Oracles implemented:

- TC05: AirPods quantity 2 plus one Keychron comparison row; verifies rows remain 2, AirPods quantity `2 → 1`, line amount `12,000,000 → 6,000,000`, Keychron remains quantity 1/`4,000,000`, and total `16,000,000 → 10,000,000`.
- TC06: verifies the iPhone delete action is semantically red, deletion does not happen before an accessible confirmation dialog appears, and the full `30,000,000` cart state remains unchanged while awaiting—and after dismissing—the dialog.
- TC07: captures the complete one-row Samsung baseline and verifies dialog cancellation preserves row count, identity, quantity, line amount, line sum, and `28,000,000` total.
- TC08: deletes only AirPods from an AirPods/Keychron cart, verifies rows `2 → 1`, total `10,000,000 → 4,000,000`, unchanged Keychron state, remaining-line sum consistency, and a visible cart badge count of `1`.

Static validation completed:

- `npm run typecheck` passed.
- JSON parsing and fixture arithmetic invariants passed.
- Confirmed exactly eight FR-07 declarations and one declaration for each new JSON-driven case.
- Confirmed TC01–TC04 implementation body remains byte-for-byte unchanged.
- `git diff --check` passed.
- Forbidden-pattern scan found no sleeps, skips, fixmes, retries, duplicate-click helpers, storage injection, or React cart-internal access.

No Playwright tests were run, and no execution result or SUT defect is claimed. No SUT, FR-01, audit, evidence, database, configuration, documentation, or package file was modified. The two already-untracked `ai-audit` files present at the start were left untouched.
```

## Human review/action

Từ chối output 0014. Human action: Tôi đã review increment 2 và phát hiện TC05-TC08 dùng exact label “Tổng cộng” để định vị cart total trước target action. Điều này khiến TC06-TC08 có thể bị chặn bởi requirement của FR07-TC10 trước khi dialog/delete oracles được thực thi, nên các case chưa được cô lập đúng. TC05 vẫn phải giữ visible quantity fixture và đúng một Add click, không được bù hành vi nếu fixture thất bại. Cần lưu output hiện tại làm rejected artifact và sửa locator cart summary để không khẳng định exact label; FR07-TC10 sẽ giữ exact-label oracle. Chưa chạy Playwright và SUT không bị sửa.


# Interaction 0015

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T11:20:40Z

## Exact prompt

```text
Correct the rejected FR-07 increment 2 proposal for exactly FR07-TC05 through FR07-TC08.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- playwright.config.ts
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- ai-audit/prompts/0014-fr07-cart-controls-delete.txt
- ai-audit/artifacts/0014-rejected-fr07-increment2/fr07-cart.json
- ai-audit/artifacts/0014-rejected-fr07-increment2/fr07-cart.spec.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/cart.page.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/catalog.page.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/product-detail.page.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/data-loader.ts
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

The 0014 proposal was rejected because TC05-TC08 used the exact required label "Tổng cộng" to locate the displayed cart total before their target actions. That exact-label requirement belongs to FR07-TC10. On a SUT using another label, TC06-TC08 would stop before exercising their dialog, cancel, confirm, and badge oracles.

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Do not modify SUT source, FR-01 automation, documentation, configuration, package files, database, evidence, or ai-audit files. Do not run browser or API tests.

Correction requirements:

1. Preserve exactly eight FR07 test declarations total and exactly one declaration for each FR07-TC05 through FR07-TC08. Keep IDs, titles, fixtures, prices, quantities, expected numeric totals, expected row counts, dialog action vocabulary, and badge counts in external JSON.

2. Preserve FR07-TC01 through FR07-TC04 unchanged in intent and assertion strength.

3. TC05-TC08 must read and compare the displayed cart summary amount without asserting or requiring an exact summary label. Do not use expected.totalLabel, "Tổng cộng", or "Tổng tạm tính" as the prerequisite locator for these four tests.

4. Keep the summary locator scoped to the cart view and distinguish the summary amount from table line amounts. Avoid brittle CSS chains and arbitrary positional selectors. Prefer web-first assertions before Page Object value reads.

5. Do not encode "Tổng tạm tính" as accepted expected behavior. FR07-TC10 will independently assert that the exact required label is "Tổng cộng".

6. TC05 must keep its visible Product Detail quantity fixture, quantity 2, and exactly one Add-to-cart activation. Do not retry, double-click, compensate, inject storage, or access React internals. If that visible fixture does not create the required cart state, its decrement action and later assertions must remain EVIDENCE NOT REACHED rather than being bypassed.

7. TC05 must retain the two-product fixture and hard prerequisites, then require the row-scoped minus control and verify only the target changes from quantity 2 to 1, its line amount halves, the comparison row remains unchanged, row count remains unchanged, and displayed cart total equals the remaining line sum and expected numeric delta.

8. TC06 must retain the red dangerous-action assessment and require an accessible dialog before deletion. The selected row and complete numeric cart state must remain unchanged while the dialog awaits a decision and after dismissing it.

9. TC07 must retain semantic cancel/dismiss discovery and verify the dialog closes while row identity, quantity, line amount, line sum, and displayed cart total remain unchanged.

10. TC08 must retain semantic confirm discovery and verify only the selected row disappears after confirmation, the comparison row remains unchanged, displayed cart total equals the remaining line sum and expected numeric total, and the visible cart badge has the expected count.

11. Keep row-scoped controls, accessible dialog roles, semantic dialog actions, dangerous red-color assessment, cart badge behavior, and stable state reads in Page Objects. Keep TypeScript strict-compatible and Playwright 1.62.1-compatible.

12. Do not use waitForTimeout, arbitrary sleeps, test.skip, test.fixme, conditional requirement bypasses, retries that compensate for SUT behavior, getByLabel for unlabeled DOM, exact dialog wording, unsupported matchers, or direct SUT-state injection.

Perform static validation only:
- parse the JSON and verify fixture arithmetic;
- run npm run typecheck;
- list the four increment-2 tests without executing them;
- confirm exactly eight FR07 declarations;
- confirm forbidden patterns are absent;
- confirm no SUT, FR-01, audit, evidence, database, configuration, documentation, or package file changed.

After editing, report:
- exact automation files changed relative to the current rejected proposal;
- how the cart summary amount is located without asserting its label;
- confirmation that TC05 still performs exactly one visible Add activation;
- the retained TC05-TC08 oracles;
- static validation performed;
- confirmation that no tests were run and no prohibited file was modified.

```

## Exact AI output

```text
Corrected the rejected FR-07 increment 2 proposal.

Changed relative to the 0014 artifact:

- [tests/data/fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json:182)
- [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts:452)
- [tests/pages/cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts:334)
- [tests/support/data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:359)

`catalog.page.ts` and `product-detail.page.ts` remain byte-identical to the rejected proposal.

The summary amount is now located inside the cart’s semantic `main` view, using a currency-only displayed value explicitly excluded from table descendants. Thus line amounts cannot satisfy the locator, and TC05–TC08 do not reference `expected.totalLabel`, `Tổng cộng`, or `Tổng tạm tính`. Web-first visibility and amount assertions precede numeric Page Object reads.

Retained behavior:

- TC05 performs exactly one visible Product Detail Add activation. Its two-row, target-quantity-2, comparison-quantity-1, and row-scoped-minus prerequisites remain hard failures. It verifies target quantity/line halving, unchanged comparison row, unchanged row count, line-sum consistency, expected total, and numeric delta.
- TC06 assesses the delete action as semantically red, requires an accessible dialog, and preserves the complete numeric state while awaiting a decision and after dismissal.
- TC07 discovers cancel/dismiss semantically and verifies dialog closure plus unchanged row identity, quantity, line amount, line sum, and total.
- TC08 discovers confirmation semantically, verifies only the selected row disappears, preserves the comparison row, checks the expected total and remaining line sum, and verifies the visible badge count.

Static validation passed:

- JSON parsed and TC05–TC08 fixture arithmetic/counts validated.
- `npm run typecheck` passed.
- Playwright `--list` reported exactly TC05–TC08 without executing them.
- Exactly eight FR07 test declarations remain.
- Forbidden-pattern scan passed.
- FR07-TC01–TC04 remain unchanged relative to 0014.
- Scope comparison found no new SUT, FR-01, audit, evidence, database, configuration, documentation, or package changes.

No browser or API tests were run.
```

## Human review/action

Chấp nhận output 0015. Human action: Tôi đã review correction và xác nhận FR07-TC05 đến FR07-TC08 không còn dùng exact label “Tổng cộng” hoặc “Tổng tạm tính” để định vị cart total. Summary amount được tìm trong semantic main của cart bằng currency-only regex được neo toàn chuỗi và loại mọi table descendant, nên line amount không thể thỏa locator; exact-label oracle vẫn dành riêng cho FR07-TC10. TC05 giữ đúng một visible Product Detail Add activation cùng các hard fixture prerequisites, không retry hoặc bù hành vi. TC06 giữ red-action và dialog-before-delete oracle; TC07 giữ cancel/no-mutation oracle; TC08 giữ confirmed-delete, total, remaining-row và badge oracle. FR07-TC01 đến FR07-TC04 không bị làm yếu. External JSON có đúng bốn key FR07-TC05 đến FR07-TC08 và không chứa total-label dependency. Typecheck thành công, Playwright chỉ liệt kê đúng 8 FR07 test, forbidden-pattern và whitespace scans đều sạch. Chưa chạy browser/API test và không sửa SUT, FR-01, database, evidence, configuration, documentation hoặc package files.

# Interaction 0016

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T12:26:45Z

## Exact prompt

```text
Complete the reviewed FR-07 Playwright automation with increment 3 covering exactly FR07-TC09 through FR07-TC12.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- playwright.config.ts
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Implement exactly these external JSON records and generated test IDs:
- cart_navigation -> FR07-TC09
- cart_total_formatting -> FR07-TC10
- empty_cart -> FR07-TC11
- product_detail_add_to_cart -> FR07-TC12

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

General constraints:
- The final FR07 spec must contain exactly twelve FR07 test declarations.
- Preserve FR07-TC01 through FR07-TC08 without weakening or removing their assertions.
- Do not modify existing TC01-TC08 test bodies unless a strictly backward-compatible shared-helper adjustment is unavoidable.
- Keep IDs, titles, paths, product fixtures, labels, expected counts, currency rules, initial states, and expected state deltas in external JSON.
- Use only the visible UI for UI fixture construction and target interactions.
- Do not inject localStorage/sessionStorage, access React internals, mock the SUT, compensate for failed clicks, retry target actions, or add arbitrary waits.
- Prefer accessible locators and Playwright web-first assertions.
- Page Object value reads may occur only after suitable web-first existence/visibility/count prerequisites.
- Keep independent requirement observations reachable with soft assertions or guarded reads where one missing feature would otherwise block unrelated evidence.
- Do not invent exact wording, exact URLs, CSS classes, colors, separator characters, or feedback text where the matrix says EVIDENCE MISSING.
- Do not modify SUT source, FR-01 automation, audit files, evidence, database, configuration, documentation, or package files.

FR07-TC09:
- Build the cart_navigation fixture deterministically through the visible web UI.
- Verify the cart page is represented as a child page by a semantic breadcrumb.
- Verify the cart navbar entry exposes a programmatic current-page state, such as aria-current; do not infer current state from an unspecified CSS class.
- Independently assert the required visible “Tiếp tục mua sắm” label from external JSON.
- Because a label mismatch must not prevent the navigation oracle, identify the cart page’s semantic home-destination shopping link separately and activate it exactly once.
- Verify the resulting page is the Home page by externally defined destination identity, not by inventing an exact URL.
- Keep breadcrumb, current-state, required-label, and destination observations independently reachable.

FR07-TC10:
- Build cart_total_formatting deterministically through the visible UI with a displayed amount that requires a thousands separator.
- This is the only increment-3 case that owns the exact total-label oracle.
- Assert the summary label is exactly “Tổng cộng” and that “Tổng tạm tính” is not accepted.
- Assert the displayed total contains ₫, contains a thousands separator without inventing its locale-specific character, and numerically equals the sum of displayed line amounts.
- Keep the exact-label assertions and independent currency/arithmetic assertions reachable.
- Do not change the label-independent cart-summary helper used by FR07-TC05 through FR07-TC08; add a separate exact-label helper if needed.

FR07-TC11:
- Use the natural fresh-context empty cart; do not delete or mutate an uncontrolled user cart.
- Assert a clear non-empty empty-cart message using semantic structure and requirement-derived meaning without inventing exact wording.
- Assert a non-empty icon or illustration through semantic image evidence such as an img with meaningful alt, an accessible role=img, or an equivalently accessible illustration.
- Assert that no populated cart product row is shown.
- Keep message, illustration, and no-row assertions independently reachable.

FR07-TC12:
- Start in a fresh context with the target product absent and the externally defined known badge count.
- Navigate to the target Product Detail through the visible web UI.
- Verify every displayed target product image has a non-empty descriptive alt, including product identity where appropriate.
- Locate the visible cart badge semantically in or associated with the Giỏ hàng navigation entry.
- Missing badge evidence must fail its own assertion but must not block the independent image-alt, single Add activation, and feedback observations.
- Activate the visible Product Detail Add control exactly once. Never retry or compensate if the SUT ignores that activation.
- Assert deterministic visible add-to-cart feedback without inventing exact feedback wording; a visible semantic notification or a visible control-state/text transition is acceptable.
- If a badge is available, verify its numeric value changes from the external initial value by exactly one. Guard numeric reads so a missing badge remains a recorded failure rather than causing unrelated evidence to be skipped.
- Do not claim cart mutation unless it is externally observed.

Page Object expectations:
- Reuse CartPage, CatalogPage, and ProductDetailPage.
- Add robust helpers only where needed for semantic breadcrumb/current navigation state, the exact TC10 total label, empty-state message/illustration, Home destination identity, product image alt, visual feedback, and cart badge lookup/parsing.
- Keep exact-label and label-independent total helpers separate.
- Keep helpers generic and strict TypeScript-compatible.
- Remain compatible with Playwright 1.62.1.

Static validation only:
- Parse and validate the external JSON.
- Run npm run typecheck.
- List the four new tests with Playwright --list without executing them.
- Confirm exactly twelve FR07 declarations.
- Confirm FR07-TC01 through FR07-TC08 remain present and are not weakened.
- Confirm TC12 contains exactly one visible Add activation.
- Scan for forbidden patterns including waitForTimeout, test.skip, test.fixme, retries, duplicate-click helpers, storage injection, and React-internal access.
- Run whitespace checks on authored automation files.
- Confirm no SUT, FR-01, audit, evidence, database, configuration, documentation, or package file changed.

After editing, report:
- exact automation files changed;
- the four added JSON keys and generated IDs;
- the TC09 breadcrumb/current-state/required-label/navigation oracles;
- the TC10 exact-label/currency/arithmetic oracles;
- the TC11 message/illustration/no-row oracles;
- the TC12 image-alt/single-Add/feedback/badge-delta oracles and evidence guards;
- static validation performed;
- confirmation that no browser/API tests ran and no prohibited file was modified.
```

## Exact AI output

```text
Implemented FR-07 increment 3 with exactly FR07-TC09 through FR07-TC12.

### Files changed

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [product-detail.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/product-detail.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

### Added records and generated IDs

- `cart_navigation` → `FR07-TC09`
- `cart_total_formatting` → `FR07-TC10`
- `empty_cart` → `FR07-TC11`
- `product_detail_add_to_cart` → `FR07-TC12`

### Oracles

- TC09: named semantic breadcrumb containing the current cart page; navbar `aria-current="page"`; independent exact `Tiếp tục mua sắm` assertion; separate meaning-based shopping link activated once; Home identified by its external heading rather than URL.
- TC10: exact `Tổng cộng` label and explicit rejection of `Tổng tạm tính`; `₫`; locale-agnostic thousands-separator detection; displayed total equals the external expected value and sum of displayed line amounts.
- TC11: natural fresh-context cart; meaningful semantic empty message; accessible named illustration; zero populated product rows.
- TC12: every visible target image has non-empty alt containing product identity; guarded semantic badge reads; exactly one visible Product Detail Add activation; semantic notification or control transition feedback; available badge must equal external initial count plus one. Missing badge evidence remains a soft failure and does not block other observations.

### Static validation

- Parsed and validated exactly 12 unique JSON records and sequential IDs `FR07-TC01`–`FR07-TC12`.
- `npm run typecheck` passed.
- Playwright `--list` returned exactly the four new Chromium tests.
- Confirmed exactly 12 FR-07 test declarations.
- TC01–TC08 bodies are unchanged; the diff contains additions only.
- Confirmed TC12 has one `addToCartOnce` call, whose helper contains one click.
- Forbidden-pattern scan found no matches.
- `git diff --check` passed.
- Tracked changes are limited to the six allowed automation files.

No browser or API tests were executed. No SUT, FR-01, audit, evidence, database, configuration, documentation, or package file was modified. The three pre-existing untracked `ai-audit` files were left untouched.
```

## Human review/action

Từ chối output 0016. Human action: Tôi đã review toàn bộ diff FR-07 increment 3 và phát hiện TC12 chưa sử dụng targetProduct.quantity nên chưa chứng minh Add đúng một đơn vị. visualAddFeedback có thể chấp nhận alert hoặc status tồn tại trước thao tác nên thiếu before/after feedback delta. semanticCartBadge tìm số trong toàn bộ parent navigation nên chưa chứng minh số đó thực sự thuộc hoặc được liên kết với Giỏ hàng. Ngoài ra TC09 và TC12 lặp soft count/visibility trên locator bị thiếu, có nguy cơ hết test budget trước khi hoàn thành các oracle độc lập. Cần lưu proposal hiện tại làm rejected artifact và sửa bằng visible quantity prerequisite, feedback state transition, badge association chặt chẽ, cùng guarded visibility hoặc test.slow phù hợp. Chưa chạy Playwright browser/API test và SUT không bị sửa.

# Interaction 0017

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T13:13:05Z

## Exact prompt

```text
Correct the rejected FR-07 increment 3 proposal for exactly FR07-TC09 through FR07-TC12.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- playwright.config.ts
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- ai-audit/prompts/0016-complete-fr07-cart.txt
- ai-audit/outputs/0016-complete-fr07-cart.md
- ai-audit/entries/0016-complete-fr07-cart.md
- ai-audit/artifacts/0016-rejected-fr07-increment3/fr07-cart.json
- ai-audit/artifacts/0016-rejected-fr07-increment3/fr07-cart.spec.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/cart.page.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/catalog.page.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/product-detail.page.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/data-loader.ts
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

The 0016 proposal was rejected for these specific reasons:
1. TC12 declares targetProduct.quantity but never uses it, so it does not prove that exactly one unit is submitted.
2. visualAddFeedback accepts any existing alert or status and lacks a before/after feedback delta.
3. semanticCartBadge searches the whole parent navigation, so an unrelated numeric element can be mistaken for the cart badge.
4. TC09 and TC12 repeat soft count and visibility waits for missing locators, risking exhaustion of the test budget before independent evidence completes.

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Required corrections:

TC12 visible quantity:
- Use targetProduct.quantity from external JSON.
- Scope the quantity control to the displayed target Product Detail.
- Establish a web-first visible quantity-control prerequisite.
- Set or verify the visible quantity as exactly the external value 1, then assert its displayed value before Add.
- Activate the visible Product Detail Add control exactly once.
- Do not retry, compensate, or perform a second Add if the SUT ignores the first activation.

TC12 feedback transition:
- Capture a pre-action feedback baseline before clicking Add.
- A pre-existing unchanged alert, status, or unrelated notification must never satisfy the post-action oracle.
- After the one Add activation, require an externally observable transition:
  - a new or changed semantic alert/status associated with the action; or
  - a change in the scoped Add control’s visible text or relevant accessible state such as disabled, aria-disabled, aria-pressed, or aria-busy.
- Compare post-action evidence with the captured baseline.
- Keep feedback wording unspecified because exact wording is EVIDENCE MISSING.
- Missing feedback must remain a failure without preventing independent image-alt or badge evidence.

TC12 cart badge association:
- Do not search all numeric text in the navigation or the unrestricted parent of the cart link.
- A badge may qualify only when it is a numeric descendant of the Giỏ hàng link or is explicitly associated with that link through an accessible relationship such as aria-describedby or aria-labelledby.
- Keep badge parsing strict and guarded.
- Missing initial or updated badge must fail its own soft assertion but must not block quantity, image-alt, Add, or feedback evidence.
- If both badge observations exist, verify the external initial value and exact +1 delta.

TC09 and TC12 evidence budget:
- Avoid unconditional toBeVisible calls after a soft count assertion has already shown that a locator is absent.
- Guard visibility and value reads behind the externally expected count.
- Add test.slow() to TC09 and TC12 because they intentionally collect several independent soft requirement failures.
- Keep breadcrumb, navbar current state, required label, navigation destination, image alt, quantity, feedback, and badge observations independently reachable.

Preservation requirements:
- Keep exactly twelve FR07 test declarations.
- Preserve FR07-TC01 through FR07-TC08 byte-for-byte.
- Preserve the accepted isolation between TC05-TC08 label-independent totals and TC10 exact-label totals.
- Preserve TC10 and TC11 from the rejected proposal unless a correction is strictly necessary.
- Preserve external JSON keys and IDs:
  - cart_navigation -> FR07-TC09
  - cart_total_formatting -> FR07-TC10
  - empty_cart -> FR07-TC11
  - product_detail_add_to_cart -> FR07-TC12
- Do not weaken any oracle.
- Do not add arbitrary waits, retries, skips, fixmes, storage injection, mocking, React-internal access, or duplicate-click helpers.
- Remain strict TypeScript-compatible and Playwright 1.62.1-compatible.
- Do not modify SUT, FR-01, audit, evidence, database, configuration, documentation, or package files.

Static validation only:
- Parse and validate all 12 external JSON records and sequential IDs.
- Run npm run typecheck.
- Use Playwright --list for TC09-TC12 without executing tests.
- Confirm exactly 12 FR07 declarations.
- Confirm TC01-TC08 are byte-identical to the 0016 rejected artifact.
- Confirm TC10-TC11 remain unchanged unless explicitly justified.
- Confirm TC12 consumes targetProduct.quantity and contains exactly one Add activation.
- Confirm the feedback oracle compares before and after states.
- Confirm the badge locator cannot select unrelated numeric navigation content.
- Scan forbidden patterns and run whitespace checks.
- Confirm no prohibited file changed beyond changes already present before this correction.

After editing, report:
- exact automation files changed relative to the 0016 rejected artifact;
- how TC12 proves visible quantity 1 before exactly one Add;
- how feedback before/after transition is established;
- how the badge is semantically associated with Giỏ hàng;
- how TC09/TC12 avoid evidence-budget exhaustion;
- retained TC09-TC12 oracles;
- static validation performed;
- confirmation that no browser/API test ran and no prohibited file was modified.
```

## Exact AI output

```text
Corrected the rejected FR-07 increment 3 proposal.

Changed relative to the 0016 artifact:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [product-detail.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/product-detail.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

`catalog.page.ts` remains byte-identical to the rejected artifact.

Key corrections:

- TC12 scopes the spinbutton to the Product Detail main containing the target product heading. It requires the external `quantityControls: 1`, guards visibility behind that count, and asserts the displayed value equals `String(targetProduct.quantity)`—external value `1`—before Add.
- TC12 calls `addToCartOnce` exactly once; that helper contains exactly one `.click()`. No compensating or repeated Add exists.
- Feedback baseline is captured before Add, including visible target-detail alert/status elements and the exact Add control’s text, disabled state, `aria-disabled`, `aria-pressed`, and `aria-busy`.
- Post-action feedback must differ from that baseline through a new/changed scoped semantic signal or a changed state/text on the same Add control. Unchanged pre-existing feedback cannot pass. The soft post-action observation does not prevent badge evidence.
- Badge lookup now accepts only strict numeric descendants of the `Giỏ hàng` link or strict numeric elements referenced by that link through `aria-describedby`/`aria-labelledby`. The unrestricted parent-navigation search was removed.
- Initial and updated badge count/visibility/parsing are guarded. Both available observations prove the external initial value and exact `+1` delta.
- TC09 and TC12 use `test.slow()`. Visibility and value reads are conditional on externally expected locator counts, avoiding repeated waits for absent elements.

Retained oracles:

- TC09: semantic breadcrumb, navbar current state, exact required label, independent shopping-destination activation, and Home heading identity.
- TC10: exact `Tổng cộng`, rejection of `Tổng tạm tính`, currency symbol, thousands separator, expected total, and displayed arithmetic.
- TC11: natural empty state, meaningful message, accessible illustration, and zero product rows.
- TC12: image alt, visible quantity `1`, one Add, feedback transition, and associated badge delta.

Static validation passed:

- Parsed and validated 12 JSON records with sequential unique IDs `FR07-TC01`–`FR07-TC12`.
- `npm run typecheck`.
- Playwright `--list` returned exactly TC09–TC12 for Chromium.
- Exactly 12 FR07 test declarations.
- TC01–TC08 byte-identical to the rejected artifact.
- TC10–TC11 byte-identical to the rejected artifact.
- Confirmed external quantity consumption, one Add activation, baseline-before-Add ordering, post-action comparison, and restricted badge association.
- Forbidden-pattern scan found no matches.
- `git diff --check` passed.
- Final changed-path set matches the pre-correction baseline; pre-existing audit changes were untouched, and no prohibited file was newly modified.

No browser or API test was executed.
```

## Human review/action

Từ chối output 0017. Human action: Tôi đã review correction diff và xác nhận feedback baseline/delta, badge association, test.slow cùng guarded visibility đã được sửa đúng. Tuy nhiên TC12 vẫn dùng soft assertions cho quantity count, visibility và value rồi thực hiện Add vô điều kiện. Vì vậy quantity chưa phải hard fixture prerequisite và post-Add feedback/badge evidence có thể được thu dưới trạng thái không bảo đảm đúng một đơn vị. Cần lưu proposal 0017 làm rejected artifact và sửa quantity thành hard web-first prerequisite hoặc đặt bằng visible control rồi hard-assert trước đúng một Add activation. Chưa chạy Playwright browser/API test và SUT không bị sửa.

# Interaction 0018

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T13:41:36Z

## Exact prompt

```text
Apply one narrow final correction to the rejected FR-07 increment 3 proposal.

Read:
- docs/hw04-traceability-test-matrix.md
- ai-audit/entries/0017-correct-fr07-cart-increment3.md
- ai-audit/artifacts/0017-rejected-fr07-increment3/fr07-cart.spec.ts
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/product-detail.page.ts

The 0017 proposal correctly fixed:
- TC09 and TC12 evidence budgets with test.slow and guarded reads;
- TC12 feedback before/after transition;
- TC12 semantic cart-badge association;
- TC12 external quantity field/type declarations;
- preservation of TC01-TC08 and TC10-TC11.

The only remaining defect is that TC12 uses soft assertions for the quantity count, visibility, and value, then performs Add even when the one-unit fixture is invalid.

Modify only:
- tests/features/fr07-cart.spec.ts

Required narrow correction:
- In FR07-TC12, make the target Product Detail quantity control a hard web-first fixture prerequisite before the Add action.
- Require exactly the external expected quantity-control count.
- Require the scoped quantity control to be visible.
- Use the existing visible ProductDetailPage quantity interaction to set targetProduct.quantity exactly once, or retain the current value only if it is hard-asserted.
- Hard-assert the displayed value equals String(testCase.targetProduct.quantity) before Add.
- Only after all quantity prerequisites pass, capture the feedback baseline and activate Add.
- Keep exactly one addToCartOnce call and exactly one click inside that helper.
- Never retry or compensate if the Add activation is ignored.

Preservation:
- Keep FR07-TC01 through FR07-TC11 byte-identical to the 0017 rejected artifact.
- Within TC12, keep image-alt, initial badge, feedback baseline/delta, updated badge, test.slow, guarded reads, and all other assertions unchanged.
- Do not modify JSON, Page Objects, data-loader, SUT, FR-01, audit, evidence, database, configuration, documentation, or package files.
- Do not weaken any oracle.
- Do not add waits, retries, skips, fixmes, storage injection, mocks, React-internal access, or duplicate Add actions.
- Keep exactly twelve FR07 test declarations.
- Remain strict TypeScript-compatible and Playwright 1.62.1-compatible.

Static validation only:
- Run npm run typecheck.
- Use Playwright --list for TC09-TC12 without executing tests.
- Confirm the only automation file changed relative to the 0017 rejected artifact is tests/features/fr07-cart.spec.ts.
- Confirm the correction diff is limited to the TC12 quantity prerequisite block.
- Confirm TC01-TC11 are byte-identical to the 0017 artifact.
- Confirm TC12 consumes targetProduct.quantity through a hard visible prerequisite before exactly one Add.
- Confirm feedback baseline remains before Add.
- Confirm forbidden-pattern and whitespace checks pass.

After editing, report:
- the exact file changed;
- the exact hard quantity sequence;
- confirmation that Add remains exactly once;
- preservation checks;
- static validation performed;
- confirmation that no browser/API test ran and no prohibited file changed.
```

## Exact AI output

```text
Corrected exactly one file: [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts:1505).

TC12 now hard-requires this sequence before Add:

1. Exact external `quantityControls` count.
2. Scoped quantity control visibility.
3. Displayed value equal to `String(testCase.targetProduct.quantity)`.

The existing value is retained only after that hard assertion. Feedback baseline capture remains after these prerequisites and before Add.

Confirmed:

- Exactly one TC12 `addToCartOnce` call.
- Its unchanged helper contains exactly one click.
- No retry or compensating Add.
- Exactly 12 FR07 declarations.
- TC01–TC11 are byte-identical to the 0017 artifact.
- The diff is confined to TC12’s quantity prerequisite block.
- All other 0017 automation files are byte-identical to their artifacts.
- Forbidden-pattern scan and `git diff --check` passed.
- `npm run typecheck` passed.
- Playwright `--list` found exactly TC09–TC12 for Chromium.

No browser/API test ran, and no prohibited file was changed.
```

## Human review/action

Chấp nhận output 0018. Human action: Tôi đã review final correction và xác nhận chỉ tests/features/fr07-cart.spec.ts thay đổi so với rejected artifact 0017, tại đúng quantity prerequisite block của FR07-TC12. Quantity control được yêu cầu đúng external count, visible và có displayed value bằng String(targetProduct.quantity) dưới hard web-first assertions trước feedback baseline và đúng một addToCartOnce activation. Feedback before/after transition, semantic badge association, guarded reads, test.slow, image-alt và badge-delta oracles được giữ nguyên. Năm automation file còn lại byte-identical với artifact 0017; FR07-TC01 đến FR07-TC11 không thay đổi. Spec vẫn có đúng 12 FR07 declarations, typecheck thành công, Playwright chỉ liệt kê đúng TC09-TC12, forbidden-pattern và whitespace checks đều sạch. Chưa chạy Playwright browser/API test và không sửa SUT, FR-01, database, evidence, configuration, documentation hoặc package files.
