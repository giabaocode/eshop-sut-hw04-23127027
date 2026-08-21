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
