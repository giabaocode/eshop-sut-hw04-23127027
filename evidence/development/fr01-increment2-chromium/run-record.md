# FR-01 Increment 2 — Chromium Development Run

- Student ID: 23127027
- Run timestamp: 2026-08-20T05:56:57.417Z
- Browser project: chromium
- Scope: FR01-TC05–FR01-TC08
- Playwright exit code: 1
- Result: 3 passed, 1 failed
- HTML report: playwright-report/dev/fr01-increment2-chromium
- Final-nine status: DEVELOPMENT ONLY — not counted

## Human triage

| Test | Observed result | Classification |
|---|---|---|
| FR01-TC05 | The 7-character boundary completed its rejection oracle. The 8-character value `Aa1!bbbb`, which satisfies the documented length and character classes, remained on registration and displayed the weak-password error instead of reaching login. | Failed — verified requirement mismatch; candidate SUT defect for Stage 9. |
| FR01-TC06 | Password without uppercase was rejected, application error was visible and above submit, and no registration POST was observed. | Passed in this Chromium development run. |
| FR01-TC07 | Password without lowercase was rejected, application error was visible and above submit, and no registration POST was observed. | Passed in this Chromium development run. |
| FR01-TC08 | Password without a digit was rejected, application error was visible and above submit, and no registration POST was observed. | Passed in this Chromium development run. |

## Root-cause evidence

- README.md FR-01 accepts `!` as a special character and requires a minimum length of 8.
- The submitted boundary value `Aa1!bbbb` has eight characters and includes lowercase, uppercase, digit, and an allowed special character.
- The frontend regex requires whitespace and restricts accepted characters to letters, digits, and whitespace, so it rejects the documented special character.
- Error context and screenshot show the valid boundary value remained on the registration page with the weak-password error.
- The trace contains no `/api/register` request, independently confirming that the frontend rejected the value before the creation path.

## Evidence boundaries

- Genuine screenshot, error context, last-run metadata, and trace are preserved under `execution-artifacts/`.
- TC05 assertions after the first failed login-heading assertion were not executed. In particular, the in-test request-count assertion for the 8-character boundary is EVIDENCE NOT REACHED; the trace provides the independent no-request evidence.
- This report records a development execution only and is not one of the nine final feature-browser reports.
- No assertion was weakened, no SUT source was modified, and no GitHub Issue was created.
- Backend runtime was stopped and `backend/database.sqlite` was restored from the verified baseline backup after execution.
