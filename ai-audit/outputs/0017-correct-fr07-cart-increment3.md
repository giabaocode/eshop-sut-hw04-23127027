Corrected the rejected FR-07 increment 3 proposal.

Changed relative to the 0016 artifact:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [product-detail.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/product-detail.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

`catalog.page.ts` remains byte-identical to the rejected artifact.

Key corrections:

- TC12 scopes the spinbutton to the Product Detail main containing the target product heading. It requires the external `quantityControls: 1`, guards visibility behind that count, and asserts the displayed value equals `String(targetProduct.quantity)`—external value `1`—before Add.
- TC12 calls `addToCartOnce` exactly once; that helper contains exactly one `.click()`. No compensating or repeated Add exists.
- Feedback baseline is captured before Add, including visible target-detail alert/status elements and the exact Add control’s text, disabled state, `aria-disabled`, `aria-pressed`, and `aria-busy`.
- Post-action feedback must differ from that baseline through a new/changed scoped semantic signal or a changed state/text on the same Add control. Unchanged pre-existing feedback cannot pass. The soft post-action observation does not prevent badge evidence.
- Badge lookup now accepts only strict numeric descendants of the `Giỏ hàng` link or strict numeric elements referenced by that link through `aria-describedby`/`aria-labelledby`. The unrestricted parent-navigation search was removed.
- Initial and updated badge count/visibility/parsing are guarded. Both available observations prove the external initial value and exact `+1` delta.
- TC09 and TC12 use `test.slow()`. Visibility and value reads are conditional on externally expected locator counts, avoiding repeated waits for absent elements.

Retained oracles:

- TC09: semantic breadcrumb, navbar current state, exact required label, independent shopping-destination activation, and Home heading identity.
- TC10: exact `Tổng cộng`, rejection of `Tổng tạm tính`, currency symbol, thousands separator, expected total, and displayed arithmetic.
- TC11: natural empty state, meaningful message, accessible illustration, and zero product rows.
- TC12: image alt, visible quantity `1`, one Add, feedback transition, and associated badge delta.

Static validation passed:

- Parsed and validated 12 JSON records with sequential unique IDs `FR07-TC01`–`FR07-TC12`.
- `npm run typecheck`.
- Playwright `--list` returned exactly TC09–TC12 for Chromium.
- Exactly 12 FR07 test declarations.
- TC01–TC08 byte-identical to the rejected artifact.
- TC10–TC11 byte-identical to the rejected artifact.
- Confirmed external quantity consumption, one Add activation, baseline-before-Add ordering, post-action comparison, and restricted badge association.
- Forbidden-pattern scan found no matches.
- `git diff --check` passed.
- Final changed-path set matches the pre-correction baseline; pre-existing audit changes were untouched, and no prohibited file was newly modified.

No browser or API test was executed.