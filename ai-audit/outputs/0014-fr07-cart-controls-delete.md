Implemented FR-07 increment 2 with exactly eight total FR-07 test declarations.

Changed automation files:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [product-detail.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/product-detail.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

Added JSON records:

- `quantity_decrement_above_minimum` → `FR07-TC05`
- `deletable_item` → `FR07-TC06`
- `deletion_cancel` → `FR07-TC07`
- `deletion_confirm` → `FR07-TC08`

Oracles implemented:

- TC05: AirPods quantity 2 plus one Keychron comparison row; verifies rows remain 2, AirPods quantity `2 → 1`, line amount `12,000,000 → 6,000,000`, Keychron remains quantity 1/`4,000,000`, and total `16,000,000 → 10,000,000`.
- TC06: verifies the iPhone delete action is semantically red, deletion does not happen before an accessible confirmation dialog appears, and the full `30,000,000` cart state remains unchanged while awaiting—and after dismissing—the dialog.
- TC07: captures the complete one-row Samsung baseline and verifies dialog cancellation preserves row count, identity, quantity, line amount, line sum, and `28,000,000` total.
- TC08: deletes only AirPods from an AirPods/Keychron cart, verifies rows `2 → 1`, total `10,000,000 → 4,000,000`, unchanged Keychron state, remaining-line sum consistency, and a visible cart badge count of `1`.

Static validation completed:

- `npm run typecheck` passed.
- JSON parsing and fixture arithmetic invariants passed.
- Confirmed exactly eight FR-07 declarations and one declaration for each new JSON-driven case.
- Confirmed TC01–TC04 implementation body remains byte-for-byte unchanged.
- `git diff --check` passed.
- Forbidden-pattern scan found no sleeps, skips, fixmes, retries, duplicate-click helpers, storage injection, or React cart-internal access.

No Playwright tests were run, and no execution result or SUT defect is claimed. No SUT, FR-01, audit, evidence, database, configuration, documentation, or package file was modified. The two already-untracked `ai-audit` files present at the start were left untouched.