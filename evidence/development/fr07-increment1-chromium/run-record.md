# FR-07 Increment 1 — Chromium Initial Development Run

- Student ID: 23127027
- Run timestamp: 2026-08-20T09:31:41.325Z
- Browser project: chromium
- Scope: FR07-TC01–FR07-TC04
- Playwright exit code: 1
- Result: 1 passed, 3 failed
- Total time: 36.6s
- HTML report: playwright-report/dev/fr07-increment1-chromium
- Final-nine status: DEVELOPMENT ONLY — not counted

## Human triage

| Test | Observed result | Classification |
|---|---|---|
| FR07-TC01 | Missing h1, required `Đơn giá` header, and row quantity controls were observed, but the test reached its initial 30-second budget before every independent soft assertion completed. | Initial requirement evidence was incomplete; superseded by the corrected run after adding `test.slow()` without weakening any oracle. |
| FR07-TC02 | Invalid authentication partitions were rejected and the authenticated cart snapshot remained unchanged. | Passed in this Chromium initial development run. |
| FR07-TC03 | Adding the same product exactly twice produced two rows rather than one row with quantity two. | Failed — verified requirement mismatch, reproduced by the corrected run. |
| FR07-TC04 | An immediate non-web-first row count returned zero even though the failure DOM contained the expected target row. | Automation timing issue; not classified as a SUT defect from this initial result. Superseded by the corrected run. |

## Correction and evidence boundaries

- Interaction 0013 added `test.slow()` to TC01 and replaced TC04's immediate row count with a web-first `toHaveCount` prerequisite.
- The correction did not remove, skip, reorder, or weaken any requirement assertion.
- Genuine initial console output, screenshots, error contexts, last-run metadata, and traces remain preserved under this directory.
- The corrected development run is the authoritative evidence for TC01 and TC04.
- This initial run is not one of the nine final feature-browser reports.
- No SUT source was modified and no GitHub Issue was created.
