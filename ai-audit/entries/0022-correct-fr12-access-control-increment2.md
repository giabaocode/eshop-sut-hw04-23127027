# Interaction 0022

## AI tool

Codex CLI 0.148.0

## ISO date/time

2026-08-21T03:57:10Z

## Exact prompt

```text
Act as a senior Playwright TypeScript test-automation engineer correcting the rejected FR-12 increment 2 proposal for HW04 student 23127027.

Repository root:
`/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027`

Read before editing:

- `README.md`, especially FR-12, SEC-02, SEC-03, and relevant FR-21 through FR-24 requirements.
- `docs/hw04-traceability-test-matrix.md`, especially FR12-TC05 through FR12-TC08.
- `api_specification.md` only as supporting contract.
- Current:
  - `tests/data/fr12-access-control.json`
  - `tests/features/fr12-access-control.spec.ts`
  - `tests/support/data-loader.ts`
  - `tests/support/fr12-api.ts`
- Rejected artifact:
  - `ai-audit/artifacts/0021-rejected-fr12-increment2/fr12-access-control.json`
  - `ai-audit/artifacts/0021-rejected-fr12-increment2/fr12-access-control.spec.ts`
  - `ai-audit/artifacts/0021-rejected-fr12-increment2/data-loader.ts`
  - `ai-audit/artifacts/0021-rejected-fr12-increment2/fr12-api.ts`
- Read-only SUT references needed to understand whether an API-only reversible order fixture is possible:
  - `backend/server.js`
  - `backend/database.js`

Correct only the rejected FR12-TC05 through FR12-TC08 proposal. Preserve all accepted TC01-TC04 code byte-for-byte relative to HEAD.

The rejection reason is specific:

TC05 and TC06 currently probe `PUT /api/admin/orders/:id/status` with a non-existing safe ID and treat any non-success response plus unchanged snapshots as authentication or authorization denial. If the access-control boundary is bypassed, the business handler can return `404 Order not found`; the current oracle can then pass falsely.

Required correction:

1. Do not treat a generic non-success response from the non-existing order-status target as proof of authentication or authorization denial.

2. First determine from the read-only SUT/API sources whether a controlled existing order can be established and fully restored using supported HTTP APIs only.

3. If an API-only reversible controlled order fixture is possible:
   - Create it through supported APIs, never by editing SQLite or injecting internal state.
   - Prove a strict positive-integer controlled order ID and its initial state.
   - Choose a business-valid transition whose payload differs from the initial state.
   - Execute each TC05/TC06 order-status target exactly once.
   - Assert that invalid-token and ordinary-user requests do not change the controlled order.
   - Record the original target response/state evidence before cleanup.
   - Restore all controlled state through authenticated Admin APIs in nested `finally`.
   - Verify the final observable state equals its pre-test baseline.

4. If no fully reversible API-only controlled order fixture exists:
   - Keep the safe order-status request one-shot and non-mutating.
   - Add explicit external JSON evidence-boundary data explaining that a non-existing target cannot distinguish access denial from business-handler `not found`.
   - Do not count generic non-success as a verified denied route.
   - Produce an explicit guarded `EVIDENCE MISSING` assertion for that route so the test cannot pass falsely.
   - Keep the response available for later human triage without asserting unsupported exact status or wording.
   - Do not use skip, fixme, retry, arbitrary waits, mocks, storage injection, direct database access, or fabricated evidence.

5. Ensure aggregate route counters cannot report all seven routes as verified denials when the order-status authorization boundary was not actually proven.

6. Preserve the accepted design elsewhere:
   - TC05: exactly two invalid-token classes and fourteen one-shot target probes across seven Admin routes per class.
   - TC06: exactly seven one-shot ordinary-user target probes.
   - TC07: exactly two GET-only Admin read targets.
   - TC08: exactly nine POST/PUT/DELETE × missing/user/admin target rows.
   - Original post-target defect evidence must be recorded before cleanup.
   - Exact-marker discovery, strict positive-integer IDs, authenticated API cleanup, nested `finally`, and final baseline verification remain.
   - No raw token or signing material may be logged.
   - External test-case data remains in JSON; do not introduce inline test-case arrays or objects in the spec.

Permitted automation files:

- `tests/data/fr12-access-control.json`
- `tests/features/fr12-access-control.spec.ts`
- `tests/support/data-loader.ts`
- `tests/support/fr12-api.ts`

Do not modify:

- `tests/pages/admin-access.page.ts`
- FR01 or FR07 automation
- SUT source
- database files
- README, API specification, traceability matrix, or other documentation
- Playwright/TypeScript configuration
- package files or lockfiles
- evidence
- existing audit files, prompts, outputs, entries, or rejected artifacts

Validation requirements:

- JSON parses and IDs remain exactly sequential and unique FR12-TC01 through FR12-TC08.
- Exactly eight FR12 test declarations overall.
- TC01-TC04 remain byte-identical to HEAD.
- TC05-TC08 Playwright discovery lists exactly four tests for Chromium.
- Run `npm run typecheck`.
- Run Playwright only with `--list`; do not execute browser or API tests.
- Check one-shot target counts, evidence-before-cleanup ordering, guarded observations, forbidden patterns, trailing whitespace, and `git diff --check`.
- Confirm prohibited files are unchanged.

In the final response, state:

- the exact files changed;
- whether an API-only reversible order fixture was possible;
- how the false-pass order-status oracle was eliminated;
- TC05 through TC08 structure and action counts;
- cleanup and evidence boundaries;
- static validation performed;
- that no browser/API test ran and no prohibited file changed.
```

## Exact AI output

```text
Implemented the corrected FR12-TC05–TC08 proposal.

Changed files:

- [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json)
- [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)
- [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts)

An API-only reversible order fixture was not possible. `/api/checkout` creates a persistent pending order, but no supported HTTP endpoint deletes orders or reverses a status transition to its baseline state.

The false-pass oracle was eliminated by:

- Binding the three non-existing order-status probes to external JSON `EVIDENCE MISSING` definitions.
- Proving their safe IDs are strict positive integers and absent from the authenticated baseline.
- Retaining one-shot response diagnostics and post-target order snapshots.
- Never treating generic non-success, status, or wording as access-denial proof.
- Deliberately raising a guarded `EVIDENCE MISSING` assertion.
- Limiting verified-denial counters to six routes per token class, never seven.

Structure:

- TC05: 2 invalid-token classes × 7 routes = 14 one-shot probes; 12 potentially verified denials and 2 guarded order-status observations.
- TC06: 7 one-shot ordinary-user probes; 6 potentially verified denials and 1 guarded order-status observation.
- TC07: exactly 2 GET-only Admin reads.
- TC08: exactly 9 rows—POST/PUT/DELETE × missing/user/admin.

Original response/state evidence is recorded before exact-marker authenticated cleanup. Cleanup remains nested with strict positive-integer IDs and final collection-to-baseline verification.

Validation passed:

- JSON parsing and sequential unique FR12-TC01–TC08 IDs.
- Exactly eight test declarations.
- TC01–TC04 byte-identical to HEAD.
- Chromium `--list`: exactly four TC05–TC08 tests.
- `npm run typecheck`.
- Action-count, evidence-ordering, guarded-oracle, forbidden-pattern, logging, trailing-whitespace, and `git diff --check` checks.

No browser or API test ran. No prohibited file was changed; pre-existing `ai-audit` worktree entries were left untouched.
```

## Human review/action

Chấp nhận output 0022. Human action: Tôi đã review toàn bộ correction diff FR-12 increment 2 và xác nhận không thể tạo rồi khôi phục hoàn toàn controlled order fixture chỉ qua supported HTTP APIs vì checkout tạo persistent order nhưng không có order-delete endpoint hoặc reverse transition về baseline. TC05 và TC06 vì vậy gắn explicit external EVIDENCE MISSING boundary cho đúng hai invalid-token và một ordinary-user order-status probes. Các safe order IDs được hard-check là strict positive integers và vắng mặt trong authenticated baseline; mỗi target vẫn chạy đúng một lần và giữ original response/post-target snapshot evidence, nhưng generic non-success, status hoặc wording không còn được xem là access denial. Guarded EVIDENCE MISSING assertions ngăn test pass sai; counters chỉ cho phép TC05 có 12 potentially verified denials, sáu mỗi token class, và TC06 có sáu potentially verified denials. TC05 vẫn có đủ 14 probes, TC06 đủ bảy routes, TC07 đúng hai GET-only reads và TC08 đúng chín POST/PUT/DELETE × missing/user/admin rows. Evidence-before-cleanup, exact-marker authenticated cleanup, strict positive-integer IDs, nested finally và final baseline verification được giữ nguyên; fr12-api.ts byte-identical với rejected artifact 0021. TC01-TC04 byte-identical với HEAD, FR01/FR07 và Admin Page Object không thay đổi. External JSON có IDs tuần tự FR12-TC01 đến FR12-TC08, spec có đúng tám declarations, typecheck thành công và Playwright chỉ liệt kê đúng TC05-TC08 trên Chromium. Forbidden-pattern, whitespace và tracked diff checks đều sạch. Chưa chạy Playwright browser/API test và không sửa SUT, database, evidence, configuration, documentation hoặc package files.
