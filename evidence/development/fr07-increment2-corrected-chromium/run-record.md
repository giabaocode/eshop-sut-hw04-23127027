# FR-07 Increment 2 — Chromium Corrected Development Run

- Student ID: 23127027
- Run timestamp: 2026-08-20T12:02:44.589Z
- Browser project: chromium
- Scope: FR07-TC05–FR07-TC08
- Configured frontend URL: `http://localhost:5173`
- Playwright exit code: 1
- Result: 0 passed, 4 failed
- Total time: 22.7 seconds
- HTML report: `playwright-report/dev/fr07-increment2-corrected-chromium`
- Final-nine status: DEVELOPMENT ONLY — not counted

## Human triage

| Test | Observed result | Classification |
|---|---|---|
| FR07-TC05 | The hard two-product fixture expected AirPods quantity 2 plus one Keychron row, but the cart contained only the Keychron row. The Product Detail Add control had been activated exactly once as required. | Failed at fixture construction. The decrement control and all decrement state-delta assertions are EVIDENCE NOT REACHED; this is not evidence of a minus-control defect. |
| FR07-TC06 | The populated-cart, numeric-summary, and red dangerous-action prerequisites completed. Activating Xóa removed the iPhone immediately, produced the empty-cart view, and exposed no accessible dialog. | Failed — verified delete-confirmation requirement mismatch; candidate SUT defect for Stage 9. |
| FR07-TC07 | The Samsung baseline was established, but activating Xóa immediately produced the empty-cart view and no accessible dialog. | Failed with the same delete-confirmation root cause as TC06. Cancel discovery and cancel/no-mutation assertions are EVIDENCE NOT REACHED. |
| FR07-TC08 | The AirPods/Keychron two-row baseline was established. Activating Xóa immediately removed AirPods without a dialog; the observed DOM retained only Keychron with a displayed total of `4,000,000 ₫`. | Failed with the same delete-confirmation root cause as TC06. Semantic confirmation and subsequent total/badge assertions are EVIDENCE NOT REACHED. |

## Root-cause evidence

- TC05’s observed DOM contains only the comparison Keychron row after the single permitted Product Detail Add activation and the comparison-product setup.
- TC06 and TC07 observed the empty-cart state immediately after Xóa.
- TC08 observed only the comparison Keychron row immediately after Xóa.
- None of TC06–TC08 exposed a `dialog` or `alertdialog`.
- The reviewed cart source invokes removal directly from the Xóa action and contains no confirmation-dialog flow.
- TC06–TC08 share one candidate root cause and are not counted as three independent defects.

## Evidence boundaries

- Genuine console output, screenshots, error contexts, last-run metadata, traces, and HTML report are preserved.
- TC05’s decrement action was not reached because its hard visible-UI fixture failed.
- TC07’s cancel action was not reached.
- TC08’s confirm action and later badge assertion were not reached.
- DOM snapshots independently establish the immediate cart-state changes described above; they do not convert unexecuted assertions into passed assertions.
- This development run is not one of the nine final feature-browser reports.
- No assertion was weakened, no SUT source was modified, and no GitHub Issue was created.
- Backend and frontend runtimes were stopped, and `backend/database.sqlite` was restored from the verified baseline backup after execution.
