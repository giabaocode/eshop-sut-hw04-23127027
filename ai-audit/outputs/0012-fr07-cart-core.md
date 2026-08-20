Implemented FR-07 increment 1 with exactly four test declarations.

Changed files:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

External JSON keys and generated IDs:

- `populated_cart_two_products` → `FR07-TC01`
- `cart_invalid_authentication` → `FR07-TC02`
- `same_product_ui_addition` → `FR07-TC03`
- `quantity_increment` → `FR07-TC04`

Fixture construction and oracles:

- TC01: clicks two distinct heading-scoped home product cards once each, then uses the visible cart link. Verifies two rows, one descriptive `h1`, required headers, row-scoped `+`/`-` controls, quantities, unit prices, line totals, `₫`, and locale-independent thousands separators.
- TC02: logs in as the external seeded user, snapshots authenticated `/api/cart`, exercises GET and POST for missing, malformed, and genuinely expired JWT partitions, records status/body diagnostics, and deep-compares the final authenticated cart with the baseline.
- TC03: clicks the same heading-scoped product card exactly twice from a fresh context. Verifies one product row, quantity two, doubled line amount, and cart total equal to all displayed line amounts.
- TC04: adds one target product once, requires an exact row-scoped `+` button, captures pre-interaction row/quantity/line/total state, clicks once, and verifies the `n → n+1` quantity and corresponding line/sum/cart-total deltas without changing row count.

Static validation completed successfully:

- JSON parsing and structural checks
- Expired JWT signature/expiry verification
- Strict TypeScript typechecking
- Exactly four FR-07 test declarations
- No FR-01 diff

No Playwright tests ran and no SUT was started. No SUT, database, evidence, configuration, documentation, package, or audit file was modified. The two pre-existing untracked `ai-audit` files remained untouched. No pass, failure, or defect result is claimed.