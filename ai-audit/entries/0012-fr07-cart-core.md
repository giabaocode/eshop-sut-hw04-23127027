# Interaction 0012

## AI tool

OpenAI Codex CLI 0.147.0 (model: gpt-5.6-sol)

## ISO date/time
2026-08-20T08:53:09.072Z

## Exact prompt

````text
Extend the reviewed Playwright automation with FR-07 increment 1 covering exactly FR07-TC01 through FR07-TC04.

Read and preserve:
- README.md
- api_specification.md
- docs/hw04-traceability-test-matrix.md
- playwright.config.ts
- tests/support/data-loader.ts
- the existing FR-01 automation
- frontend-web/src/App.jsx
- frontend-web/src/context/CartContext.jsx
- frontend-web/src/pages/Home.jsx
- frontend-web/src/pages/ProductDetail.jsx
- frontend-web/src/pages/Cart.jsx
- backend/server.js
- backend/database.js

Create or modify only these automation files when necessary:
- tests/data/fr07-cart.json
- tests/features/fr07-cart.spec.ts
- tests/pages/catalog.page.ts
- tests/pages/cart.page.ts
- tests/support/data-loader.ts

Do not modify FR-01 data, specs, or page objects. Do not modify SUT source, documentation, configuration, packages, evidence, database files, or ai-audit files. Do not run Playwright tests and do not start the SUT. Static JSON parsing and TypeScript typechecking are allowed.

Add exactly four test declarations. IDs and titles must come from external JSON:
- FR07-TC01 populated cart structure, currency, and one descriptive h1.
- FR07-TC02 invalid cart API authentication partitions.
- FR07-TC03 adding the same product twice produces one row with quantity two.
- FR07-TC04 the plus control increments only the selected row and recalculates totals.

Add these exact external JSON keys:
- populated_cart_two_products
- cart_invalid_authentication
- same_product_ui_addition
- quantity_increment

Keep IDs, titles, paths, endpoints, product identities, expected headings, headers, quantities, prices, currency rules, token partitions, request bodies, login credentials, and expected counts in external JSON. Do not add inline case arrays or duplicate case data in the spec.

UI fixture rules:
- The web cart is React in-memory state and is not connected to the backend cart API.
- Build UI cart state only through visible product-card actions on the home page within the current browser context.
- Do not inject React state, use local storage, call private component functions, or use the backend cart API to seed UI cases.
- Scope each product card by its visible product heading, then locate its add-to-cart button inside that card.
- Navigate to the cart through the visible Giỏ hàng navigation link.
- Keep locators semantic and page-object based. Do not use brittle CSS chains, nth-based product selection, arbitrary sleeps, or waitForTimeout.
- Each Playwright test receives a fresh browser context, so UI cart state is isolated without database mutation.

TC01 requirements:
- Seed exactly two distinct products by activating each selected home product card add action once.
- Assert exactly two product rows.
- Assert exactly one descriptive h1 for the cart.
- Assert the required column labels: Sản phẩm, Đơn giá, Số lượng, Thành tiền, and Thao tác.
- Assert each row exposes plus and minus quantity controls.
- Assert displayed unit prices and line totals contain ₫, contain a thousands separator, and numerically match the external product prices and quantities.
- Use expect.soft where useful so independent structural requirements are all evaluated without weakening any assertion.

TC02 requirements:
- Use the Playwright request fixture and an absolute API URL composed from process.env.PW_API_URL ?? "http://localhost:3000" plus endpoints stored in JSON.
- Store exactly three invalid-authentication rows in JSON: missing token, malformed token, and expired token.
- The expired token must be a real JWT fixture signed for the current SUT with an exp value in the past, stored as a token literal in external JSON. Do not expose the signing secret in the spec.
- Obtain a valid baseline token by logging in with the seeded dedicated user credentials from external JSON.
- Snapshot that users cart with authenticated GET /api/cart before the invalid attempts.
- For every invalid-authentication row, exercise both GET /api/cart and POST /api/cart using test.step.
- Assert each invalid request is not successful without inventing an exact status or response wording. Preserve response status and body in assertion diagnostics.
- Use soft assertions for the six rejection responses so all authentication partitions execute.
- Fetch the cart again with the valid token and assert deep equality with the baseline snapshot, proving rejected POST attempts caused no mutation.
- Do not mock or intercept the API.

TC03 requirements:
- Start with a fresh empty UI cart.
- Activate the same home product cards add action exactly twice.
- Open the cart and assert exactly one row for that product, quantity 2, line total equal to twice the external unit price, and cart total equal to the sum of all displayed line totals.
- Do not compensate for or retry failed add actions. The two activations are the tested state transition.
- After asserting row count, use a deterministic row-scoped locator for the remaining assertions without conditionally bypassing them.

TC04 requirements:
- Seed one target product through one visible home product-card add action, then open the cart.
- Capture row count, selected-row quantity, selected-row line total, and cart total before interaction.
- Require a row-scoped button whose accessible name is exactly + as a hard prerequisite.
- Click it once.
- Assert only the selected row quantity changes from n to n+1, its line total changes consistently, total row count is unchanged, and the cart total is recalculated consistently.
- Do not skip, soften, synthesize, or bypass the plus-control requirement if the current SUT does not provide it.

Page-object and calculation rules:
- Use role-based table, row, columnheader, cell, button, link, and heading locators where available.
- Scope cart row locators by external product name.
- Provide helpers that parse displayed currency by removing presentation separators while retaining a numeric comparison.
- Verify a displayed thousands separator without requiring one locale-specific separator character.
- Provide helpers for unit price, quantity, line amount, cart total, and summing displayed line amounts.
- Keep TypeScript strict-compatible and Playwright 1.62.1-compatible.
- Do not use unsupported matchers such as toBeRequired.

Preserve every existing FR01-TC01 through FR01-TC12 declaration and assertion unchanged in intent and strength.
Do not claim pass, failure, or defect because no execution is authorized.

After editing, report:
- exact files changed;
- the four JSON keys and generated test IDs;
- how each UI fixture is built;
- the assertion and state-delta oracle for each case;
- confirmation that no Playwright tests ran and no SUT, database, evidence, configuration, documentation, package, or audit file was modified.
````

## Exact AI output
````text
Implemented FR-07 increment 1 with exactly four test declarations.

Changed files:

- [fr07-cart.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr07-cart.json)
- [fr07-cart.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr07-cart.spec.ts)
- [catalog.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/catalog.page.ts)
- [cart.page.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/pages/cart.page.ts)
- [data-loader.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/data-loader.ts)

External JSON keys and generated IDs:

- `populated_cart_two_products` → `FR07-TC01`
- `cart_invalid_authentication` → `FR07-TC02`
- `same_product_ui_addition` → `FR07-TC03`
- `quantity_increment` → `FR07-TC04`

Fixture construction and oracles:

- TC01: clicks two distinct heading-scoped home product cards once each, then uses the visible cart link. Verifies two rows, one descriptive `h1`, required headers, row-scoped `+`/`-` controls, quantities, unit prices, line totals, `₫`, and locale-independent thousands separators.
- TC02: logs in as the external seeded user, snapshots authenticated `/api/cart`, exercises GET and POST for missing, malformed, and genuinely expired JWT partitions, records status/body diagnostics, and deep-compares the final authenticated cart with the baseline.
- TC03: clicks the same heading-scoped product card exactly twice from a fresh context. Verifies one product row, quantity two, doubled line amount, and cart total equal to all displayed line amounts.
- TC04: adds one target product once, requires an exact row-scoped `+` button, captures pre-interaction row/quantity/line/total state, clicks once, and verifies the `n → n+1` quantity and corresponding line/sum/cart-total deltas without changing row count.

Static validation completed successfully:

- JSON parsing and structural checks
- Expired JWT signature/expiry verification
- Strict TypeScript typechecking
- Exactly four FR-07 test declarations
- No FR-01 diff

No Playwright tests ran and no SUT was started. No SUT, database, evidence, configuration, documentation, package, or audit file was modified. The two pre-existing untracked `ai-audit` files remained untouched. No pass, failure, or defect result is claimed.
````

## Human review/action
Tôi đã review toàn bộ năm file automation và xác nhận FR-07 increment 1 bổ sung đúng FR07-TC01 đến FR07-TC04. ID, title, product fixture, authentication partitions, paths, labels, prices, quantities và expected counts đều lấy từ external JSON. TC01 tạo cart qua hai product card riêng biệt và giữ đầy đủ structure, h1, column, quantity-control cùng currency assertions. TC02 dùng login token hợp lệ để snapshot cart, thực hiện đủ missing, malformed và JWT đã ký nhưng hết hạn qua cả GET và POST, sau đó so sánh cart trước/sau mà không suy diễn status hoặc wording. TC03 kích hoạt cùng product card đúng hai lần, không retry hoặc bù hành vi. TC04 giữ nút + row-scoped làm hard prerequisite trước state-delta assertions. FR01-TC01 đến FR01-TC12 không thay đổi. Typecheck thành công và Playwright liệt kê đúng bốn test FR07-TC01 đến FR07-TC04 trên Chromium. Chưa thực thi browser/API test, chưa có pass/fail hoặc defect claim và source SUT không bị sửa.
