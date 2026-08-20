# FR-01 Increment 3 — Chromium Development Run

- Student ID: 23127027
- Run timestamp: 2026-08-20T07:47:31.621Z
- Browser project: chromium
- Scope: FR01-TC09–FR01-TC12
- Playwright exit code: 1
- Result: 1 passed, 3 failed
- HTML report: playwright-report/dev/fr01-increment3-chromium
- Final-nine status: DEVELOPMENT ONLY — not counted

## Human triage

| Test | Observed result | Classification |
|---|---|---|
| FR01-TC09 | The password without any listed allowed special character remained on registration, displayed a visible non-empty application error above submit, and sent zero POST `/api/register` requests. | Passed in this Chromium development run. |
| FR01-TC10 | All seven rows for `@`, `$`, `!`, `%`, `*`, `?`, and `&` remained on registration with the weak-password error. Each row recorded five soft assertion failures, and the trace contained no POST `/api/register` request. | Failed — verified requirement mismatch with the same candidate root cause observed by TC05; candidate SUT defect for Stage 9. |
| FR01-TC11 | The hard prerequisite failed because the confirmation-password control was not found in the registration DOM. | Failed — verified requirement mismatch with the same candidate root cause observed by TC02 and TC04; decision-table rows were not reached. |
| FR01-TC12 | The first unique registration returned status 200 with the documented success message and numeric id 3. Repeating the same email also returned status 200 and created id 4. | Failed — verified unique-email requirement mismatch; candidate SUT defect for Stage 9. |

## Root-cause evidence

- TC10 exercised all seven externally defined permitted symbols. The frontend password expression requires whitespace and excludes the seven documented special characters, so every valid-symbol row was rejected before the registration API path.
- TC11 observed no confirmation-password control in the rendered DOM; the reviewed registration source also contains no such control.
- TC12 used the real registration API without mocking. The backend route inserts every submitted record, and the users table does not enforce uniqueness on email.
- TC10 and TC11 match previously observed candidate root causes and are not counted as additional independent defects.

## Evidence boundaries

- Genuine console output, screenshots, error contexts, last-run metadata, and traces are preserved under this development evidence directory.
- TC10 completed all seven rows because its row assertions were soft; all navigation and request-count requirements were retained.
- TC11 stopped at the hard confirmation-control prerequisite. Its unequal/equal rows and their later assertions are EVIDENCE NOT REACHED.
- TC12 independently demonstrated the unique-then-duplicate state transition. Runtime ids 3 and 4 are execution-specific evidence.
- This was a development execution and is not one of the nine final feature-browser reports.
- No assertion was weakened, no SUT source was modified, and no GitHub Issue was created.
- Backend and frontend runtimes were stopped, and backend/database.sqlite was restored from the verified baseline backup after execution.
