# Interaction 0017

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T13:13:05Z

## Exact prompt

```text
Correct the rejected FR-07 increment 3 proposal for exactly FR07-TC09 through FR07-TC12.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- playwright.config.ts
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- ai-audit/prompts/0016-complete-fr07-cart.txt
- ai-audit/outputs/0016-complete-fr07-cart.md
- ai-audit/entries/0016-complete-fr07-cart.md
- ai-audit/artifacts/0016-rejected-fr07-increment3/fr07-cart.json
- ai-audit/artifacts/0016-rejected-fr07-increment3/fr07-cart.spec.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/cart.page.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/catalog.page.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/product-detail.page.ts
- ai-audit/artifacts/0016-rejected-fr07-increment3/data-loader.ts
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

The 0016 proposal was rejected for these specific reasons:
1. TC12 declares targetProduct.quantity but never uses it, so it does not prove that exactly one unit is submitted.
2. visualAddFeedback accepts any existing alert or status and lacks a before/after feedback delta.
3. semanticCartBadge searches the whole parent navigation, so an unrelated numeric element can be mistaken for the cart badge.
4. TC09 and TC12 repeat soft count and visibility waits for missing locators, risking exhaustion of the test budget before independent evidence completes.

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Required corrections:

TC12 visible quantity:
- Use targetProduct.quantity from external JSON.
- Scope the quantity control to the displayed target Product Detail.
- Establish a web-first visible quantity-control prerequisite.
- Set or verify the visible quantity as exactly the external value 1, then assert its displayed value before Add.
- Activate the visible Product Detail Add control exactly once.
- Do not retry, compensate, or perform a second Add if the SUT ignores the first activation.

TC12 feedback transition:
- Capture a pre-action feedback baseline before clicking Add.
- A pre-existing unchanged alert, status, or unrelated notification must never satisfy the post-action oracle.
- After the one Add activation, require an externally observable transition:
  - a new or changed semantic alert/status associated with the action; or
  - a change in the scoped Add control’s visible text or relevant accessible state such as disabled, aria-disabled, aria-pressed, or aria-busy.
- Compare post-action evidence with the captured baseline.
- Keep feedback wording unspecified because exact wording is EVIDENCE MISSING.
- Missing feedback must remain a failure without preventing independent image-alt or badge evidence.

TC12 cart badge association:
- Do not search all numeric text in the navigation or the unrestricted parent of the cart link.
- A badge may qualify only when it is a numeric descendant of the Giỏ hàng link or is explicitly associated with that link through an accessible relationship such as aria-describedby or aria-labelledby.
- Keep badge parsing strict and guarded.
- Missing initial or updated badge must fail its own soft assertion but must not block quantity, image-alt, Add, or feedback evidence.
- If both badge observations exist, verify the external initial value and exact +1 delta.

TC09 and TC12 evidence budget:
- Avoid unconditional toBeVisible calls after a soft count assertion has already shown that a locator is absent.
- Guard visibility and value reads behind the externally expected count.
- Add test.slow() to TC09 and TC12 because they intentionally collect several independent soft requirement failures.
- Keep breadcrumb, navbar current state, required label, navigation destination, image alt, quantity, feedback, and badge observations independently reachable.

Preservation requirements:
- Keep exactly twelve FR07 test declarations.
- Preserve FR07-TC01 through FR07-TC08 byte-for-byte.
- Preserve the accepted isolation between TC05-TC08 label-independent totals and TC10 exact-label totals.
- Preserve TC10 and TC11 from the rejected proposal unless a correction is strictly necessary.
- Preserve external JSON keys and IDs:
  - cart_navigation -> FR07-TC09
  - cart_total_formatting -> FR07-TC10
  - empty_cart -> FR07-TC11
  - product_detail_add_to_cart -> FR07-TC12
- Do not weaken any oracle.
- Do not add arbitrary waits, retries, skips, fixmes, storage injection, mocking, React-internal access, or duplicate-click helpers.
- Remain strict TypeScript-compatible and Playwright 1.62.1-compatible.
- Do not modify SUT, FR-01, audit, evidence, database, configuration, documentation, or package files.

Static validation only:
- Parse and validate all 12 external JSON records and sequential IDs.
- Run npm run typecheck.
- Use Playwright --list for TC09-TC12 without executing tests.
- Confirm exactly 12 FR07 declarations.
- Confirm TC01-TC08 are byte-identical to the 0016 rejected artifact.
- Confirm TC10-TC11 remain unchanged unless explicitly justified.
- Confirm TC12 consumes targetProduct.quantity and contains exactly one Add activation.
- Confirm the feedback oracle compares before and after states.
- Confirm the badge locator cannot select unrelated numeric navigation content.
- Scan forbidden patterns and run whitespace checks.
- Confirm no prohibited file changed beyond changes already present before this correction.

After editing, report:
- exact automation files changed relative to the 0016 rejected artifact;
- how TC12 proves visible quantity 1 before exactly one Add;
- how feedback before/after transition is established;
- how the badge is semantically associated with Giỏ hàng;
- how TC09/TC12 avoid evidence-budget exhaustion;
- retained TC09-TC12 oracles;
- static validation performed;
- confirmation that no browser/API test ran and no prohibited file was modified.
```

## Exact AI output

```text
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
```

## Human review/action

Từ chối output 0017. Human action: Tôi đã review correction diff và xác nhận feedback baseline/delta, badge association, test.slow cùng guarded visibility đã được sửa đúng. Tuy nhiên TC12 vẫn dùng soft assertions cho quantity count, visibility và value rồi thực hiện Add vô điều kiện. Vì vậy quantity chưa phải hard fixture prerequisite và post-Add feedback/badge evidence có thể được thu dưới trạng thái không bảo đảm đúng một đơn vị. Cần lưu proposal 0017 làm rejected artifact và sửa quantity thành hard web-first prerequisite hoặc đặt bằng visible control rồi hard-assert trước đúng một Add activation. Chưa chạy Playwright browser/API test và SUT không bị sửa.
