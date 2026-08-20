# Interaction 0014

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol). The initial Codex CLI 0.147.0 attempt was aborted by a model-cache incompatibility; the user authorized updating the CLI before the successful final execution.

## ISO date/time

2026-08-20T10:49:08Z

## Exact prompt

```text
Extend the existing reviewed FR-07 Playwright automation with increment 2 covering exactly FR07-TC05 through FR07-TC08.

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
- tests/support/data-loader.ts

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Do not modify SUT source, FR-01 automation, documentation, configuration, package files, evidence, database files, or ai-audit files. Do not run Playwright tests.

Add exactly four test declarations whose IDs and titles come from external JSON:
- FR07-TC05: decrement quantity from 2 to 1 and recalculate totals.
- FR07-TC06: dangerous delete action is red and opens confirmation before removal.
- FR07-TC07: cancelling deletion preserves the complete cart state.
- FR07-TC08: confirming deletion removes only the selected row and updates total and cart badge.

Add these exact external JSON keys:
- quantity_decrement_above_minimum
- deletable_item
- deletion_cancel
- deletion_confirm

General rules:
1. Keep IDs, titles, paths, product identities, prices, quantities, labels, action semantics, expected counts, expected totals, and fixture values in external JSON. Do not add inline test-case arrays or duplicate case data in the spec.
2. Build all UI cart fixtures through visible user interactions in a fresh Playwright context. Do not mutate React internals, inject cart state, call implementation functions, mock cart behavior, or modify the SUT.
3. Preserve FR07-TC01 through FR07-TC04 unchanged in intent and assertion strength, including the reviewed interaction-0013 stabilization.
4. Preserve FR01-TC01 through FR01-TC12 unchanged.
5. Keep locators page- and row-scoped. Prefer accessible roles and names. Avoid brittle CSS chains, positional selectors when semantic scoping is available, and implementation-only selectors.
6. Do not use waitForTimeout, arbitrary sleeps, test.skip, test.fixme, retries, compensating duplicate clicks, conditional requirement bypasses, or unsupported Playwright matchers.
7. Exact dialog, cancel, confirmation, toast, and success wording is EVIDENCE MISSING. Do not assert invented exact wording.
8. Use web-first assertions before reading numeric or geometric state.
9. Do not change the SUT to make tests pass and do not claim pass/fail or a defect because no execution is authorized in this interaction.

TC05 — quantity_decrement_above_minimum:
- Construct a two-product cart so “only the selected row changes” is observable.
- For the target product, use its visible Product Detail quantity control to enter 2 and activate Add to cart exactly once.
- Do not double-click, retry, or compensate if the current SUT ignores the activation.
- Add one distinct comparison product once through the visible UI.
- Navigate through the visible cart link.
- Hard prerequisites must establish exactly two rows, exactly one target row at quantity 2, exactly one comparison row at quantity 1, and exactly one row-scoped `-` control for the target.
- Capture row count, both quantities, both line amounts, and displayed cart total only after web-first prerequisites.
- Click the target row’s `-` exactly once.
- Assert row count is unchanged; target quantity changes 2 to 1; target line amount decreases by one target unit price; comparison quantity and line amount are unchanged; cart total decreases by one target unit price and equals the sum of displayed line amounts.
- Do not infer behavior at quantity 1.

TC06 — deletable_item:
- Add exactly one externally defined product once through the visible Home UI and open the cart.
- Hard prerequisites must establish the target row and its row-scoped delete action.
- Assess the computed dangerous-action color semantically as red without asserting an exact shade.
- Capture row count, target quantity, target line amount, and cart total.
- Activate Delete exactly once without confirming.
- Require a visible accessible confirmation dialog before deletion.
- While the dialog awaits a decision, assert the target row and captured cart state remain unchanged.
- Close or cancel the dialog after assertions so this case intentionally performs no deletion.

TC07 — deletion_cancel:
- Add exactly one externally defined product once through the visible Home UI and open the cart.
- Capture the complete baseline: row count, target row, quantity, line amount, displayed cart total, and sum of displayed line amounts.
- Open the accessible confirmation dialog through the target row’s delete action.
- Locate the semantic cancel/dismiss action supplied by the dialog without asserting one invented exact label. Keep any locator vocabulary or action semantics in external JSON.
- Activate cancel/dismiss once.
- Assert the dialog closes and the complete captured cart state is unchanged.

TC08 — deletion_confirm:
- Add two distinct externally defined products once each through the visible Home UI and open the cart.
- Capture both row states, deleted-row line amount, remaining-row state, row count, and displayed cart total.
- Open the accessible confirmation dialog from the selected row.
- Locate the semantic confirm/destructive action without asserting invented exact dialog wording. Keep locator vocabulary or action semantics in external JSON.
- Confirm exactly once.
- Assert the dialog closes, only the selected row disappears, the other row quantity and line amount remain unchanged, row count decreases by one, displayed cart total decreases by the deleted line amount, and the resulting total equals the sum of remaining displayed line amounts.
- Assert the cart navbar badge is visible and reflects the externally defined remaining cart count. Do not invent a badge or silently skip this requirement if the current SUT lacks one.

Page Object expectations:
- Reuse current CartPage and CatalogPage behavior where appropriate.
- Add a ProductDetailPage only if needed for TC05’s visible quantity fixture.
- Add robust helpers for a row-scoped delete action, accessible confirmation dialog, semantic cancel/confirm actions, dangerous red-color assessment, cart badge lookup/parsing, and stable cart-state reads.
- Keep product-detail quantity and Add controls scoped to the displayed product view.
- Prefer Playwright web-first assertions in the spec; Page Object methods may read values only after those prerequisites.

Keep TypeScript strict-compatible and Playwright 1.62.1-compatible. The final FR07 spec must contain exactly eight FR07 test declarations total.

After editing, report:
- exact files changed;
- the four added JSON keys and generated IDs;
- the TC05 two-product fixture and state-delta oracle;
- the TC06 dialog-before-delete oracle;
- the TC07 cancel/no-mutation oracle;
- the TC08 confirmed-delete, total, and badge oracle;
- static validation performed;
- confirmation that no tests were run and no SUT, FR-01, audit, evidence, database, configuration, documentation, or package file was modified.

```

## Exact AI output

```text
Implemented FR-07 increment 2 with exactly eight total FR-07 test declarations.

Changed automation files:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [product-detail.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/product-detail.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

Added JSON records:

- `quantity_decrement_above_minimum` → `FR07-TC05`
- `deletable_item` → `FR07-TC06`
- `deletion_cancel` → `FR07-TC07`
- `deletion_confirm` → `FR07-TC08`

Oracles implemented:

- TC05: AirPods quantity 2 plus one Keychron comparison row; verifies rows remain 2, AirPods quantity `2 → 1`, line amount `12,000,000 → 6,000,000`, Keychron remains quantity 1/`4,000,000`, and total `16,000,000 → 10,000,000`.
- TC06: verifies the iPhone delete action is semantically red, deletion does not happen before an accessible confirmation dialog appears, and the full `30,000,000` cart state remains unchanged while awaiting—and after dismissing—the dialog.
- TC07: captures the complete one-row Samsung baseline and verifies dialog cancellation preserves row count, identity, quantity, line amount, line sum, and `28,000,000` total.
- TC08: deletes only AirPods from an AirPods/Keychron cart, verifies rows `2 → 1`, total `10,000,000 → 4,000,000`, unchanged Keychron state, remaining-line sum consistency, and a visible cart badge count of `1`.

Static validation completed:

- `npm run typecheck` passed.
- JSON parsing and fixture arithmetic invariants passed.
- Confirmed exactly eight FR-07 declarations and one declaration for each new JSON-driven case.
- Confirmed TC01–TC04 implementation body remains byte-for-byte unchanged.
- `git diff --check` passed.
- Forbidden-pattern scan found no sleeps, skips, fixmes, retries, duplicate-click helpers, storage injection, or React cart-internal access.

No Playwright tests were run, and no execution result or SUT defect is claimed. No SUT, FR-01, audit, evidence, database, configuration, documentation, or package file was modified. The two already-untracked `ai-audit` files present at the start were left untouched.
```

## Human review/action

Từ chối output 0014. Human action: Tôi đã review increment 2 và phát hiện TC05-TC08 dùng exact label “Tổng cộng” để định vị cart total trước target action. Điều này khiến TC06-TC08 có thể bị chặn bởi requirement của FR07-TC10 trước khi dialog/delete oracles được thực thi, nên các case chưa được cô lập đúng. TC05 vẫn phải giữ visible quantity fixture và đúng một Add click, không được bù hành vi nếu fixture thất bại. Cần lưu output hiện tại làm rejected artifact và sửa locator cart summary để không khẳng định exact label; FR07-TC10 sẽ giữ exact-label oracle. Chưa chạy Playwright và SUT không bị sửa.
