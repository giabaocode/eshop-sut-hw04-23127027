Implemented FR-01 increment 3 with exactly 12 total test declarations.

Changed files:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json)
- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

Added JSON keys and IDs:

- `password_missing_allowed_special` — `FR01-TC09`
- `password_each_allowed_special` — `FR01-TC10`
- `confirmation_match_matrix` — `FR01-TC11`
- `api_unique_then_duplicate` — `FR01-TC12`

TC10 symbols: `@`, `$`, `!`, `%`, `*`, `?`, `&`.

TC11 decision table:

- `unequal`: `Abcdef1!` / `Abcdef1?` → remain on registration, application error above submit, zero registration POSTs.
- `equal`: `Abcdef1!` / `Abcdef1!` → reach login, exactly one registration POST.

TC12 oracle:

- First unique-email POST → status `200`, documented success message, numeric `id`.
- Capture that `id`.
- Second POST reusing the generated email → `response.ok()` is false, without asserting undocumented status or wording.

Static JSON, diff, and strict TypeScript checks passed. No tests were run. No SUT, documentation, configuration, package, evidence, page-object, or audit file was modified; existing untracked audit artifacts were left untouched.
