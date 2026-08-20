Corrected exactly these four files:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json)
  - Added external `id`, `title`, and selected `fieldsToFill` data.
  - Configured TC03 to fill every required non-email-validity control, including confirmation.

- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)
  - Typed case identity and field-selection properties.

- [registration.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/registration.page.ts)
  - Replaced registration/login `getByLabel` locators with anchored, escaped, case-insensitive label-to-container-to-input locators.
  - Added anchored case-insensitive accessible-name patterns for headings and submit buttons.
  - Replaced unconditional filling with externally driven selected-field filling.
  - Expanded application-error discovery to semantic candidates and the visible non-heading sibling immediately preceding the form.

- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts)
  - Builds all four test titles from external JSON `id` and `title`.
  - Uses external field selections.
  - Explicitly asserts the required confirmation control in TC01, TC02, and TC04.
  - Preserves all existing requirement assertions and error-placement checks.

No tests, servers, package commands, Git commands, or commits were run.