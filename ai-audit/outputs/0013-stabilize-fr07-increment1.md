Changed only [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts).

- FR07-TC01: added `test.slow()` inside the test.
- FR07-TC04: added a shared `dataRows` locator, awaited `toHaveCount(...)`, then captured `beforeRowCount` from that locator.

All four FR07 test declarations and all existing assertions remain. TypeScript typechecking completed without diagnostics. No Playwright test was run, and the SUT was neither started nor stopped.