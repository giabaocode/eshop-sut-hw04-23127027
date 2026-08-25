Implemented the reviewed FR-12 increment for exactly FR12-TC05 through FR12-TC08.

### Changed files

- [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:358)
- [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts:802)
- [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts:273)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:868)

Added external records:

- `admin_route_inventory_invalid_tokens` → `FR12-TC05`
- `admin_route_inventory_user_token` → `FR12-TC06`
- `admin_read_routes_admin_token` → `FR12-TC07`
- `product_mutation_access_matrix` → `FR12-TC08`

### Coverage

- TC05 contains exactly fourteen external probes: all seven Admin routes for malformed and expired Bearer tokens. The deterministic HS256 fixture was statically proven to have three segments, matching algorithm, numeric past `exp`, and a valid signature. Four exact product/coupon cleanup markers restore state without asserting a production expiry contract.
- TC06 performs one ordinary-user login, validates external `user` role evidence, probes all seven Admin routes once, records independent authorization failures and state evidence, then cleans only the two exact sentinels through the seeded-admin API session.
- TC07 performs one admin login and exactly two GET target requests for `/api/admin/users` and `/api/admin/orders`. It verifies collection representations, configured seeded user identities, and permits empty orders.
- TC08 implements exactly nine unique POST/PUT/DELETE × missing/user/admin rows. All setup uses supported APIs with the admin token and a read API category reference. Each target runs once with independent response/state assertions. Final cleanup discovers exact invariant names, accepts only positive integer IDs, removes only controlled products, and verifies the complete pre-test baseline.

Transport, snapshot, cleanup, and final-restoration failures produce guarded diagnostics and cannot become false no-change/no-marker passes. Tokens and signing material are never logged.

### Static validation

Passed:

- JSON parsing and sequential unique `FR12-TC01`–`FR12-TC08` IDs
- TC05: 2 token classes, 14 probes, 7 routes/class, 4 cleanup markers
- TC06: 7 routes and 2 cleanup markers
- TC07: exactly 2 GET-only routes with no mutation/cleanup configuration
- TC08: 9 unique decisions, 9 unique primary markers, 12 unique cleanup invariants
- `npm run typecheck`
- Playwright `--list` for TC05–TC08: four cases across Chromium, Firefox, and WebKit
- Exactly eight FR12 declarations overall
- TC01–TC04 describe block byte-identical to HEAD
- `admin-access.page.ts`, FR01, and FR07 byte-identical to HEAD
- One-shot login/target structure and required evidence/cleanup ordering
- Forbidden-pattern, raw-secret logging, trailing-whitespace, and `git diff --check` scans

No browser or API test was executed. Only the four permitted automation files changed; SUT, configuration, documentation, database, package, audit, evidence, and Admin Page Object files were not modified.