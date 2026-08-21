# FR-12 Increment 1 — Chromium Development Run

## Run metadata

- Run timestamp: 2026-08-21T10:15:59+0700
- Project: Chromium
- Scope: FR12-TC01 through FR12-TC04
- Runtime Admin URL: http://localhost:5174
- Runtime API URL: http://localhost:3000
- Run label: development-fr12-increment1-chromium
- Result: 4 passed, 0 failed
- Playwright exit code: 0
- Console output SHA-256: deb30ddaea664bd1b5beb44106f7e1fa354092b3f941344948d078e2357595dd
- Last-run metadata SHA-256: 91d1c43004802cd49950d78eb11c8fa7d05da8ffffe219a8b13b2f561bc00903

## Command

~~~text
PW_WEB_URL="http://localhost:5174" \
PW_ADMIN_URL="http://localhost:5174" \
PW_API_URL="http://localhost:3000" \
PW_REPORT_DIR="playwright-report/dev/fr12-increment1-chromium" \
PW_RUN_LABEL="development-fr12-increment1-chromium" \
npx playwright test tests/features/fr12-access-control.spec.ts \
  --project=chromium \
  --grep 'FR12-TC0[1-4]' \
  --output="test-results/dev/fr12-increment1-chromium"
~~~

## Recorded outcomes

| Test | Recorded result |
|---|---|
| FR12-TC01 | Passed: a fresh unauthenticated context remained at the Admin login boundary; protected Admin identities were absent and no Admin mutation request was observed. |
| FR12-TC02 | Passed: seeded ordinary-user credentials authenticated through one visible login submission but did not gain Admin UI authorization. |
| FR12-TC03 | Passed: seeded admin credentials reached the protected EShop Admin and Dashboard identities after one visible login submission. |
| FR12-TC04 | Passed: all seven configured Admin API routes rejected missing-token probes; protected data was not returned, controlled snapshots did not change, and no sentinel remained after cleanup verification. |

## Evidence boundaries

- This was a development Chromium run for FR12 increment 1, not final submission evidence.
- All four cases executed using one worker.
- The four passes are recorded Playwright outcomes.
- No retry, skip, fixme, storage injection, mock, compensating target action, or arbitrary wait was used.
- No failure screenshot, trace, or error context was created because all four tests passed.
- Console output and last-run metadata were preserved in this evidence directory.
- Backend and Admin runtimes were stopped after evidence preservation.
- The runtime database was restored from the verified baseline backup.
- The restored database matches Git.
- No SUT source was modified.
