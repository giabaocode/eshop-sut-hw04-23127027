Implemented exactly FR01-TC01 through FR01-TC04 and created only:

- [fr01-registration.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr01-registration.json)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)
- [registration.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/registration.page.ts)
- [fr01-registration.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr01-registration.spec.ts)

Design assumptions:

- Login destination is verified semantically through login-form content, since the exact redirect URL is unspecified.
- “Blue” means the computed color’s blue channel is dominant; no exact shade is asserted.
- Email partitions use native validity state, never browser-specific messages.
- Application-error placement is checked whenever an application error is rendered; native validation need not produce one.
- Focus traversal begins at the first form control and verifies visual and Tab order through submit.
- No documented safe account-deletion interface exists, so created accounts use collision-safe runtime emails from external templates.

Per instruction, I did not run tests, servers, package commands, Git commands, or post-edit verification.