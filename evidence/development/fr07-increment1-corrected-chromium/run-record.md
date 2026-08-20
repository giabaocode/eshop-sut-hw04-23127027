# FR-07 Increment 1 — Chromium Corrected Development Run

- Student ID: 23127027
- Run timestamp: 2026-08-20T09:52:53.861Z
- Browser project: chromium
- Scope: FR07-TC01–FR07-TC04
- Playwright exit code: 1
- Result: 1 passed, 3 failed
- Total time: 47.1s
- HTML report: playwright-report/dev/fr07-increment1-corrected-chromium
- Final-nine status: DEVELOPMENT ONLY — not counted

## Human triage

| Test | Observed result | Classification |
|---|---|---|
| FR07-TC01 | The populated cart rendered both expected product rows, but had no h1, used `Giá` instead of the required `Đơn giá`, and provided no row-scoped `+` or `-` controls. `test.slow()` allowed all independent soft requirement assertions to complete. | Failed — verified requirement mismatches; candidates for Stage 9. |
| FR07-TC02 | Missing, malformed, and signed-but-expired JWT partitions were rejected for both GET and POST cart requests; the authenticated cart snapshot was unchanged afterward. | Passed in this Chromium corrected development run. |
| FR07-TC03 | Activating the same Home product card exactly twice produced two cart rows instead of one row with quantity two. | Failed — verified same-product merge requirement mismatch; candidate for Stage 9. |
| FR07-TC04 | The target row was present after the web-first row-count prerequisite, but its required row-scoped `+` control was absent. | Failed — verified requirement mismatch matching the missing quantity controls observed by TC01. |

## Evidence boundaries

- Genuine console output, screenshots, error contexts, last-run metadata, and traces are preserved under this corrected development evidence directory.
- TC01 completed its independent soft structure and control assertions without the timeout that affected the initial run.
- TC03 stopped at the one-row requirement; later quantity and total assertions are EVIDENCE NOT REACHED.
- TC04 stopped at the hard `+`-control prerequisite; click and post-click quantity, line-total, and cart-total assertions are EVIDENCE NOT REACHED.
- The initial run remains preserved separately and is superseded by this corrected run for TC01 and TC04 evidence reach.
- This was a development execution and is not one of the nine final feature-browser reports.
- No assertion was weakened, no SUT source was modified, and no GitHub Issue was created.
- Backend, frontend, and report runtimes were stopped, and `backend/database.sqlite` was restored from the verified baseline backup after execution.
