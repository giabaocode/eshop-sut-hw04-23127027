# FR-07 Increment 3 — Chromium Development Run

## Run metadata

- Run timestamp: 2026-08-21T07:53:29+07:00
- Project: Chromium
- Scope: FR07-TC09 through FR07-TC12
- Runtime web URL: `http://localhost:5173`
- Runtime API URL: `http://localhost:3000`
- Run label: `development-fr07-increment3-chromium`
- Result: 0 passed, 4 failed
- Playwright exit code: 1
- Console output SHA-256: `bc19e0fbf780dee497aed105fca0322ed4fa830ad63f65e114c7ed78f887563d`
- Last-run metadata SHA-256: `82524a37ca7e5731a0a7d0da9e695a2ef81fea0d1d91ce475b3dff1986da349d`

## Command

```text
PW_WEB_URL="http://localhost:5173" \
PW_API_URL="http://localhost:3000" \
PW_REPORT_DIR="playwright-report/dev/fr07-increment3-chromium" \
PW_RUN_LABEL="development-fr07-increment3-chromium" \
npx playwright test tests/features/fr07-cart.spec.ts \
  --project=chromium \
  --grep 'FR07-TC(09|10|11|12)' \
  --output="test-results/dev/fr07-increment3-chromium"
```

## Human triage

| Test | Recorded observation | Classification |
|---|---|---|
| FR07-TC09 | The populated cart exposed no named semantic breadcrumb. The `Giỏ hàng` navbar link existed but had no `aria-current="page"`. The required `Tiếp tục mua sắm` label was absent; the DOM instead exposed `← Mua tiếp`. No separate failure was recorded for activating the independently discovered shopping-destination link or for the resulting Home identity. | Failed — verified requirement mismatches for breadcrumb, programmatic current-page state, and required continue-shopping label. |
| FR07-TC10 | The cart summary label was `Tổng tạm tính`, while the required exact label was `Tổng cộng`. The independent currency-symbol, thousands-separator, expected-total, and displayed-line arithmetic assertions produced no recorded failure. | Failed — verified exact-label requirement mismatch. |
| FR07-TC11 | The natural fresh-context empty cart displayed the clear message `Giỏ hàng của bạn đang trống` and no populated product row failure was recorded. No accessible named illustration was present. | Failed — verified empty-state illustration requirement mismatch. |
| FR07-TC12 | The target Product Detail exposed a descriptive `MacBook Pro M3` image and visible quantity `1`; the hard one-unit prerequisite completed before exactly one Add activation. No associated numeric cart badge existed before or after the action, and the action produced no new or changed scoped semantic feedback or Add-control state/text transition. | Failed — verified missing cart-badge and add-to-cart feedback requirement mismatches. |

## Evidence boundaries

- This was a development Chromium run, not a final submission run.
- All four cases executed; there was no connection-refused or runtime-startup failure.
- The recorded failures were independently collected through soft assertions where applicable.
- No retry, compensating Add activation, storage injection, mock, or arbitrary wait was used.
- The console output and Playwright screenshots, traces, error contexts, and last-run metadata were preserved under this evidence directory.
- Backend and frontend runtimes were stopped after evidence preservation.
- The runtime database was restored from `backend/database.sqlite.pre-hw04`.
- The restored database SHA-256 is `c63f00544180ba1fbb1427a9b9dd3f1784842698809972f33ce90482e7420ba6`, matching Git.
- No SUT source was modified.