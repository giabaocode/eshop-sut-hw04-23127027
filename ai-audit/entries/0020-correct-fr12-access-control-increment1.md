# Interaction 0020

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-21T02:52:09Z

## Exact prompt

```text
Correct the rejected FR-12 increment 1 proposal covering exactly FR12-TC01 through FR12-TC04.

Read and preserve:
- README.md
- api_specification.md
- docs/hw04-traceability-test-matrix.md
- playwright.config.ts
- frontend-admin/vite.config.js
- frontend-admin/src/App.jsx
- backend/database.js
- backend/server.js
- ai-audit/prompts/0019-add-fr12-access-control-increment1.txt
- ai-audit/outputs/0019-add-fr12-access-control-increment1.md
- ai-audit/entries/0019-add-fr12-access-control-increment1.md
- ai-audit/artifacts/0019-rejected-fr12-increment1/fr12-access-control.json
- ai-audit/artifacts/0019-rejected-fr12-increment1/fr12-access-control.spec.ts
- ai-audit/artifacts/0019-rejected-fr12-increment1/admin-access.page.ts
- ai-audit/artifacts/0019-rejected-fr12-increment1/fr12-api.ts
- ai-audit/artifacts/0019-rejected-fr12-increment1/data-loader.ts
- tests/data/fr12-access-control.json
- tests/features/fr12-access-control.spec.ts
- tests/pages/admin-access.page.ts
- tests/support/fr12-api.ts
- tests/support/data-loader.ts

The 0019 proposal was rejected for these reasons:
1. TC02 and TC03 use soft login-form/control prerequisites and then call loginOnce unconditionally, so authorization evidence can be collected under an invalid UI fixture or the test can exhaust its timeout.
2. TC01 through TC03 repeat soft count and visibility waits on missing locators without guards.
3. TC04 detects unexpected mutation but does not clean controlled product/coupon sentinels through the API, so a failing access-control implementation can contaminate runtime state.

Modify only when necessary:
- tests/data/fr12-access-control.json
- tests/features/fr12-access-control.spec.ts
- tests/support/fr12-api.ts
- tests/support/data-loader.ts

Keep tests/pages/admin-access.page.ts byte-identical to the 0019 rejected artifact unless an unavoidable backward-compatible correction is required and explicitly justified.

Required UI corrections:

TC01:
- Keep the natural fresh context, direct Admin entry visit, login-boundary observations, protected-content absence, and no-mutation observation.
- Add test.slow() because independent soft evidence is intentionally collected.
- Do not perform unconditional toBeVisible after a soft count assertion has shown that a locator is absent.
- Guard visibility observations behind the externally expected count using immediate guarded reads or an equivalent evidence-budget-safe approach.

TC02 and TC03:
- Add test.slow().
- Before loginOnce, make the externally expected login form, email control, password control, and submit control counts hard web-first fixture prerequisites.
- Hard-require each scoped control to be visible.
- Only after all hard prerequisites pass, call loginOnce exactly once.
- Do not retry or compensate if the single login submission is ignored.
- Keep post-action denial/success observations soft and independently reachable.
- Guard post-action visibility reads behind observed expected counts; do not repeat full web-first waits for already missing locators.
- Preserve TC02 valid-login-response, deterministic dialog handling, login-boundary persistence, protected-content absence, and no-mutation oracles.
- Preserve TC03 successful-login response, protected Admin identity, Dashboard identity, login-form disappearance, and no-mutation oracles.

Required TC04 cleanup correction:
- Preserve the exact seven target route probes, their order-independent denial assertions, missing Authorization configuration, payload markers, safe IDs, protected-data checks, and pre/post snapshot defect evidence.
- Keep every target probe free of Authorization.
- Add controlled cleanup configuration to external JSON for only the two possible POST sentinels:
  - imported product identified by exact external marker field/value and removed through an external cleanup method/path template;
  - coupon identified by exact external marker field/value and removed through an external cleanup method/path template.
- Cleanup discovery must use successful post-probe snapshots and exact marker-field equality, not substring matching across arbitrary records.
- Extract only strict externally configured identifier fields from matching controlled records.
- Perform cleanup with the separately acquired seeded-admin snapshot session.
- Run cleanup in a finally block after probes so it is attempted even when an assertion/helper unexpectedly throws.
- Never delete an uncontrolled record.
- Never modify SQLite directly.
- Record the original pre-cleanup mutation evidence before cleanup; cleanup must not erase or weaken the defect oracle.
- Capture a final post-cleanup snapshot and assert that controlled markers are absent and controlled state is restored to the pre-probe snapshot where snapshots are available.
- If cleanup or final snapshot acquisition fails, record a failure with diagnostics.
- If no controlled marker exists, cleanup performs zero mutations and final verification still runs.
- Keep users/orders safe-ID probes non-mutating; do not invent cleanup mutations for records that were never controlled.

External-data requirements:
- Preserve exactly these keys and IDs:
  - admin_ui_no_token -> FR12-TC01
  - admin_ui_ordinary_user -> FR12-TC02
  - admin_ui_admin -> FR12-TC03
  - admin_route_inventory_missing_token -> FR12-TC04
- Keep paths, credentials, labels, counts, methods, route inventory, payloads, safe IDs, marker fields, identifier fields, cleanup methods/paths, and expected cleanup outcomes in JSON.
- Keep strict TypeScript interfaces in data-loader.
- Do not add inline test-case arrays or cleanup route objects to the spec.

Preservation:
- Keep exactly four FR12 declarations.
- Preserve all accepted 0019 assertions and helpers unless this correction strictly requires adjustment.
- Preserve FR01 and FR07 byte-for-byte.
- Do not modify SUT, audit, evidence, database, Playwright configuration, documentation, or package files.
- Do not add waits, retries, skips, fixmes, storage injection, mocks, React-internal access, duplicate login actions, or direct database access.
- Remain compatible with strict TypeScript and Playwright 1.62.1.

Static validation only:
- Parse and validate FR12 JSON, four unique sequential IDs, seven unique target routes, two unique controlled cleanup definitions, exact marker fields, and safe identifiers.
- Run npm run typecheck.
- Use Playwright --list for FR12-TC01 through FR12-TC04 without executing tests.
- Confirm exactly four FR12 declarations.
- Confirm TC02 and TC03 hard visible prerequisites occur before exactly one loginOnce call.
- Confirm TC01 through TC03 use test.slow and guarded post-count visibility observations.
- Confirm all seven target probes still omit Authorization.
- Confirm cleanup uses exact controlled marker fields, authenticated API cleanup, and a finally block.
- Confirm original post-probe mutation evidence occurs before cleanup and final restoration evidence occurs after cleanup.
- Confirm admin-access.page.ts is byte-identical to the 0019 artifact unless explicitly justified.
- Confirm FR01 and FR07 remain byte-identical to HEAD.
- Scan forbidden patterns and run whitespace checks.
- Confirm no prohibited file changed beyond pre-existing audit changes.

After editing, report:
- exact automation files changed relative to the 0019 rejected artifact;
- hard TC02/TC03 login prerequisite sequence;
- guarded evidence-budget correction;
- TC04 controlled cleanup and finally behavior;
- retained TC01-TC04 oracles;
- static validation performed;
- confirmation that no browser/API test ran and no prohibited file was modified.
```

## Exact AI output

```text
Corrected the rejected FR-12 increment 1 proposal for exactly FR12-TC01–FR12-TC04.

### Changed relative to 0019

- [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:96)
- [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts:60)
- [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts:165)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:737)

[admin-access.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/admin-access.page.ts) remains byte-identical to the rejected artifact; no correction was necessary.

### Corrections

- TC01–TC03 now use `test.slow()`.
- TC02/TC03 hard prerequisite sequence is: form count → form visible → email count → email visible → password count → password visible → submit count → submit visible → exactly one `loginOnce`.
- Soft count/visibility evidence now uses a web-first count followed by an immediate count read; visibility is checked only when the expected positive count is present.
- TC04 retains all seven no-Authorization probes and records original post-probe mutation evidence before cleanup.
- Exact `name` and `code` marker equality discovers controlled product/coupon records. Only strict positive-integer configured `id` fields are deleted through the authenticated seeded-admin session.
- Cleanup runs in nested `finally` teardown. Zero markers cause zero cleanup mutations, while final snapshot and restoration verification still run.
- Cleanup/discovery/final-snapshot failures produce diagnostic soft failures.

All original TC01–TC04 login-boundary, authorization, dialog, protected-content, response, no-mutation, snapshot, marker, and identity oracles remain.

### Static validation

Passed:

- FR12 JSON parsing, four sequential unique IDs, seven unique routes, safe IDs, two cleanup definitions, and exact marker fields
- `npm run typecheck`
- FR12-only Playwright `--list`: four declarations across Chromium, Firefox, and WebKit
- Login prerequisite ordering and single submissions
- Guarded visibility and `test.slow()` checks
- No Authorization in all target probes
- Exact-marker authenticated cleanup, `finally` teardown, and evidence ordering
- FR01/FR07 byte equality with `HEAD`
- Page Object equality with 0019
- Forbidden-pattern, trailing-whitespace, and `git diff --check` scans
- Required SUT, documentation, configuration, database, and audit paths preserved

No browser or API test was executed. The pre-existing audit changes were untouched, and no prohibited file was modified.
```

## Human review/action

Chấp nhận output 0020. Human action: Tôi đã review toàn bộ correction diff FR-12 increment 1 và xác nhận TC02/TC03 hard-require đúng external login form/control counts cùng visibility trước đúng một loginOnce activation; không có retry hoặc compensating submit. TC01 đến TC03 dùng test.slow và guarded post-count visibility để bảo toàn evidence budget. TC04 giữ nguyên đủ bảy missing-token probes không truyền Authorization, ghi nhận post-probe snapshot/marker defect evidence trước cleanup, rồi chỉ tìm product/coupon sentinel bằng exact marker-field equality và strict positive-integer ID. Controlled cleanup dùng seeded-admin API session trong nested finally; zero marker không tạo cleanup mutation, còn final snapshots kiểm tra marker vắng mặt và state trở lại pre-probe baseline. Admin Page Object byte-identical với rejected artifact 0019; FR01/FR07 không thay đổi. External JSON có đúng bốn sequential IDs, bảy unique target routes và hai controlled cleanup definitions. Typecheck thành công, Playwright chỉ liệt kê đúng bốn TC01-TC04 trên Chromium, declaration count là 4, forbidden-pattern, whitespace và diff checks đều sạch. Chưa chạy Playwright browser/API test và không sửa SUT, database, evidence, configuration, documentation hoặc package files.
