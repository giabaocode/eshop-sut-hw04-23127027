# Interaction 0023 — Complete HW04 submission artifacts

## AI tool

OpenAI Codex

## ISO date/time

2026-08-21T15:12:00+07:00

## Exact prompt

```text
Mình vừa đặt file tên HW04_Testing.pdf vào repo này bạn hãy đọc tình trạng hiện tại và so với các yêu cầu của file xem còn thiếu phần nào thì làm tiếp cho xong giúp mình, cấc phần nào cần mình cần tự làm thì hãy để dành sau khi bạn xong hết rồi nói tôi để làm từng bước để hoàn thành toàn bộ file bài tập này
```

## Exact AI output

See `ai-audit/outputs/0023-complete-hw04-submission.md`.

## Human review/action

Chấp nhận output 0023. Em đã đọc kết quả kiểm tra từng bước và đồng ý với phần review code, cấu hình, tài liệu và execution evidence. Bộ test có đủ 36 logical cases, gồm FR12-TC01 đến FR12-TC12; các mutation có cleanup, TC05/TC06 giữ đúng phân loại EVIDENCE MISSING và không có skip, retry hay fixed sleep để né lỗi. Signing material đã được chuyển khỏi JSON sang biến môi trường; giá trị cũ trong rejected artifact cũng được ghi rõ là redacted trước khi public. Report local được tách tại `playwright-report/local`, còn chín report final được giữ riêng tại `playwright-report/final`; evidence hiện có tổng cộng 108 executions với 30 pass và 78 fail. Nội dung final report, bug report, AI critique và workflow skill phù hợp với evidence đã tổng hợp. Em đã tự tạo 16 GitHub Issues kèm ảnh evidence và đã yêu cầu Codex thực hiện các thao tác kỹ thuật commit, cập nhật Git log, push branch và cài workflow skill. Video vẫn để PENDING để em tự quay bằng giọng nói và bằng chứng danh tính của mình; em cũng sẽ tự đóng gói và nộp bài. Em chấp nhận trạng thái hiện tại của output sau các chỉnh sửa trên.
