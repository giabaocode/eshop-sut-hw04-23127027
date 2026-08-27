Kết luận: workflow FR12 có nền tảng tốt và ba report là evidence Playwright thật, nhưng chưa thể xem là hoàn chỉnh/an toàn cho code hiện tại. Có 5 blocker chính.

## Phát hiện quan trọng

1. **Critical – report đã commit chứa Bearer token và dữ liệu đăng nhập.**

Các trace ZIP bên trong ba report chứa request/response login và header `Authorization`. Token do SUT tạo không có `expiresIn` tại [backend/server.js](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/backend/server.js:46), nên không nên coi là token ngắn hạn. Điều này vi phạm nguyên tắc không commit live token.

Không nên post-edit report để xóa token. Cần dùng SUT/credentials/signing key dùng một lần, xoay/revoke sau execution, tắt trace ở final nếu quy định cho phép, hoặc giữ report chứa trace ngoài public repository.

2. **High – TC04/TC05 vẫn có false-positive denial oracle.**

- TC04 dùng ID không tồn tại cho coupon, user và order DELETE/PUT tại [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:261), nhưng chỉ kiểm tra HTTP non-success tại [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts:671). Đặc biệt order-status TC04 chưa được gắn `EVIDENCE MISSING`.
- TC05 chỉ gắn boundary cho order-status; coupon/user DELETE với ID không tồn tại vẫn được tính là verified denial.
- JWT “expired” của TC05 mang `role: "user"` tại [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:388). Vì vậy `403` có thể do role authorization, không chứng minh token bị từ chối vì hết hạn.

TC05 hiện khai báo 12 verified denials tại [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:547), con số này bị overstate.

3. **High – TC09–TC12 có thể pass khi target request không thực sự đạt oracle.**

`requestJsonResource` gộp transport failure và HTTP rejection vào `successful: false` tại [fr12-api.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/support/fr12-api.ts:443).

- TC09/TC10 so sánh trực tiếp boolean này với `false`; target transport failure cộng với state không đổi có thể bị hiểu là access denial.
- TC11/TC12 hoàn toàn bỏ qua kết quả profile-update tại [fr12-access-control.spec.ts](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/features/fr12-access-control.spec.ts:2092). Một request 404/500/transport failure vẫn có thể làm role không đổi và khiến test pass.

Cần tách `transportCompleted`, HTTP response class và persisted-state oracle.

4. **High – final evidence không khớp chính xác code hiện tại.**

Ba report được tạo ngày 21/08; spec hiện tại sửa ngày 22/08. Source nhúng trong trace là bản 74,870 byte, còn spec hiện tại là 75,503 byte. Khác biệt là việc chuyển JWT signing material từ JSON sang biến môi trường.

Vì vậy report là evidence thật, nhưng không phải evidence của exact final source hiện tại.

5. **High – mutation identity và baseline chưa an toàn hoàn toàn.**

- Marker FR12 là chuỗi tĩnh như `FR12_TC08_..._23127027`, không được thêm UUID/timestamp runtime. Cleanup exact equality và strict positive integer được làm đúng, nhưng collision có thể khiến cleanup xóa record từ run cũ.
- TC12 dùng chính tài khoản admin seed duy nhất, trái với ghi chú “dedicated restorable admin fixture” tại [traceability matrix](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/docs/hw04-traceability-test-matrix.md:89).
- Workspace hiện có `backend/database.sqlite` đã modified; nó có 0 order trong khi backup/HEAD có 3 order. Mtime cho thấy thay đổi xảy ra sau final run, nên không chứng minh cleanup ngày 21/08 thất bại, nhưng baseline hiện tại không sẵn sàng cho lần chạy mới.

## Coverage partition

| Phạm vi | Missing | Invalid/expired | Ordinary user | Admin |
|---|---:|---:|---:|---:|
| Admin UI | Có | Không | Có | Có |
| `/api/admin/*` | Có | Có, nhưng TC05 có oracle gap | Có | Chỉ positive GET đầy đủ |
| Products POST/PUT/DELETE | Có | **Thiếu** | Có | Có |
| Categories POST/PUT/DELETE | Có | **Thiếu** | Có | Có |
| Contract `/api/admin/coupons` | Có | Malformed | Có | Có |
| README `/api/coupons` mutations | **Thiếu** | **Thiếu** | **Thiếu** | Có, nhận 404 |

Admin UI cũng chỉ kiểm tra entry path `/`; observer mutation chưa liệt kê README `/api/coupons` tại [fr12-access-control.json](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/tests/data/fr12-access-control.json:22).

## Những phần đã làm tốt

- Traceability có đủ FR12-TC01–TC12, layer, partition, assertion pattern, browser và cleanup tại [matrix](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/docs/hw04-traceability-test-matrix.md:72).
- Dữ liệu nằm trong external JSON hợp lệ; current JSON không chứa signing secret/live JWT.
- Có missing/user/admin separation rõ ràng và kiểm tra role evidence từ login.
- Không có retry, fixed sleep, mock hoặc state injection; cấu hình `workers: 1`, `retries: 0`.
- TC04–TC10 dùng `finally`, exact marker equality, strict positive integer ID và final snapshot comparison.
- TC05/TC06 order-status đã lưu one-shot response và chủ động làm test fail với `EVIDENCE MISSING`.
- TC11/TC12 có persisted read-back, fresh login và restoration trong `finally`.

## Ba report hiện có

| Browser | Timestamp | Tổng | Passed / Failed | Worker |
|---|---|---:|---:|---:|
| Chromium | `2026-08-21T08:25:44.506Z` | 12 | 5 / 7 | 1 |
| Firefox | `2026-08-21T08:25:47.806Z` | 12 | 5 / 7 | 1 |
| WebKit | `2026-08-21T08:25:51.935Z` | 12 | 5 / 7 | 1 |

Metadata nhúng có đúng student ID, timestamp, project, run label và totals. Report nằm ngoài `playwright-report/local`; exit code 1 của từng run được lưu tại [FINAL_RUN_SUMMARY.md](/Users/phamngocgiabao/HW04/eshop-sut-hw04-23127027/evidence/final/FINAL_RUN_SUMMARY.md:14). Lưu ý 7 failed gồm TC05/TC06 có `EVIDENCE MISSING`, không phải 7 defect thuần túy.

## Quy trình evidence đúng cho lần kế tiếp

Sau khi sửa các blocker:

1. Freeze commit và xác minh database bằng checksum/baseline.
2. Dùng runtime-unique marker và credentials/token dành riêng cho evidence.
3. Chạy development riêng dưới `playwright-report/local`.
4. Tạo một thư mục candidate mới, tuyệt đối không dùng lại `playwright-report/final/fr12-*`, ví dụ:
   `playwright-report/candidate/<run-id>/fr12-{chromium,firefox,webkit}`.
5. Chạy ba process độc lập, mỗi process chỉ:
   `tests/features/fr12-access-control.spec.ts --project=<browser>`.
6. Mỗi process đặt `PW_RUN_LABEL`, `PW_REPORT_DIR`, giữ một worker/no retry và lưu command, console, exit code.
7. Kiểm tra report nhúng: student ID, cùng timestamp trong title/metadata, đúng project, đúng 12 ID và totals thực.
8. So sánh source nhúng với source đã freeze; kiểm tra trace không phát tán token.
9. Dừng runtime, chạy cleanup/final read-back và xác minh checksum database.
10. Chỉ sau human review mới promote candidate thành final; không sửa HTML report sau execution.

Mình không sửa file, không chạy test, không tạo evidence và không ghi đè ba report final. Skill dẫn review này tới việc tách rõ evidence thật với oracle hợp lệ, đặc biệt ở non-existing target, cleanup và token leakage.
