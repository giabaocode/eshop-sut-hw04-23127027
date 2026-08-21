Corrected exactly one file: [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts:1505).

TC12 now hard-requires this sequence before Add:

1. Exact external `quantityControls` count.
2. Scoped quantity control visibility.
3. Displayed value equal to `String(testCase.targetProduct.quantity)`.

The existing value is retained only after that hard assertion. Feedback baseline capture remains after these prerequisites and before Add.

Confirmed:

- Exactly one TC12 `addToCartOnce` call.
- Its unchanged helper contains exactly one click.
- No retry or compensating Add.
- Exactly 12 FR07 declarations.
- TC01–TC11 are byte-identical to the 0017 artifact.
- The diff is confined to TC12’s quantity prerequisite block.
- All other 0017 automation files are byte-identical to their artifacts.
- Forbidden-pattern scan and `git diff --check` passed.
- `npm run typecheck` passed.
- Playwright `--list` found exactly TC09–TC12 for Chromium.

No browser/API test ran, and no prohibited file was changed.