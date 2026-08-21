# Interaction 0018

## AI tool

OpenAI Codex CLI 0.148.0 (model: gpt-5.6-sol)

## ISO date/time

2026-08-20T13:41:36Z

## Exact prompt

```text
Apply one narrow final correction to the rejected FR-07 increment 3 proposal.

Read:
- docs/hw04-traceability-test-matrix.md
- ai-audit/entries/0017-correct-fr07-cart-increment3.md
- ai-audit/artifacts/0017-rejected-fr07-increment3/fr07-cart.spec.ts
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/product-detail.page.ts

The 0017 proposal correctly fixed:
- TC09 and TC12 evidence budgets with test.slow and guarded reads;
- TC12 feedback before/after transition;
- TC12 semantic cart-badge association;
- TC12 external quantity field/type declarations;
- preservation of TC01-TC08 and TC10-TC11.

The only remaining defect is that TC12 uses soft assertions for the quantity count, visibility, and value, then performs Add even when the one-unit fixture is invalid.

Modify only:
- tests/features/fr07-cart.spec.ts

Required narrow correction:
- In FR07-TC12, make the target Product Detail quantity control a hard web-first fixture prerequisite before the Add action.
- Require exactly the external expected quantity-control count.
- Require the scoped quantity control to be visible.
- Use the existing visible ProductDetailPage quantity interaction to set targetProduct.quantity exactly once, or retain the current value only if it is hard-asserted.
- Hard-assert the displayed value equals String(testCase.targetProduct.quantity) before Add.
- Only after all quantity prerequisites pass, capture the feedback baseline and activate Add.
- Keep exactly one addToCartOnce call and exactly one click inside that helper.
- Never retry or compensate if the Add activation is ignored.

Preservation:
- Keep FR07-TC01 through FR07-TC11 byte-identical to the 0017 rejected artifact.
- Within TC12, keep image-alt, initial badge, feedback baseline/delta, updated badge, test.slow, guarded reads, and all other assertions unchanged.
- Do not modify JSON, Page Objects, data-loader, SUT, FR-01, audit, evidence, database, configuration, documentation, or package files.
- Do not weaken any oracle.
- Do not add waits, retries, skips, fixmes, storage injection, mocks, React-internal access, or duplicate Add actions.
- Keep exactly twelve FR07 test declarations.
- Remain strict TypeScript-compatible and Playwright 1.62.1-compatible.

Static validation only:
- Run npm run typecheck.
- Use Playwright --list for TC09-TC12 without executing tests.
- Confirm the only automation file changed relative to the 0017 rejected artifact is tests/features/fr07-cart.spec.ts.
- Confirm the correction diff is limited to the TC12 quantity prerequisite block.
- Confirm TC01-TC11 are byte-identical to the 0017 artifact.
- Confirm TC12 consumes targetProduct.quantity through a hard visible prerequisite before exactly one Add.
- Confirm feedback baseline remains before Add.
- Confirm forbidden-pattern and whitespace checks pass.

After editing, report:
- the exact file changed;
- the exact hard quantity sequence;
- confirmation that Add remains exactly once;
- preservation checks;
- static validation performed;
- confirmation that no browser/API test ran and no prohibited file changed.
```

## Exact AI output

```text
Corrected exactly one file: [tests/features/fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts:1505).

TC12 now hard-requires this sequence before Add:

1. Exact external `quantityControls` count.
2. Scoped quantity control visibility.
3. Displayed value equal to `String(testCase.targetProduct.quantity)`.

The existing value is retained only after that hard assertion. Feedback baseline capture remains after these prerequisites and before Add.

Confirmed:

- Exactly one TC12 `addToCartOnce` call.
- Its unchanged helper contains exactly one click.
- No retry or compensating Add.
- Exactly 12 FR07 declarations.
- TC01–TC11 are byte-identical to the 0017 artifact.
- The diff is confined to TC12’s quantity prerequisite block.
- All other 0017 automation files are byte-identical to their artifacts.
- Forbidden-pattern scan and `git diff --check` passed.
- `npm run typecheck` passed.
- Playwright `--list` found exactly TC09–TC12 for Chromium.

No browser/API test ran, and no prohibited file was changed.
```

## Human review/action

Chấp nhận output 0018. Human action: Tôi đã review final correction và xác nhận chỉ tests/features/fr07-cart.spec.ts thay đổi so với rejected artifact 0017, tại đúng quantity prerequisite block của FR07-TC12. Quantity control được yêu cầu đúng external count, visible và có displayed value bằng String(targetProduct.quantity) dưới hard web-first assertions trước feedback baseline và đúng một addToCartOnce activation. Feedback before/after transition, semantic badge association, guarded reads, test.slow, image-alt và badge-delta oracles được giữ nguyên. Năm automation file còn lại byte-identical với artifact 0017; FR07-TC01 đến FR07-TC11 không thay đổi. Spec vẫn có đúng 12 FR07 declarations, typecheck thành công, Playwright chỉ liệt kê đúng TC09-TC12, forbidden-pattern và whitespace checks đều sạch. Chưa chạy Playwright browser/API test và không sửa SUT, FR-01, database, evidence, configuration, documentation hoặc package files.
