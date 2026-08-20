Corrected the rejected FR-07 increment 2 proposal.

Changed relative to the 0014 artifact:

- [tests/data/fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json:182)
- [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts:452)
- [tests/pages/cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts:334)
- [tests/support/data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:359)

`catalog.page.ts` and `product-detail.page.ts` remain byte-identical to the rejected proposal.

The summary amount is now located inside the cart’s semantic `main` view, using a currency-only displayed value explicitly excluded from table descendants. Thus line amounts cannot satisfy the locator, and TC05–TC08 do not reference `expected.totalLabel`, `Tổng cộng`, or `Tổng tạm tính`. Web-first visibility and amount assertions precede numeric Page Object reads.

Retained behavior:

- TC05 performs exactly one visible Product Detail Add activation. Its two-row, target-quantity-2, comparison-quantity-1, and row-scoped-minus prerequisites remain hard failures. It verifies target quantity/line halving, unchanged comparison row, unchanged row count, line-sum consistency, expected total, and numeric delta.
- TC06 assesses the delete action as semantically red, requires an accessible dialog, and preserves the complete numeric state while awaiting a decision and after dismissal.
- TC07 discovers cancel/dismiss semantically and verifies dialog closure plus unchanged row identity, quantity, line amount, line sum, and total.
- TC08 discovers confirmation semantically, verifies only the selected row disappears, preserves the comparison row, checks the expected total and remaining line sum, and verifies the visible badge count.

Static validation passed:

- JSON parsed and TC05–TC08 fixture arithmetic/counts validated.
- `npm run typecheck` passed.
- Playwright `--list` reported exactly TC05–TC08 without executing them.
- Exactly eight FR07 test declarations remain.
- Forbidden-pattern scan passed.
- FR07-TC01–TC04 remain unchanged relative to 0014.
- Scope comparison found no new SUT, FR-01, audit, evidence, database, configuration, documentation, or package changes.

No browser or API tests were run.