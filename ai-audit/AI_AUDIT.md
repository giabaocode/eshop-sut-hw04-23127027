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
