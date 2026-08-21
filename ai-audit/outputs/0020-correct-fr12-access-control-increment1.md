Corrected the rejected FR-12 increment 1 proposal for exactly FR12-TC01–FR12-TC04.

### Changed relative to 0019

- [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:96)
- [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts:60)
- [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts:165)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:737)

[admin-access.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/admin-access.page.ts) remains byte-identical to the rejected artifact; no correction was necessary.

### Corrections

- TC01–TC03 now use `test.slow()`.
- TC02/TC03 hard prerequisite sequence is: form count → form visible → email count → email visible → password count → password visible → submit count → submit visible → exactly one `loginOnce`.
- Soft count/visibility evidence now uses a web-first count followed by an immediate count read; visibility is checked only when the expected positive count is present.
- TC04 retains all seven no-Authorization probes and records original post-probe mutation evidence before cleanup.
- Exact `name` and `code` marker equality discovers controlled product/coupon records. Only strict positive-integer configured `id` fields are deleted through the authenticated seeded-admin session.
- Cleanup runs in nested `finally` teardown. Zero markers cause zero cleanup mutations, while final snapshot and restoration verification still run.
- Cleanup/discovery/final-snapshot failures produce diagnostic soft failures.

All original TC01–TC04 login-boundary, authorization, dialog, protected-content, response, no-mutation, snapshot, marker, and identity oracles remain.

### Static validation

Passed:

- FR12 JSON parsing, four sequential unique IDs, seven unique routes, safe IDs, two cleanup definitions, and exact marker fields
- `npm run typecheck`
- FR12-only Playwright `--list`: four declarations across Chromium, Firefox, and WebKit
- Login prerequisite ordering and single submissions
- Guarded visibility and `test.slow()` checks
- No Authorization in all target probes
- Exact-marker authenticated cleanup, `finally` teardown, and evidence ordering
- FR01/FR07 byte equality with `HEAD`
- Page Object equality with 0019
- Forbidden-pattern, trailing-whitespace, and `git diff --check` scans
- Required SUT, documentation, configuration, database, and audit paths preserved

No browser or API test was executed. The pre-existing audit changes were untouched, and no prohibited file was modified.