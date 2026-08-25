# Interaction 0021

## AI tool

Codex CLI 0.148.0

## ISO date/time

2026-08-21T03:28:59Z

## Exact prompt

```text
Implement the second reviewed FR-12 Playwright automation increment covering exactly FR12-TC05 through FR12-TC08.

Read and preserve:
- README.md
- api_specification.md
- docs/hw04-traceability-test-matrix.md
- playwright.config.ts
- backend/database.js
- backend/server.js
- backend/package.json
- tests/data/fr12-access-control.json
- tests/features/fr12-access-control.spec.ts
- tests/pages/admin-access.page.ts
- tests/support/fr12-api.ts
- tests/support/data-loader.ts
- evidence/development/fr12-increment1-chromium/run-record.md
- ai-audit/entries/0020-correct-fr12-access-control-increment1.md

Implement exactly these additional external JSON records and generated IDs:
- admin_route_inventory_invalid_tokens -> FR12-TC05
- admin_route_inventory_user_token -> FR12-TC06
- admin_read_routes_admin_token -> FR12-TC07
- product_mutation_access_matrix -> FR12-TC08

Modify only when necessary:
- tests/data/fr12-access-control.json
- tests/features/fr12-access-control.spec.ts
- tests/support/fr12-api.ts
- tests/support/data-loader.ts

Keep tests/pages/admin-access.page.ts byte-identical to HEAD.

General constraints:
- The final FR12 spec must contain exactly eight FR12 test declarations.
- Preserve FR12-TC01 through FR12-TC04 test bodies byte-for-byte.
- Preserve all accepted TC01-TC04 helpers and oracles.
- Preserve FR01 and FR07 byte-for-byte.
- Keep all cases, IDs, credentials, token partitions, JWT fixture material, claims, paths, methods, payloads, safe IDs, markers, snapshot resources, expected counts, expected state deltas, cleanup marker fields, cleanup routes, and decision-table rows in external JSON.
- API origins use PW_API_URL with fallback http://localhost:3000.
- Do not modify SUT, audit, evidence, database, Playwright configuration, documentation, or package files.
- Do not access SQLite directly.
- Do not inject browser storage, mock the SUT, access React internals, retry target requests, compensate for failed target actions, or add arbitrary waits.
- Do not assert exact denial status codes or response wording where the matrix says EVIDENCE MISSING.
- Keep authentication and authorization observations distinct.
- Prefer independent soft requirement observations after hard fixture prerequisites.
- Use test.slow() where many independent route or matrix observations intentionally run.
- Remain strict TypeScript-compatible and Playwright 1.62.1-compatible.
- Use only Node built-in modules already available to the test project; do not add packages.

FR12-TC05 — invalid-token route inventory:
- Cover every registered/documented /api/admin/* route for exactly two external token classes: malformed and expired.
- Materialize exactly fourteen external probe rows: seven routes for each token class. Do not construct an inline route matrix in the spec.
- The malformed token value must be external.
- Build the expired token deterministically with Node built-in crypto from external JWT header, claims, and source-observed test signing material.
- Hard-validate before probing that the expired fixture:
  - has exactly three JWT segments;
  - uses the external algorithm;
  - has a numeric exp claim earlier than the current time;
  - has a valid signature for the external test signing material.
- This fixture exercises expiry rejection by the observed verifier; do not claim that the SUT normally issues exp-bearing tokens or invent a production expiry contract.
- Send each target probe exactly once with its assigned invalid Bearer token.
- Assert independently that every response is non-success and does not return protected data, without asserting exact status/body.
- Use valid-looking external POST payloads, external non-existing safe IDs, exact token-class-specific mutation markers, pre/post snapshots, and controlled API cleanup in finally.
- Preserve original mutation evidence before cleanup and verify final restoration.
- There must be four controlled POST cleanup markers: import-product and coupon markers for each token class.

FR12-TC06 — ordinary-user token route inventory:
- Acquire the external seeded ordinary-user token through exactly one supported API login.
- Hard-require successful credential authentication and a non-empty token before target probes.
- Establish external role evidence that this fixture is an ordinary user without inventing denial wording.
- Probe each of the same seven Admin routes exactly once with the ordinary-user Bearer token.
- Use valid-looking external POST payloads with exact controlled markers and non-existing safe IDs for mutation-shaped DELETE/PUT routes.
- Assert each route is denied as authorization, protected data is not returned, and controlled state does not change.
- Record all independent route results even if some fail.
- Capture pre/post snapshots using a separate seeded-admin snapshot session.
- Record mutation evidence before cleanup.
- Cleanup only exact controlled product/coupon sentinels via authenticated API in finally, then verify final restoration.
- Never delete an uncontrolled record.

FR12-TC07 — positive admin read authorization:
- Acquire the external seeded-admin token through exactly one supported API login.
- Hard-require successful login, a non-empty token, and external admin-role evidence.
- Exercise only the externally listed read-only Admin routes:
  - GET /api/admin/users
  - GET /api/admin/orders
- Send each read exactly once with the admin Bearer token.
- Assert each request succeeds and returns a protected collection representation without inventing exact status code or complete schema.
- Cross-check externally known seeded user identities where configured.
- Permit an externally configured empty orders collection; do not invent order fixtures.
- Perform no POST, PUT, or DELETE target request and no cleanup mutation.

FR12-TC08 — product mutation access matrix:
- Implement exactly nine external decision-table rows: POST, PUT, and DELETE crossed with missing token, valid ordinary-user token, and valid admin token.
- Acquire ordinary-user and admin tokens through one supported API login each.
- Hard-require both login fixtures, non-empty tokens, and their external role partitions before matrix target actions.
- Hard-require the external category reference through a supported read API before product setup.
- Build all controlled product setup through supported APIs using the admin token. Do not use SQLite.
- Use separate externally defined controlled markers/payloads per decision row so rows cannot mask each other.
- Execute every target matrix row exactly once; no retry or compensation.
- Missing-token rows must be evaluated as authentication denial.
- Ordinary-user rows must be evaluated as authorization denial.
- Admin rows must be evaluated as positive access that reaches business execution.
- For denied POST rows, assert no controlled product appears.
- For denied PUT rows, assert the controlled target remains unchanged.
- For denied DELETE rows, assert the controlled target remains present and unchanged.
- For admin POST, assert the controlled product appears with the external expected fields.
- For admin PUT, assert the controlled target changes to the external expected fields.
- For admin DELETE, assert the controlled target is removed.
- Keep response acceptance/denial and state-delta observations independently reachable where fixture prerequisites exist.
- Record the pre-cleanup matrix state before teardown.
- In finally, discover only exact controlled invariant markers, require strict positive-integer IDs, delete only those controlled products using the configured authenticated cleanup route, and verify the final product collection equals the pre-test baseline.
- Cleanup must also handle unexpected products created or changed by denied rows.
- Never delete or overwrite an uncontrolled product.

JWT/API helper requirements:
- Implement URL-safe base64 and HS256 signing/verification with Node built-in crypto only.
- Keep the signing material and token claims external; never read backend source at runtime.
- Do not log raw tokens or signing material in diagnostics or evidence.
- Generalize authenticated API sessions and target probes without weakening TC04.
- Every target request must make its Authorization partition explicit: absent, invalid Bearer, ordinary-user Bearer, or admin Bearer.
- Snapshot and cleanup helpers must catch transport failures, return guarded diagnostics, and avoid false no-change/no-marker passes when snapshots are unavailable.
- Cleanup discovery must use exact configured field equality and strict IDs.
- Keep all route/matrix collections external, not inline in the spec.

Static validation only:
- Parse and validate all eight FR12 JSON records and sequential unique IDs FR12-TC01 through FR12-TC08.
- Validate TC05 has two token classes, fourteen probe rows, seven unique routes per class, and four cleanup markers.
- Validate TC06 has seven unique route probes and two cleanup markers.
- Validate TC07 has exactly two GET-only routes and no mutation configuration.
- Validate TC08 has exactly nine unique method × token-partition rows and unique controlled markers.
- Run npm run typecheck.
- Use Playwright --list for FR12-TC05 through FR12-TC08 without executing tests.
- Confirm exactly eight FR12 declarations.
- Confirm TC01-TC04 bodies are byte-identical to HEAD.
- Confirm admin-access.page.ts, FR01, and FR07 are byte-identical to HEAD.
- Confirm each login acquisition and each target action occurs exactly once.
- Confirm invalid JWT fixture validation occurs before TC05 probes.
- Confirm TC05/TC06 original mutation evidence precedes finally cleanup.
- Confirm TC08 setup, nine one-shot target actions, pre-cleanup evidence, finally cleanup, and final restoration ordering.
- Confirm no raw token/signing-material logging.
- Scan forbidden patterns and run whitespace checks.
- Confirm no prohibited file changed.

After editing, report:
- exact automation files changed;
- four added JSON keys and IDs;
- TC05 malformed/expired fixture proof and 14-route denial design;
- TC06 ordinary-user seven-route authorization design and cleanup;
- TC07 two positive admin reads;
- TC08 nine-row decision matrix, state deltas, and cleanup;
- evidence guards;
- static validation performed;
- confirmation that no browser/API test ran and no prohibited file changed.
```

## Exact AI output

```text
Implemented the reviewed FR-12 increment for exactly FR12-TC05 through FR12-TC08.

### Changed files

- [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:358)
- [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts:802)
- [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts:273)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:868)

Added external records:

- `admin_route_inventory_invalid_tokens` → `FR12-TC05`
- `admin_route_inventory_user_token` → `FR12-TC06`
- `admin_read_routes_admin_token` → `FR12-TC07`
- `product_mutation_access_matrix` → `FR12-TC08`

### Coverage

- TC05 contains exactly fourteen external probes: all seven Admin routes for malformed and expired Bearer tokens. The deterministic HS256 fixture was statically proven to have three segments, matching algorithm, numeric past `exp`, and a valid signature. Four exact product/coupon cleanup markers restore state without asserting a production expiry contract.
- TC06 performs one ordinary-user login, validates external `user` role evidence, probes all seven Admin routes once, records independent authorization failures and state evidence, then cleans only the two exact sentinels through the seeded-admin API session.
- TC07 performs one admin login and exactly two GET target requests for `/api/admin/users` and `/api/admin/orders`. It verifies collection representations, configured seeded user identities, and permits empty orders.
- TC08 implements exactly nine unique POST/PUT/DELETE × missing/user/admin rows. All setup uses supported APIs with the admin token and a read API category reference. Each target runs once with independent response/state assertions. Final cleanup discovers exact invariant names, accepts only positive integer IDs, removes only controlled products, and verifies the complete pre-test baseline.

Transport, snapshot, cleanup, and final-restoration failures produce guarded diagnostics and cannot become false no-change/no-marker passes. Tokens and signing material are never logged.

### Static validation

Passed:

- JSON parsing and sequential unique `FR12-TC01`–`FR12-TC08` IDs
- TC05: 2 token classes, 14 probes, 7 routes/class, 4 cleanup markers
- TC06: 7 routes and 2 cleanup markers
- TC07: exactly 2 GET-only routes with no mutation/cleanup configuration
- TC08: 9 unique decisions, 9 unique primary markers, 12 unique cleanup invariants
- `npm run typecheck`
- Playwright `--list` for TC05–TC08: four cases across Chromium, Firefox, and WebKit
- Exactly eight FR12 declarations overall
- TC01–TC04 describe block byte-identical to HEAD
- `admin-access.page.ts`, FR01, and FR07 byte-identical to HEAD
- One-shot login/target structure and required evidence/cleanup ordering
- Forbidden-pattern, raw-secret logging, trailing-whitespace, and `git diff --check` scans

No browser or API test was executed. Only the four permitted automation files changed; SUT, configuration, documentation, database, package, audit, evidence, and Admin Page Object files were not modified.
```

## Human review/action

Từ chối output 0021. Human action: Tôi đã review toàn bộ FR-12 increment 2 diff và xác nhận external JSON bổ sung đúng FR12-TC05 đến FR12-TC08; TC05 có đủ 14 malformed/expired-token probes trên bảy Admin routes, TC06 có đủ bảy ordinary-user probes, TC07 chỉ thực hiện hai admin GET reads, và TC08 có đúng chín POST/PUT/DELETE × missing/user/admin target actions với controlled setup, exact-marker cleanup và final baseline verification. Tuy nhiên TC05 và TC06 probe PUT /api/admin/orders/:id/status bằng safe non-existing IDs và chỉ yêu cầu non-success response cùng unchanged snapshots. Nếu authentication/authorization bị bypass, business handler vẫn có thể trả 404 Order not found mà không đổi state; các oracle hiện tại sẽ hiểu nhầm kết quả này là access denial. Cần lưu proposal 0021 làm rejected artifact và sửa order-status probes dùng controlled existing order có business-valid transition, kiểm tra trạng thái không đổi dưới invalid/ordinary-user token, rồi restore controlled state qua authenticated admin API trong finally. Nếu không thể thiết lập fixture hợp lệ thì phải ghi rõ evidence not reached, không được phân loại mọi non-success response là authentication/authorization denial. Chưa chạy Playwright browser/API test và không sửa SUT.
