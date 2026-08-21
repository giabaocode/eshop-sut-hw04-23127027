# HW04 Pre-FR12 Cross-Browser Baseline

## Run metadata

* Run timestamp: 2026-08-21T08:28:30+07:00
* Projects: Chromium, Firefox, WebKit
* Scope: infrastructure smoke, FR01-TC01 through FR01-TC12, and FR07-TC01 through FR07-TC12
* Runtime web URL: `http://localhost:5173`
* Runtime API URL: `http://localhost:3000`
* Run label: `final-hw04-cross-browser`
* Classification: Interim pre-FR12 development baseline; not final submission evidence
* Total: 75 tests
* Result: 18 passed, 57 failed
* Duration: 9.5 minutes
* Playwright exit code: 1
* Console output SHA-256: `6b6878f72626cd8b98b92d7919cdd342e7f419b4528a7443a0a236e8ead9de73`
* Last-run metadata SHA-256: `200f16774dffb1e7dcd11af91f42e6536c051244977939f480f67dc95fb5215a`

## Cross-browser outcome

| Browser  | Passed | Failed | Infrastructure | FR01 passed                                | FR07 passed |
| -------- | -----: | -----: | -------------- | ------------------------------------------ | ----------- |
| Chromium |      6 |     19 | Passed         | FR01-TC06, FR01-TC07, FR01-TC08, FR01-TC09 | FR07-TC02   |
| Firefox  |      6 |     19 | Passed         | FR01-TC06, FR01-TC07, FR01-TC08, FR01-TC09 | FR07-TC02   |
| WebKit   |      6 |     19 | Passed         | FR01-TC06, FR01-TC07, FR01-TC08, FR01-TC09 | FR07-TC02   |

The same 19 feature cases failed on all three browser projects. No browser-specific test-level divergence was observed.

## Failed feature cases

* FR01: FR01-TC01, FR01-TC02, FR01-TC03, FR01-TC04, FR01-TC05, FR01-TC10, FR01-TC11, FR01-TC12
* FR07: FR07-TC01, FR07-TC03, FR07-TC04, FR07-TC05, FR07-TC06, FR07-TC07, FR07-TC08, FR07-TC09, FR07-TC10, FR07-TC11, FR07-TC12

## Root-cause-aligned human triage

| Cases                           | Recorded observation or evidence boundary                                                                                                                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR01-TC01                       | Registration lacks the required descriptive h1.                                                                                                                                                                                               |
| FR01-TC02, FR01-TC04, FR01-TC11 | The confirmation-password control is absent. Confirmation and related decision-table evidence cannot be reached.                                                                                                                              |
| FR01-TC03                       | The email control uses text semantics rather than the required email-input semantics.                                                                                                                                                         |
| FR01-TC05, FR01-TC10            | Passwords satisfying the documented length and allowed-character rules are rejected as weak.                                                                                                                                                  |
| FR01-TC12                       | Reusing an already registered email returns success and creates another user instead of rejecting the duplicate.                                                                                                                              |
| FR07-TC01, FR07-TC04            | The populated cart lacks the required h1, uses `Giá` instead of `Đơn giá`, and lacks row-scoped quantity controls.                                                                                                                            |
| FR07-TC03                       | Adding the same product twice creates two rows rather than one row with quantity two.                                                                                                                                                         |
| FR07-TC05                       | The hard two-product fixture cannot establish the target quantity after exactly one visible Product Detail Add activation. Minus-control and decrement-delta evidence are not reached; this result is not evidence of a minus-control defect. |
| FR07-TC06, FR07-TC07, FR07-TC08 | Delete removes the selected product immediately without an accessible confirmation dialog. Cancel/confirm decision evidence is not reached where dependent on that dialog.                                                                    |
| FR07-TC09                       | The cart lacks a semantic breadcrumb and programmatic current-page navbar state, and the populated-cart shopping link uses `← Mua tiếp` instead of the required `Tiếp tục mua sắm`.                                                           |
| FR07-TC10                       | The summary label is `Tổng tạm tính` instead of the exact required `Tổng cộng`.                                                                                                                                                               |
| FR07-TC11                       | The natural empty cart has a clear message and no product rows but lacks an accessible named illustration.                                                                                                                                    |
| FR07-TC12                       | After the hard visible quantity-one prerequisite and exactly one Add activation, no associated numeric cart badge and no observable feedback transition are present.                                                                          |

## Evidence inventory

* Console output: 5,401 lines
* Last-run failed test IDs: 57
* Preserved error contexts: 57
* Preserved traces: 57
* Preserved screenshots: 54
* Total preserved execution-artifact files: 169
* Preserved execution-artifact size: approximately 35 MB

Three API-oriented failures did not produce screenshots; their error contexts and traces were preserved.

## Evidence boundaries

* This is an interim cross-browser baseline captured before FR12 automation existed; it is not the final HW04 submission run.
* The traceability matrix requires FR12-TC01 through FR12-TC12, and none of those cases were listed or executed in this run.
* All 75 listed tests executed using one worker.
* The 18 passes and 57 failures are recorded results, not inferred or fabricated outcomes.
* Failure grouping reuses reviewed development evidence and preserves all explicit evidence-not-reached boundaries.
* No retry, skip, fixme, storage injection, SUT mock, compensating target action, or arbitrary wait was introduced.
* Backend and frontend runtimes were stopped after artifacts were preserved.
* The runtime database was restored from the verified baseline backup.
* Restored database SHA-256: `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`.
* The restored database matches Git.
* No SUT source was modified.
