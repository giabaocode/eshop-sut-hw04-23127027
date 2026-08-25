# HW04 — AI Automation Testing Report

## 1. Submission information

- Student ID: **23127027**
- SUT: EShop, baseline commit `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Repository: https://github.com/giabaocode/eshop-sut-hw04-23127027
- Selected features: FR-01 Account registration, FR-07 Shopping cart, FR-12 Access control
- Framework: Playwright 1.62.1 with TypeScript
- Browsers: Chromium, Firefox, WebKit

AI declaration: **I use AI tools for test design, automation implementation, review support, and documentation.** Every recorded interaction, prompt, output, and human review action is preserved in `ai-audit/AI_AUDIT.md`.

## 2. Test design and implementation

The traceability matrix defines exactly 36 logical cases: 12 for each selected feature. The suite uses external JSON files under `tests/data`; feature specs do not contain inline case-data tables. Runtime-generated emails avoid collisions. Page Objects contain form- or component-scoped locators, while API helpers keep authentication partitions explicit.

The suite uses more than three assertion patterns per feature, including semantic role/text checks, DOM attributes and structure, navigation/focus, computed visual state, API response classes, state deltas, denial-with-no-mutation checks, and independent read-back. Tests use one worker, no retries, no fixed sleeps, screenshots only on failure, and retained traces on failure.

Mutation tests capture controlled state and clean up exact markers in `finally`. The database was restored from the verified pre-HW04 backup after final execution. No SUT source was changed to make a test pass.

## 3. Human review and corrections

AI-generated drafts required substantial review. Early registration locators assumed correctly associated HTML labels, but the SUT uses unassociated sibling labels. They were replaced with escaped, anchored, case-insensitive, form-scoped structural locators. Form filling was split by externally configured fields so email-format tests did not fail first on unrelated controls. Native browser validation is asserted through validity state rather than browser-specific text.

The cart drafts initially mixed API state with a UI-only same-product scenario and used ambiguous badge oracles. The corrected cases establish visible UI baselines, activate exactly one or two user actions as designed, and calculate quantities and totals from displayed values. Delete tests distinguish opening, canceling, and confirming a dialog instead of treating immediate removal as success.

The access-control drafts initially classified every non-success response as denial. Review found that a non-existing order ID could return a business-level 404 even if authorization were bypassed. FR12-TC05 and FR12-TC06 now report the order-status row as **EVIDENCE MISSING** because the SUT has no supported API to delete or reversibly restore a created order. Other routes use controlled markers and before/after snapshots.

## 4. Final execution

Each row below is an independent Playwright process and generated its own unedited HTML report. The visible report title and metadata contain `Run by: 23127027` and the listed ISO timestamp.

| Feature | Browser | ISO timestamp | Passed | Failed | HTML report |
|---|---|---|---:|---:|---|
| FR-01 | Chromium | 2026-08-21T08:16:17.266Z | 4 | 8 | `playwright-report/final/fr01-chromium/` |
| FR-01 | Firefox | 2026-08-21T08:17:28.215Z | 4 | 8 | `playwright-report/final/fr01-firefox/` |
| FR-01 | WebKit | 2026-08-21T08:18:45.026Z | 4 | 8 | `playwright-report/final/fr01-webkit/` |
| FR-07 | Chromium | 2026-08-21T08:19:57.935Z | 1 | 11 | `playwright-report/final/fr07-chromium/` |
| FR-07 | Firefox | 2026-08-21T08:21:49.223Z | 1 | 11 | `playwright-report/final/fr07-firefox/` |
| FR-07 | WebKit | 2026-08-21T08:23:49.937Z | 1 | 11 | `playwright-report/final/fr07-webkit/` |
| FR-12 | Chromium | 2026-08-21T08:25:44.506Z | 5 | 7 | `playwright-report/final/fr12-chromium/` |
| FR-12 | Firefox | 2026-08-21T08:25:47.806Z | 5 | 7 | `playwright-report/final/fr12-firefox/` |
| FR-12 | WebKit | 2026-08-21T08:25:51.935Z | 5 | 7 | `playwright-report/final/fr12-webkit/` |
| **Total** | **9 runs** | — | **30** | **78** | **9 reports** |

All 36 logical cases executed on all three browsers: **108 executions**. No browser-specific logical divergence was observed.

## 5. Result analysis

FR-01 passed TC06–TC09 in every browser. Failures verified missing registration structure, confirmation-password behavior, email semantics, password-policy mismatches, and duplicate-email acceptance.

FR-07 passed TC02 in every browser. Failures verified missing cart structure and quantity controls, duplicate rows for the same product, immediate deletion without confirmation, navigation and total-label discrepancies, missing empty-state illustration, and missing badge/add feedback. FR07-TC05 stopped at fixture construction and is not used as evidence of a minus-control defect.

FR-12 passed TC01–TC04 and TC07 in every browser. TC08–TC12 verified missing authorization on data mutations, the README/contract coupon-route discrepancy, and profile role mass assignment. TC05–TC06 fail only because their order-status row is explicitly inconclusive; their other route observations remain preserved and are not promoted to defects without a reversible business-valid oracle.

The consolidated 16 root-cause groups and reproduction evidence are in `docs/bug-report.md`. The student published all 16 GitHub Issues with screenshots and the report links each issue directly.

## 6. Deliverable inventory

- Automation: `tests/features`, `tests/pages`, `tests/support`
- External data: `tests/data`
- Traceability: `docs/hw04-traceability-test-matrix.md`
- Nine final reports: `playwright-report/final`
- Final console evidence: `evidence/final`
- Bug report: `docs/bug-report.md`
- AI critique: `docs/ai-critique.md`
- AI audit: `ai-audit/AI_AUDIT.md`
- Test-script commit log: `git-commit-log.txt`
- Reusable Agent Skill: `skills/hw04-playwright-workflow`

## 7. Items that require student authorship

The narrated demo video and skill demonstration are intentionally not fabricated and remain student-only work. The student has completed GitHub Issue publication. The remaining completion steps are listed in `docs/student-finish-checklist.md`.
