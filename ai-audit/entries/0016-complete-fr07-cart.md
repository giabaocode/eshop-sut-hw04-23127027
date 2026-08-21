# Interaction 0016

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T12:26:45Z

## Exact prompt

```text
Complete the reviewed FR-07 Playwright automation with increment 3 covering exactly FR07-TC09 through FR07-TC12.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- playwright.config.ts
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Implement exactly these external JSON records and generated test IDs:
- cart_navigation -> FR07-TC09
- cart_total_formatting -> FR07-TC10
- empty_cart -> FR07-TC11
- product_detail_add_to_cart -> FR07-TC12

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

General constraints:
- The final FR07 spec must contain exactly twelve FR07 test declarations.
- Preserve FR07-TC01 through FR07-TC08 without weakening or removing their assertions.
- Do not modify existing TC01-TC08 test bodies unless a strictly backward-compatible shared-helper adjustment is unavoidable.
- Keep IDs, titles, paths, product fixtures, labels, expected counts, currency rules, initial states, and expected state deltas in external JSON.
- Use only the visible UI for UI fixture construction and target interactions.
- Do not inject localStorage/sessionStorage, access React internals, mock the SUT, compensate for failed clicks, retry target actions, or add arbitrary waits.
- Prefer accessible locators and Playwright web-first assertions.
- Page Object value reads may occur only after suitable web-first existence/visibility/count prerequisites.
- Keep independent requirement observations reachable with soft assertions or guarded reads where one missing feature would otherwise block unrelated evidence.
- Do not invent exact wording, exact URLs, CSS classes, colors, separator characters, or feedback text where the matrix says EVIDENCE MISSING.
- Do not modify SUT source, FR-01 automation, audit files, evidence, database, configuration, documentation, or package files.

FR07-TC09:
- Build the cart_navigation fixture deterministically through the visible web UI.
- Verify the cart page is represented as a child page by a semantic breadcrumb.
- Verify the cart navbar entry exposes a programmatic current-page state, such as aria-current; do not infer current state from an unspecified CSS class.
- Independently assert the required visible “Tiếp tục mua sắm” label from external JSON.
- Because a label mismatch must not prevent the navigation oracle, identify the cart page’s semantic home-destination shopping link separately and activate it exactly once.
- Verify the resulting page is the Home page by externally defined destination identity, not by inventing an exact URL.
- Keep breadcrumb, current-state, required-label, and destination observations independently reachable.

FR07-TC10:
- Build cart_total_formatting deterministically through the visible UI with a displayed amount that requires a thousands separator.
- This is the only increment-3 case that owns the exact total-label oracle.
- Assert the summary label is exactly “Tổng cộng” and that “Tổng tạm tính” is not accepted.
- Assert the displayed total contains ₫, contains a thousands separator without inventing its locale-specific character, and numerically equals the sum of displayed line amounts.
- Keep the exact-label assertions and independent currency/arithmetic assertions reachable.
- Do not change the label-independent cart-summary helper used by FR07-TC05 through FR07-TC08; add a separate exact-label helper if needed.

FR07-TC11:
- Use the natural fresh-context empty cart; do not delete or mutate an uncontrolled user cart.
- Assert a clear non-empty empty-cart message using semantic structure and requirement-derived meaning without inventing exact wording.
- Assert a non-empty icon or illustration through semantic image evidence such as an img with meaningful alt, an accessible role=img, or an equivalently accessible illustration.
- Assert that no populated cart product row is shown.
- Keep message, illustration, and no-row assertions independently reachable.

FR07-TC12:
- Start in a fresh context with the target product absent and the externally defined known badge count.
- Navigate to the target Product Detail through the visible web UI.
- Verify every displayed target product image has a non-empty descriptive alt, including product identity where appropriate.
- Locate the visible cart badge semantically in or associated with the Giỏ hàng navigation entry.
- Missing badge evidence must fail its own assertion but must not block the independent image-alt, single Add activation, and feedback observations.
- Activate the visible Product Detail Add control exactly once. Never retry or compensate if the SUT ignores that activation.
- Assert deterministic visible add-to-cart feedback without inventing exact feedback wording; a visible semantic notification or a visible control-state/text transition is acceptable.
- If a badge is available, verify its numeric value changes from the external initial value by exactly one. Guard numeric reads so a missing badge remains a recorded failure rather than causing unrelated evidence to be skipped.
- Do not claim cart mutation unless it is externally observed.

Page Object expectations:
- Reuse CartPage, CatalogPage, and ProductDetailPage.
- Add robust helpers only where needed for semantic breadcrumb/current navigation state, the exact TC10 total label, empty-state message/illustration, Home destination identity, product image alt, visual feedback, and cart badge lookup/parsing.
- Keep exact-label and label-independent total helpers separate.
- Keep helpers generic and strict TypeScript-compatible.
- Remain compatible with Playwright 1.62.1.

Static validation only:
- Parse and validate the external JSON.
- Run npm run typecheck.
- List the four new tests with Playwright --list without executing them.
- Confirm exactly twelve FR07 declarations.
- Confirm FR07-TC01 through FR07-TC08 remain present and are not weakened.
- Confirm TC12 contains exactly one visible Add activation.
- Scan for forbidden patterns including waitForTimeout, test.skip, test.fixme, retries, duplicate-click helpers, storage injection, and React-internal access.
- Run whitespace checks on authored automation files.
- Confirm no SUT, FR-01, audit, evidence, database, configuration, documentation, or package file changed.

After editing, report:
- exact automation files changed;
- the four added JSON keys and generated IDs;
- the TC09 breadcrumb/current-state/required-label/navigation oracles;
- the TC10 exact-label/currency/arithmetic oracles;
- the TC11 message/illustration/no-row oracles;
- the TC12 image-alt/single-Add/feedback/badge-delta oracles and evidence guards;
- static validation performed;
- confirmation that no browser/API tests ran and no prohibited file was modified.
```

## Exact AI output

```text
Implemented FR-07 increment 3 with exactly FR07-TC09 through FR07-TC12.

### Files changed

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [product-detail.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/product-detail.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

### Added records and generated IDs

- `cart_navigation` → `FR07-TC09`
- `cart_total_formatting` → `FR07-TC10`
- `empty_cart` → `FR07-TC11`
- `product_detail_add_to_cart` → `FR07-TC12`

### Oracles

- TC09: named semantic breadcrumb containing the current cart page; navbar `aria-current="page"`; independent exact `Tiếp tục mua sắm` assertion; separate meaning-based shopping link activated once; Home identified by its external heading rather than URL.
- TC10: exact `Tổng cộng` label and explicit rejection of `Tổng tạm tính`; `₫`; locale-agnostic thousands-separator detection; displayed total equals the external expected value and sum of displayed line amounts.
- TC11: natural fresh-context cart; meaningful semantic empty message; accessible named illustration; zero populated product rows.
- TC12: every visible target image has non-empty alt containing product identity; guarded semantic badge reads; exactly one visible Product Detail Add activation; semantic notification or control transition feedback; available badge must equal external initial count plus one. Missing badge evidence remains a soft failure and does not block other observations.

### Static validation

- Parsed and validated exactly 12 unique JSON records and sequential IDs `FR07-TC01`–`FR07-TC12`.
- `npm run typecheck` passed.
- Playwright `--list` returned exactly the four new Chromium tests.
- Confirmed exactly 12 FR-07 test declarations.
- TC01–TC08 bodies are unchanged; the diff contains additions only.
- Confirmed TC12 has one `addToCartOnce` call, whose helper contains one click.
- Forbidden-pattern scan found no matches.
- `git diff --check` passed.
- Tracked changes are limited to the six allowed automation files.

No browser or API tests were executed. No SUT, FR-01, audit, evidence, database, configuration, documentation, or package file was modified. The three pre-existing untracked `ai-audit` files were left untouched.
```

## Human review/action

Từ chối output 0016. Human action: Tôi đã review toàn bộ diff FR-07 increment 3 và phát hiện TC12 chưa sử dụng targetProduct.quantity nên chưa chứng minh Add đúng một đơn vị. visualAddFeedback có thể chấp nhận alert hoặc status tồn tại trước thao tác nên thiếu before/after feedback delta. semanticCartBadge tìm số trong toàn bộ parent navigation nên chưa chứng minh số đó thực sự thuộc hoặc được liên kết với Giỏ hàng. Ngoài ra TC09 và TC12 lặp soft count/visibility trên locator bị thiếu, có nguy cơ hết test budget trước khi hoàn thành các oracle độc lập. Cần lưu proposal hiện tại làm rejected artifact và sửa bằng visible quantity prerequisite, feedback state transition, badge association chặt chẽ, cùng guarded visibility hoặc test.slow phù hợp. Chưa chạy Playwright browser/API test và SUT không bị sửa.
