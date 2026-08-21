Implemented the first FR-12 increment with exactly four declarations.

Files:

- Created [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json)
- Created [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts:53)
- Created [admin-access.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/admin-access.page.ts:56)
- Created [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts:128)
- Modified [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:657)

JSON mappings:

- `admin_ui_no_token` → `FR12-TC01`
- `admin_ui_ordinary_user` → `FR12-TC02`
- `admin_ui_admin` → `FR12-TC03`
- `admin_route_inventory_missing_token` → `FR12-TC04`

Coverage:

- TC01 authentication: natural fresh context, direct `/` visit, visible scoped login form and controls, protected Admin/Dashboard identities absent, no login or admin mutation request.
- TC02 authorization: exactly one visible login submission, successful ordinary-user login response observed without reading its body/token, dialog deterministically dismissed without asserting wording, login form remains, protected identities remain absent, no admin mutation.
- TC03 positive authorization: exactly one visible login submission, successful login response, independent Admin and Dashboard visibility assertions, login form and controls removed, no mutation.
- TC04 authentication: all seven required routes are probed once without `Authorization`; POST probes use marked valid-looking payloads, while DELETE/PUT use non-existing safe IDs. Each response is independently checked for non-success and absence of protected data without asserting exact status or body.

TC04 captures users, orders, products, and coupons through a separately acquired seeded-admin snapshot session. Pre/post snapshots are normalized before comparison, markers are scanned across controlled state, and snapshot failures are recorded with soft assertions while all seven denial probes remain reachable.

Static validation passed:

- JSON parsing, exact keys, sequential unique IDs, route inventory, markers, safe IDs, and null authorization configuration
- `npm run typecheck`
- FR12-only Playwright `--list`: four declarations across three configured projects
- Exactly one TC02 and one TC03 login-helper call; helper contains one click
- FR01/FR07 tracked files byte-identical to `HEAD`
- Forbidden-pattern and whitespace scans
- `git diff --check`
- Required/reference and prohibited files unchanged

No browser or API test was executed—only TypeScript checking and Playwright discovery. No database, SUT, configuration, documentation, evidence, package, or audit file was modified; the two pre-existing untracked audit files were left untouched.