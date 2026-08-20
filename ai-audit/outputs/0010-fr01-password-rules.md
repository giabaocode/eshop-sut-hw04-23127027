Implemented FR-01 increment 2 with exactly four new test declarations.

Changed files:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json:211)
- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts:287)
- [registration.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/registration.page.ts:103)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:22)

JSON keys and generated IDs:

- `password_length_boundary` → `FR01-TC05`
- `password_missing_uppercase` → `FR01-TC06`
- `password_missing_lowercase` → `FR01-TC07`
- `password_missing_digit` → `FR01-TC08`

Oracles:

- TC05: seven-character value remains on registration, shows a visible non-empty application error above submit, and records zero registration POSTs. Eight-character value records one POST and must expose the documented login heading, form, email, and password controls.
- TC06: remains on registration, visible non-empty error above submit, zero registration POSTs.
- TC07: same rejection and zero-POST oracle.
- TC08: same rejection and zero-POST oracle.

All submissions fill only `fullName`, `email`, and `password`, using collision-safe email templates. TC01–TC04 assertions remain intact.

No Playwright tests or SUT were run. Static TypeScript, JSON syntax, and diff checks completed successfully. No SUT, documentation, configuration, package, evidence, or audit file was modified; the pre-existing untracked audit files were left untouched.
