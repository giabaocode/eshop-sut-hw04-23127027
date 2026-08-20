# FR-01 Increment 1 — Chromium Development Run

- Student ID: 23127027
- Run timestamp: 2026-08-20T04:35:07.902Z
- Browser project: chromium
- Scope: FR01-TC01–FR01-TC04
- Playwright exit code: 1
- Result: 0 passed, 4 failed
- HTML report: playwright-report/dev/fr01-increment1-chromium
- Final-nine status: DEVELOPMENT ONLY — not counted

## Human triage
| Test | Observed failure | Classification |
|---|---|---|
| FR01-TC01 | Expected one h1; received zero. Source uses h2. | Verified requirement mismatch; candidate SUT defect for Stage 9. |
| FR01-TC02 | Confirmation-password control was not found. | Verified requirement mismatch; same underlying candidate defect as TC04. |
| FR01-TC03 | Email input resolved correctly but type was text instead of email. | Verified requirement mismatch; candidate SUT defect for Stage 9. |
| FR01-TC04 | Confirmation-password control was not found. | Verified requirement mismatch; same underlying candidate defect as TC02. |

## Evidence boundaries
- Locator, environment, and test-data causes were excluded for the observed failures.
- Genuine screenshots, error contexts, and traces are preserved under this directory.
- Assertions after each first failure were not executed and remain EVIDENCE NOT REACHED.
- No SUT source was modified, no assertion was weakened, and no GitHub Issue was created.
