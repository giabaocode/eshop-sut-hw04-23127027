# Interaction 0015

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T11:20:40Z

## Exact prompt

```text
Correct the rejected FR-07 increment 2 proposal for exactly FR07-TC05 through FR07-TC08.

Read and preserve:
- docs/hw04-traceability-test-matrix.md
- README.md
- playwright.config.ts
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- ai-audit/prompts/0014-fr07-cart-controls-delete.txt
- ai-audit/artifacts/0014-rejected-fr07-increment2/fr07-cart.json
- ai-audit/artifacts/0014-rejected-fr07-increment2/fr07-cart.spec.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/cart.page.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/catalog.page.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/product-detail.page.ts
- ai-audit/artifacts/0014-rejected-fr07-increment2/data-loader.ts
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

The 0014 proposal was rejected because TC05-TC08 used the exact required label "Tổng cộng" to locate the displayed cart total before their target actions. That exact-label requirement belongs to FR07-TC10. On a SUT using another label, TC06-TC08 would stop before exercising their dialog, cancel, confirm, and badge oracles.

Modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/cart.page.ts
- tests/pages/catalog.page.ts
- tests/pages/product-detail.page.ts
- tests/support/data-loader.ts

Do not modify SUT source, FR-01 automation, documentation, configuration, package files, database, evidence, or ai-audit files. Do not run browser or API tests.

Correction requirements:

1. Preserve exactly eight FR07 test declarations total and exactly one declaration for each FR07-TC05 through FR07-TC08. Keep IDs, titles, fixtures, prices, quantities, expected numeric totals, expected row counts, dialog action vocabulary, and badge counts in external JSON.

2. Preserve FR07-TC01 through FR07-TC04 unchanged in intent and assertion strength.

3. TC05-TC08 must read and compare the displayed cart summary amount without asserting or requiring an exact summary label. Do not use expected.totalLabel, "Tổng cộng", or "Tổng tạm tính" as the prerequisite locator for these four tests.

4. Keep the summary locator scoped to the cart view and distinguish the summary amount from table line amounts. Avoid brittle CSS chains and arbitrary positional selectors. Prefer web-first assertions before Page Object value reads.

5. Do not encode "Tổng tạm tính" as accepted expected behavior. FR07-TC10 will independently assert that the exact required label is "Tổng cộng".

6. TC05 must keep its visible Product Detail quantity fixture, quantity 2, and exactly one Add-to-cart activation. Do not retry, double-click, compensate, inject storage, or access React internals. If that visible fixture does not create the required cart state, its decrement action and later assertions must remain EVIDENCE NOT REACHED rather than being bypassed.

7. TC05 must retain the two-product fixture and hard prerequisites, then require the row-scoped minus control and verify only the target changes from quantity 2 to 1, its line amount halves, the comparison row remains unchanged, row count remains unchanged, and displayed cart total equals the remaining line sum and expected numeric delta.

8. TC06 must retain the red dangerous-action assessment and require an accessible dialog before deletion. The selected row and complete numeric cart state must remain unchanged while the dialog awaits a decision and after dismissing it.

9. TC07 must retain semantic cancel/dismiss discovery and verify the dialog closes while row identity, quantity, line amount, line sum, and displayed cart total remain unchanged.

10. TC08 must retain semantic confirm discovery and verify only the selected row disappears after confirmation, the comparison row remains unchanged, displayed cart total equals the remaining line sum and expected numeric total, and the visible cart badge has the expected count.

11. Keep row-scoped controls, accessible dialog roles, semantic dialog actions, dangerous red-color assessment, cart badge behavior, and stable state reads in Page Objects. Keep TypeScript strict-compatible and Playwright 1.62.1-compatible.

12. Do not use waitForTimeout, arbitrary sleeps, test.skip, test.fixme, conditional requirement bypasses, retries that compensate for SUT behavior, getByLabel for unlabeled DOM, exact dialog wording, unsupported matchers, or direct SUT-state injection.

Perform static validation only:
- parse the JSON and verify fixture arithmetic;
- run npm run typecheck;
- list the four increment-2 tests without executing them;
- confirm exactly eight FR07 declarations;
- confirm forbidden patterns are absent;
- confirm no SUT, FR-01, audit, evidence, database, configuration, documentation, or package file changed.

After editing, report:
- exact automation files changed relative to the current rejected proposal;
- how the cart summary amount is located without asserting its label;
- confirmation that TC05 still performs exactly one visible Add activation;
- the retained TC05-TC08 oracles;
- static validation performed;
- confirmation that no tests were run and no prohibited file was modified.

```

## Exact AI output

```text
Corrected the rejected FR-07 increment 2 proposal.

Changed relative to the 0014 artifact:

- [tests/data/fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json:182)
- [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts:452)
- [tests/pages/cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts:334)
- [tests/support/data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts:359)

`catalog.page.ts` and `product-detail.page.ts` remain byte-identical to the rejected proposal.

The summary amount is now located inside the cart’s semantic `main` view, using a currency-only displayed value explicitly excluded from table descendants. Thus line amounts cannot satisfy the locator, and TC05–TC08 do not reference `expected.totalLabel`, `Tổng cộng`, or `Tổng tạm tính`. Web-first visibility and amount assertions precede numeric Page Object reads.

Retained behavior:

- TC05 performs exactly one visible Product Detail Add activation. Its two-row, target-quantity-2, comparison-quantity-1, and row-scoped-minus prerequisites remain hard failures. It verifies target quantity/line halving, unchanged comparison row, unchanged row count, line-sum consistency, expected total, and numeric delta.
- TC06 assesses the delete action as semantically red, requires an accessible dialog, and preserves the complete numeric state while awaiting a decision and after dismissal.
- TC07 discovers cancel/dismiss semantically and verifies dialog closure plus unchanged row identity, quantity, line amount, line sum, and total.
- TC08 discovers confirmation semantically, verifies only the selected row disappears, preserves the comparison row, checks the expected total and remaining line sum, and verifies the visible badge count.

Static validation passed:

- JSON parsed and TC05–TC08 fixture arithmetic/counts validated.
- `npm run typecheck` passed.
- Playwright `--list` reported exactly TC05–TC08 without executing them.
- Exactly eight FR07 test declarations remain.
- Forbidden-pattern scan passed.
- FR07-TC01–TC04 remain unchanged relative to 0014.
- Scope comparison found no new SUT, FR-01, audit, evidence, database, configuration, documentation, or package changes.

No browser or API tests were run.
```

## Human review/action

Chấp nhận output 0015. Human action: Tôi đã review correction và xác nhận FR07-TC05 đến FR07-TC08 không còn dùng exact label “Tổng cộng” hoặc “Tổng tạm tính” để định vị cart total. Summary amount được tìm trong semantic main của cart bằng currency-only regex được neo toàn chuỗi và loại mọi table descendant, nên line amount không thể thỏa locator; exact-label oracle vẫn dành riêng cho FR07-TC10. TC05 giữ đúng một visible Product Detail Add activation cùng các hard fixture prerequisites, không retry hoặc bù hành vi. TC06 giữ red-action và dialog-before-delete oracle; TC07 giữ cancel/no-mutation oracle; TC08 giữ confirmed-delete, total, remaining-row và badge oracle. FR07-TC01 đến FR07-TC04 không bị làm yếu. External JSON có đúng bốn key FR07-TC05 đến FR07-TC08 và không chứa total-label dependency. Typecheck thành công, Playwright chỉ liệt kê đúng 8 FR07 test, forbidden-pattern và whitespace scans đều sạch. Chưa chạy browser/API test và không sửa SUT, FR-01, database, evidence, configuration, documentation hoặc package files.
