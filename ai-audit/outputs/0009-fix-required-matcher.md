Updated only [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts).

Exact replacements:

- Lines 29, 67, and 189:
  `expect(registration.confirmationPasswordInput).toBeRequired()`
  → `expect(registration.confirmationPasswordInput).toHaveAttribute("required", "")`

- Line 72:
  `expect(input, \`Required ${field} control must be marked required\`).toBeRequired()`
  → `expect(input, \`Required ${field} control must be marked required\`).toHaveAttribute("required", "")`

No tests were run. No other assertions or files were changed.