# Interaction 0004

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T01:58:09Z

## Exact prompt

````text
Act as a correction-only editor for docs/hw04-traceability-test-matrix.md. Modify exactly that one file and no other file. Preserve the existing 36-case structure, IDs, evidence hierarchy, and all content not required by these corrections. Apply only these human-reviewed corrections: (1) In FR07-TC01 remove the unsupported requirement that Cart must display product images and remove its FR-24 image-alt mapping; keep the SRS-required cart columns, h1, and currency checks. (2) Change FR07-TC03 to a UI-only same-product test using external data: start with the target product absent, add the same product twice through visible web UI, then assert exactly one cart row for that product, quantity 2, and consistent line/cart totals. Do not use or cross-check backend /api/cart in this case. (3) Make FR07-TC12 deterministic: start with the target product absent and a known initial badge, add exactly one unit through UI, assert visual feedback and badge increment exactly 1; because this case uses a product page/card image, assert any displayed product image has a non-empty descriptive alt. (4) Add execution policy requiring exactly 9 independent feature-browser runs: FR-01, FR-07, FR-12 each on Chromium, Firefox, WebKit; each run must generate its own genuine HTML report displaying exactly Run by: 23127027 and an ISO timestamp generated during execution, with no post-editing. (5) Update requirement coverage so FR-12 includes FR12-TC01 through FR12-TC12 and FR-24 no longer maps FR07-TC01 while retaining the corrected FR07-TC12 mapping. Keep exactly 12 IDs per feature, external JSON data, at least three assertion patterns per feature, C/F/W applicability, EVIDENCE MISSING handling, mutation safety, and no claimed execution or defects. Do not run tests, servers, installations, Git commands, or commits.
````

## Exact AI output
````text
Updated only [docs/hw04-traceability-test-matrix.md](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/docs/hw04-traceability-test-matrix.md).

Applied all five requested corrections and verified the structure remains exactly 36 cases: 12 each for FR-01, FR-07, and FR-12. No tests, servers, installations, or Git commands were run.
````

## Human review/action
Tôi đã so sánh corrected matrix với rejected artifact 0003 và xác nhận Codex chỉ áp dụng các correction đã yêu cầu. Matrix giữ đúng 12 case cho mỗi feature, dùng external JSON, có ít nhất ba assertion patterns cho mỗi feature, áp dụng Chromium/Firefox/WebKit, quy định 9 run và 9 genuine HTML reports với Run by: 23127027 cùng ISO timestamp sinh trong execution. Không có source SUT bị sửa và chưa có pass/fail hoặc defect nào được tuyên bố.
