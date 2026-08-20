# FR-07 Increment 2 — Chromium Infrastructure-Invalid Development Run

- Student ID: 23127027
- Run timestamp: 2026-08-20T11:56:47.595Z
- Browser project: chromium
- Scope: FR07-TC05–FR07-TC08
- Configured frontend URL: `http://127.0.0.1:5173`
- Playwright exit code: 1
- Raw result: 0 passed, 4 failed
- Total time: 1.7 seconds
- HTML report: `playwright-report/dev/fr07-increment2-chromium`
- Status: INFRASTRUCTURE INVALID — superseded and not counted

## Human triage

All four tests failed during their initial `page.goto` calls with `net::ERR_CONNECTION_REFUSED`. No FR07 functional oracles were reached, so this run provides no valid pass, failure, or SUT-defect classification.

The Vite listener was later confirmed on IPv6 `[::1]:5173`. `http://localhost:5173/cart` returned HTTP 200, while the explicitly configured IPv4 URL `http://127.0.0.1:5173/cart` could not connect.

## Evidence boundaries

- Genuine console output, screenshots, error contexts, last-run metadata, traces, and HTML report were preserved.
- This run was not retried as a flaky test. It was superseded once by a corrected development run using the actual Vite URL.
- This run is not one of the nine final feature-browser reports.
- No SUT defect is claimed from this run.
