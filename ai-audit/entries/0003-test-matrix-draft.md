# Interaction 0003

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T01:45:03Z

## Exact prompt

````text
Act as a test-design assistant for HW04 student 23127027. Create exactly one file: docs/hw04-traceability-test-matrix.md. Do not modify any other file. Base the matrix on README.md version 2.0 requirements for FR-01, FR-07, FR-12, relevant FR-21 through FR-24, and SEC-02, SEC-03, SEC-06. Use api_specification.md only as supporting API contract. Exclude frontend-mobile and all HW02 test cases/results. Create exactly 36 planned automated test cases: exactly 12 IDs FR01-TC01 through FR01-TC12, exactly 12 IDs FR07-TC01 through FR07-TC12, and exactly 12 IDs FR12-TC01 through FR12-TC12. For each case include: source requirement, UI or API layer, test-design technique or data partition, objective and external-data intent, expected result derived from the requirement, assertion pattern, Chromium/Firefox/WebKit applicability, and mutation/cleanup note. Plan separate JSON data files tests/data/fr01-registration.json, tests/data/fr07-cart.json, and tests/data/fr12-access-control.json; never propose inline test-case arrays or objects in spec files. Ensure at least three distinct assertion patterns within each feature. Mark implementation discrepancies only as test targets, never as confirmed defects. Mark unsupported expectations as EVIDENCE MISSING instead of inventing them. For FR-12 distinguish authentication from authorization, include ordinary-user and admin-token coverage, and mark data-mutating checks for controlled backup/restore or cleanup. Add concise sections for evidence hierarchy, execution policy, and requirement coverage. Do not claim tests were executed or passed. Do not run servers, tests, package installation, Git commands, or commits. If the target file already exists, do not overwrite it and report that fact.
````

## Exact AI output
````text
Created [docs/hw04-traceability-test-matrix.md](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/docs/hw04-traceability-test-matrix.md).

It contains exactly 36 planned cases:

- 12 × FR01-TC01–FR01-TC12
- 12 × FR07-TC01–FR07-TC12
- 12 × FR12-TC01–FR12-TC12

No other files were modified, and no tests, servers, installations, or Git commands were run.
````

## Human review/action
Tôi đã kiểm tra đủ 36 case và không chấp nhận draft 0003 ở trạng thái hiện tại. Tôi yêu cầu loại suy diễn ảnh sản phẩm khỏi FR07-TC01; đổi FR07-TC03 thành kiểm tra gộp sản phẩm hoàn toàn qua UI; làm oracle badge FR07-TC12 xác định bằng trạng thái ban đầu không có sản phẩm và thêm đúng một đơn vị; bổ sung chính sách 9 feature-browser runs, 9 HTML reports với student ID và ISO timestamp từ execution thật; đồng thời cập nhật coverage FR-12 gồm TC11-TC12. Không thay đổi số lượng 12 case cho mỗi feature và chưa gọi discrepancy nào là defect.
