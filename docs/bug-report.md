# HW04 Consolidated Bug Report

All groups below were reproduced in the nine final reports on 2026-08-21. Chromium evidence paths are listed for compactness; equivalent Firefox and WebKit evidence is available in the corresponding final report. Each published GitHub Issue is linked below.

| Bug | Requirement | Reproducing tests | Actual result | Evidence | GitHub Issue |
|---|---|---|---|---|---|
| BUG-01 Registration page lacks descriptive h1 | FR-21 | FR01-TC01, TC04 | No required single descriptive `h1`. | `playwright-report/final/fr01-chromium` | [#1](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/1) |
| BUG-02 Confirmation-password control is absent | FR-01, FR-22 | FR01-TC02, TC04, TC11 | Confirmation cannot be entered or validated. | `playwright-report/final/fr01-chromium` | [#2](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/2) |
| BUG-03 Registration email lacks email semantics | FR-01, FR-22 | FR01-TC03 | Control does not expose required `type="email"`. | `playwright-report/final/fr01-chromium` | [#3](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/3) |
| BUG-04 Documented valid password boundaries are rejected | FR-01 | FR01-TC05, TC10 | Valid 8-character/allowed-special controls are rejected by stronger undocumented policy. | `playwright-report/final/fr01-chromium` | [#4](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/4) |
| BUG-05 Duplicate registration email is accepted | FR-01 | FR01-TC12 | Second API registration returns success and creates another user. | `playwright-report/final/fr01-chromium` | [#5](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/5) |
| BUG-06 Cart lacks required heading, column label, and quantity controls | FR-07, FR-21 | FR07-TC01, TC04 | Missing h1 and +/- controls; `Giá` appears instead of `Đơn giá`. | `playwright-report/final/fr07-chromium` | [#6](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/6) |
| BUG-07 Same product creates duplicate rows | FR-07 | FR07-TC03 | Adding one product twice creates two rows instead of quantity 2 in one row. | `playwright-report/final/fr07-chromium` | [#7](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/7) |
| BUG-08 Delete has no confirmation dialog | FR-07, FR-24 | FR07-TC06–TC08 | Delete action immediately removes the row. | `playwright-report/final/fr07-chromium` | [#8](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/8) |
| BUG-09 Cart navigation requirements are missing | FR-07, FR-23 | FR07-TC09 | No semantic breadcrumb/current state and required label is replaced by `← Mua tiếp`. | `playwright-report/final/fr07-chromium` | [#9](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/9) |
| BUG-10 Cart total label is incorrect | FR-07 | FR07-TC10 | Displays `Tổng tạm tính`, not exact `Tổng cộng`. | `playwright-report/final/fr07-chromium` | [#10](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/10) |
| BUG-11 Empty cart lacks illustration | FR-07, FR-24 | FR07-TC11 | Friendly message exists, but no accessible named illustration. | `playwright-report/final/fr07-chromium` | [#11](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/11) |
| BUG-12 Add-to-cart feedback and numeric badge are absent | FR-23, FR-24 | FR07-TC12 | One Add activation produces no scoped feedback and no numeric cart badge. | `playwright-report/final/fr07-chromium` | [#12](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/12) |
| BUG-13 Product mutation APIs have no access-control boundary | FR-12, SEC-02, SEC-03 | FR12-TC08 | Missing-token and ordinary-user POST/PUT/DELETE can mutate products. | `playwright-report/final/fr12-chromium` | [#13](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/13) |
| BUG-14 Category APIs authenticate but do not authorize admin role | FR-12, SEC-03 | FR12-TC09 | Ordinary user can POST/PUT/DELETE categories. | `playwright-report/final/fr12-chromium` | [#14](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/14) |
| BUG-15 Coupon access and route contract violate requirements | FR-12, SEC-03 | FR12-TC10 | Ordinary user can use exposed Admin coupon mutations; required `/api/coupons` mutation routes are absent. | `playwright-report/final/fr12-chromium` | [#15](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/15) |
| BUG-16 Profile endpoint permits role mass assignment | SEC-06, FR-04 | FR12-TC11, TC12 | User can elevate to admin and admin can demote role; fresh login reflects changed role. | `playwright-report/final/fr12-chromium` | [#16](https://github.com/giabaocode/eshop-sut-hw04-23127027/issues/16) |

## Evidence boundaries that are not bugs

- FR07-TC05 did not establish its required visible quantity-two fixture. The decrement behavior was not reached.
- FR12-TC05 and FR12-TC06 cannot prove access denial for `PUT /api/admin/orders/:id/status`: the supported APIs provide no reversible order deletion/restoration fixture. Their non-existing-ID response is retained as `EVIDENCE MISSING`, not classified as a defect or pass.
