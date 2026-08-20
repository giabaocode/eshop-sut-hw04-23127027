# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features/fr01-registration.spec.ts >> FR-01 account registration — reviewed increment 3 >> FR01-TC10 each of @, $, !, %, *, ?, & satisfies the special-character rule.
- Location: tests/features/fr01-registration.spec.ts:423:7

# Error details

```
Error: at_sign must reach the documented login heading

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - at_sign must reach the documented login heading with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-at-mt17wtk7-7hk-bddb515b61074ce98da3e161787a9a76@example.test
  - text: Mật khẩu
  - textbox: Abcdef1@
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: at_sign must reach the documented login form

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - at_sign must reach the documented login form with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-at-mt17wtk7-7hk-bddb515b61074ce98da3e161787a9a76@example.test
  - text: Mật khẩu
  - textbox: Abcdef1@
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: at_sign login destination must show its email control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - at_sign login destination must show its email control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-at-mt17wtk7-7hk-bddb515b61074ce98da3e161787a9a76@example.test
  - text: Mật khẩu
  - textbox: Abcdef1@
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: at_sign login destination must show its password control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - at_sign login destination must show its password control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-at-mt17wtk7-7hk-bddb515b61074ce98da3e161787a9a76@example.test
  - text: Mật khẩu
  - textbox: Abcdef1@
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: at_sign must submit exactly one registration request

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

```
Error: dollar_sign must reach the documented login heading

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - dollar_sign must reach the documented login heading with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-dollar-mt17wxit-7hk-182c0eacc2324888a8486428b0542e06@example.test
  - text: Mật khẩu
  - textbox: Abcdef1$
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: dollar_sign must reach the documented login form

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - dollar_sign must reach the documented login form with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-dollar-mt17wxit-7hk-182c0eacc2324888a8486428b0542e06@example.test
  - text: Mật khẩu
  - textbox: Abcdef1$
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: dollar_sign login destination must show its email control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - dollar_sign login destination must show its email control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-dollar-mt17wxit-7hk-182c0eacc2324888a8486428b0542e06@example.test
  - text: Mật khẩu
  - textbox: Abcdef1$
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: dollar_sign login destination must show its password control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - dollar_sign login destination must show its password control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-dollar-mt17wxit-7hk-182c0eacc2324888a8486428b0542e06@example.test
  - text: Mật khẩu
  - textbox: Abcdef1$
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: dollar_sign must submit exactly one registration request

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

```
Error: exclamation_mark must reach the documented login heading

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - exclamation_mark must reach the documented login heading with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-exclamation-mt17x1gq-7hk-a1be603ec6954b0fbb6b9b1cba9faebb@example.test
  - text: Mật khẩu
  - textbox: Abcdef1!
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: exclamation_mark must reach the documented login form

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - exclamation_mark must reach the documented login form with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-exclamation-mt17x1gq-7hk-a1be603ec6954b0fbb6b9b1cba9faebb@example.test
  - text: Mật khẩu
  - textbox: Abcdef1!
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: exclamation_mark login destination must show its email control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - exclamation_mark login destination must show its email control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-exclamation-mt17x1gq-7hk-a1be603ec6954b0fbb6b9b1cba9faebb@example.test
  - text: Mật khẩu
  - textbox: Abcdef1!
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: exclamation_mark login destination must show its password control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - exclamation_mark login destination must show its password control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-exclamation-mt17x1gq-7hk-a1be603ec6954b0fbb6b9b1cba9faebb@example.test
  - text: Mật khẩu
  - textbox: Abcdef1!
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: exclamation_mark must submit exactly one registration request

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

```
Error: percent_sign must reach the documented login heading

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - percent_sign must reach the documented login heading with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-percent-mt17x5el-7hk-4f6e8713b6e34dfd9e46a80aaf6deb25@example.test
  - text: Mật khẩu
  - textbox: Abcdef1%
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: percent_sign must reach the documented login form

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - percent_sign must reach the documented login form with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-percent-mt17x5el-7hk-4f6e8713b6e34dfd9e46a80aaf6deb25@example.test
  - text: Mật khẩu
  - textbox: Abcdef1%
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: percent_sign login destination must show its email control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - percent_sign login destination must show its email control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-percent-mt17x5el-7hk-4f6e8713b6e34dfd9e46a80aaf6deb25@example.test
  - text: Mật khẩu
  - textbox: Abcdef1%
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: percent_sign login destination must show its password control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - percent_sign login destination must show its password control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-percent-mt17x5el-7hk-4f6e8713b6e34dfd9e46a80aaf6deb25@example.test
  - text: Mật khẩu
  - textbox: Abcdef1%
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: percent_sign must submit exactly one registration request

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

```
Error: asterisk must reach the documented login heading

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - asterisk must reach the documented login heading with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-asterisk-mt17x9ce-7hk-5f807f9326104e9688a2dbc063852457@example.test
  - text: Mật khẩu
  - textbox: Abcdef1*
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: asterisk must reach the documented login form

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - asterisk must reach the documented login form with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-asterisk-mt17x9ce-7hk-5f807f9326104e9688a2dbc063852457@example.test
  - text: Mật khẩu
  - textbox: Abcdef1*
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: asterisk login destination must show its email control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - asterisk login destination must show its email control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-asterisk-mt17x9ce-7hk-5f807f9326104e9688a2dbc063852457@example.test
  - text: Mật khẩu
  - textbox: Abcdef1*
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: asterisk login destination must show its password control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - asterisk login destination must show its password control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-asterisk-mt17x9ce-7hk-5f807f9326104e9688a2dbc063852457@example.test
  - text: Mật khẩu
  - textbox: Abcdef1*
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: asterisk must submit exactly one registration request

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

```
Error: question_mark must reach the documented login heading

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - question_mark must reach the documented login heading with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-question-mt17xdaf-7hk-91c3161857134c96b5ded977b67cfe27@example.test
  - text: Mật khẩu
  - textbox: Abcdef1?
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: question_mark must reach the documented login form

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - question_mark must reach the documented login form with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-question-mt17xdaf-7hk-91c3161857134c96b5ded977b67cfe27@example.test
  - text: Mật khẩu
  - textbox: Abcdef1?
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: question_mark login destination must show its email control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - question_mark login destination must show its email control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-question-mt17xdaf-7hk-91c3161857134c96b5ded977b67cfe27@example.test
  - text: Mật khẩu
  - textbox: Abcdef1?
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: question_mark login destination must show its password control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - question_mark login destination must show its password control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-question-mt17xdaf-7hk-91c3161857134c96b5ded977b67cfe27@example.test
  - text: Mật khẩu
  - textbox: Abcdef1?
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: question_mark must submit exactly one registration request

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

```
Error: ampersand must reach the documented login heading

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - ampersand must reach the documented login heading with timeout 5000ms
  - waiting for getByRole('heading', { name: /^\s*Đăng nhập\s*$/i })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-ampersand-mt17xh8c-7hk-d8788d07072548bcb3a81416afbf6bcf@example.test
  - text: Mật khẩu
  - textbox: Abcdef1&
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: ampersand must reach the documented login form

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - ampersand must reach the documented login form with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) })

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-ampersand-mt17xh8c-7hk-d8788d07072548bcb3a81416afbf6bcf@example.test
  - text: Mật khẩu
  - textbox: Abcdef1&
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: ampersand login destination must show its email control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - ampersand login destination must show its email control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Email\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-ampersand-mt17xh8c-7hk-d8788d07072548bcb3a81416afbf6bcf@example.test
  - text: Mật khẩu
  - textbox: Abcdef1&
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: ampersand login destination must show its password control

expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - ampersand login destination must show its password control with timeout 5000ms
  - waiting for locator('form').filter({ has: getByRole('button', { name: /^\s*Đăng nhập\s*$/i }) }).locator('label').filter({ hasText: /^\s*Mật khẩu\s*\*?\s*$/i }).locator('..').locator('input')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Đăng Ký Tài Khoản" [level=2]
  - text: Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT. Họ Tên
  - textbox: Nguyễn Văn An
  - text: Email
  - textbox: fr01-tc10-ampersand-mt17xh8c-7hk-d8788d07072548bcb3a81416afbf6bcf@example.test
  - text: Mật khẩu
  - textbox: Abcdef1&
  - paragraph: "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
  - button "Đăng Ký"
  - text: Đã có tài khoản?
  - link "Đăng nhập":
    - /url: /login
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

```
Error: ampersand must submit exactly one registration request

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

# Test source

```ts
  370 |     const testCase = passwordMissingLowercaseCase;
  371 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  372 | 
  373 |     await submitAndAssertPasswordRejection(
  374 |       page,
  375 |       registration,
  376 |       testCase.registrationPath,
  377 |       testCase.input,
  378 |       testCase.fieldsToFill,
  379 |       testCase.expected.registrationEndpoint,
  380 |       testCase.expected.registrationRequestCount,
  381 |       testCase.id,
  382 |     );
  383 |   });
  384 | 
  385 |   test(`${passwordMissingDigitCase.id} ${passwordMissingDigitCase.title}`, async ({
  386 |     page,
  387 |   }) => {
  388 |     const testCase = passwordMissingDigitCase;
  389 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  390 | 
  391 |     await submitAndAssertPasswordRejection(
  392 |       page,
  393 |       registration,
  394 |       testCase.registrationPath,
  395 |       testCase.input,
  396 |       testCase.fieldsToFill,
  397 |       testCase.expected.registrationEndpoint,
  398 |       testCase.expected.registrationRequestCount,
  399 |       testCase.id,
  400 |     );
  401 |   });
  402 | });
  403 | 
  404 | test.describe('FR-01 account registration — reviewed increment 3', () => {
  405 |   test(`${passwordMissingAllowedSpecialCase.id} ${passwordMissingAllowedSpecialCase.title}`, async ({
  406 |     page,
  407 |   }) => {
  408 |     const testCase = passwordMissingAllowedSpecialCase;
  409 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  410 | 
  411 |     await submitAndAssertPasswordRejection(
  412 |       page,
  413 |       registration,
  414 |       testCase.registrationPath,
  415 |       testCase.input,
  416 |       testCase.fieldsToFill,
  417 |       testCase.expected.registrationEndpoint,
  418 |       testCase.expected.registrationRequestCount,
  419 |       testCase.id,
  420 |     );
  421 |   });
  422 | 
  423 |   test(`${passwordEachAllowedSpecialCase.id} ${passwordEachAllowedSpecialCase.title}`, async ({
  424 |     page,
  425 |   }) => {
  426 |     test.slow();
  427 |     const testCase = passwordEachAllowedSpecialCase;
  428 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  429 | 
  430 |     for (const row of testCase.rows) {
  431 |       await test.step(`${row.name}: ${row.symbol}`, async () => {
  432 |         await registration.goto(testCase.registrationPath);
  433 |         const registrationRequests =
  434 |           registration.observeRegistrationPostRequests(
  435 |             testCase.expected.registrationEndpoint,
  436 |           );
  437 | 
  438 |         try {
  439 |           const email = generateCollisionSafeEmail(row.input.emailTemplate);
  440 |           await registration.fillSelectedFields(
  441 |             row.input,
  442 |             email,
  443 |             testCase.fieldsToFill,
  444 |           );
  445 |           await registration.submit();
  446 | 
  447 |           await Promise.all([
  448 |             expect.soft(
  449 |               registration.loginHeading(testCase.expected.loginDestination),
  450 |               `${row.name} must reach the documented login heading`,
  451 |             ).toBeVisible(),
  452 |             expect.soft(
  453 |               registration.loginForm(testCase.expected.loginDestination),
  454 |               `${row.name} must reach the documented login form`,
  455 |             ).toBeVisible(),
  456 |             expect.soft(
  457 |               registration.loginEmailInput(testCase.expected.loginDestination),
  458 |               `${row.name} login destination must show its email control`,
  459 |             ).toBeVisible(),
  460 |             expect.soft(
  461 |               registration.loginPasswordInput(
  462 |                 testCase.expected.loginDestination,
  463 |               ),
  464 |               `${row.name} login destination must show its password control`,
  465 |             ).toBeVisible(),
  466 |           ]);
  467 |           expect.soft(
  468 |             registrationRequests.count(),
  469 |             `${row.name} must submit exactly one registration request`,
> 470 |           ).toBe(row.expected.registrationRequestCount);
      |             ^ Error: ampersand must submit exactly one registration request
  471 |         } finally {
  472 |           registrationRequests.stop();
  473 |         }
  474 |       });
  475 |     }
  476 |   });
  477 | 
  478 |   test(`${confirmationMatchMatrixCase.id} ${confirmationMatchMatrixCase.title}`, async ({
  479 |     page,
  480 |   }) => {
  481 |     const testCase = confirmationMatchMatrixCase;
  482 |     const registration = new RegistrationPage(page, testCase.expected.labels);
  483 | 
  484 |     await registration.goto(testCase.registrationPath);
  485 |     await expect(registration.confirmationPasswordInput).toBeVisible();
  486 |     await expect(registration.confirmationPasswordInput).toHaveAttribute(
  487 |       'required',
  488 |       testCase.expected.confirmationControl.requiredAttribute,
  489 |     );
  490 |     await expect(registration.confirmationPasswordInput).toHaveAttribute(
  491 |       'type',
  492 |       testCase.expected.confirmationControl.type,
  493 |     );
  494 | 
  495 |     const [unequalRow, equalRow] = testCase.rows;
  496 |     expect(
  497 |       unequalRow.input.password === unequalRow.input.confirmationPassword,
  498 |       `${unequalRow.name} decision-table input must match its external decision value`,
  499 |     ).toBe(unequalRow.passwordsMatch);
  500 |     expect(
  501 |       equalRow.input.password === equalRow.input.confirmationPassword,
  502 |       `${equalRow.name} decision-table input must match its external decision value`,
  503 |     ).toBe(equalRow.passwordsMatch);
  504 | 
  505 |     await test.step(unequalRow.name, async () => {
  506 |       await submitAndAssertPasswordRejection(
  507 |         page,
  508 |         registration,
  509 |         testCase.registrationPath,
  510 |         unequalRow.input,
  511 |         testCase.fieldsToFill,
  512 |         testCase.expected.registrationEndpoint,
  513 |         unequalRow.expected.registrationRequestCount,
  514 |         unequalRow.name,
  515 |       );
  516 |     });
  517 | 
  518 |     await test.step(equalRow.name, async () => {
  519 |       await registration.goto(testCase.registrationPath);
  520 |       const registrationRequests =
  521 |         registration.observeRegistrationPostRequests(
  522 |           testCase.expected.registrationEndpoint,
  523 |         );
  524 | 
  525 |       try {
  526 |         const email = generateCollisionSafeEmail(equalRow.input.emailTemplate);
  527 |         await registration.fillSelectedFields(
  528 |           equalRow.input,
  529 |           email,
  530 |           testCase.fieldsToFill,
  531 |         );
  532 |         await registration.submit();
  533 | 
  534 |         await expect(
  535 |           registration.loginHeading(testCase.expected.loginDestination),
  536 |         ).toBeVisible();
  537 |         await expect(
  538 |           registration.loginForm(testCase.expected.loginDestination),
  539 |         ).toBeVisible();
  540 |         await expect(
  541 |           registration.loginEmailInput(testCase.expected.loginDestination),
  542 |         ).toBeVisible();
  543 |         await expect(
  544 |           registration.loginPasswordInput(testCase.expected.loginDestination),
  545 |         ).toBeVisible();
  546 |         expect(
  547 |           registrationRequests.count(),
  548 |           `${equalRow.name} must submit exactly one registration request`,
  549 |         ).toBe(equalRow.expected.registrationRequestCount);
  550 |       } finally {
  551 |         registrationRequests.stop();
  552 |       }
  553 |     });
  554 |   });
  555 | 
  556 |   test(`${apiUniqueThenDuplicateCase.id} ${apiUniqueThenDuplicateCase.title}`, async ({
  557 |     request,
  558 |   }) => {
  559 |     const testCase = apiUniqueThenDuplicateCase;
  560 |     const [firstRecord, secondRecord] = testCase.records;
  561 |     const apiBaseUrl = process.env.PW_API_URL ?? 'http://localhost:3000';
  562 |     const registrationUrl = `${apiBaseUrl.replace(/\/$/, '')}/${testCase.endpoint.replace(/^\//, '')}`;
  563 |     const firstEmail = generateCollisionSafeEmail(
  564 |       firstRecord.input.emailTemplate,
  565 |     );
  566 |     const secondEmail = secondRecord.input.emailTemplate.replaceAll(
  567 |       testCase.firstEmailReferenceToken,
  568 |       firstEmail,
  569 |     );
  570 |     const firstRequestBody = {
```