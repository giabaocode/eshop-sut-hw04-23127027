# Interaction 0007

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T12:32:41Z

## Exact prompt

````text
Act as a correction-only editor for the rejected FR-01 increment. Modify exactly these four files and no others: tests/data/fr01-registration.json, tests/support/data-loader.ts, tests/pages/registration.page.ts, tests/features/fr01-registration.spec.ts. Preserve logical scope FR01-TC01 through FR01-TC04 and all hard requirement assertions. Apply these human-reviewed fixes only. Add id and title to each of the four top-level external JSON cases, type them, and construct every Playwright test title from those JSON values rather than hardcoding IDs/titles in the spec. Replace getByLabel-based registration and login input locators: source labels are unassociated siblings, so locate each label inside its form using an escaped anchored case-insensitive pattern, move to its containing element, and then locate the corresponding input. Use anchored case-insensitive accessible-name patterns for form submit buttons and headings so capitalization does not make the form locator empty; do not weaken actual required text assertions. Replace the unconditional fill method with a selected-field method whose field list comes from external JSON. TC01, TC02, and TC04 must still clearly assert the required confirmation control; TC03 must fill only the externally configured fields needed to isolate email validity and must not fail first because confirmation is absent. Improve application-error discovery to include visible non-heading siblings immediately before the form as well as semantic alert/live/error candidates, without relying on exact undocumented error wording; placement above submit must still be asserted whenever such an application error exists. Keep data external, collision-safe email generation, no fixed sleeps, no inline test-case arrays/objects, and no test.skip/test.fail/conditional pass. Do not modify SUT source or weaken assertions to match the current implementation. Do not run tests, servers, package commands, Git commands, or commits. Summarize exact corrections.
````

## Exact AI output
````text
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
````

## Human review/action
Tôi đã đối chiếu correction với prompt và phát hiện email_format_partitions.fieldsToFill vẫn chứa confirmationPassword, nên TC03 chưa cô lập đúng email validity. Tôi yêu cầu bỏ confirmationPassword khỏi riêng field list của TC03, giữ nguyên confirmation assertions ở TC01, TC02 và TC04, không thay đổi requirement assertions hoặc source SUT. Chưa chạy test và chưa có defect claim.
