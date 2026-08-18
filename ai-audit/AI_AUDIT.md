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
