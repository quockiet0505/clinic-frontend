# Định Hướng Phát Triển Hệ Thống & Câu Hỏi Thảo Luận

Tài liệu này tổng hợp các định hướng nghiên cứu phát triển mở rộng cho hệ thống Quản Lý Phòng Khám Thông Minh trong tương lai, cùng danh sách các câu hỏi thảo luận chuyên môn gợi ý phục vụ buổi báo cáo với Giảng viên.

---

## 1. Định Hướng Phát Triển Hệ Thống (Future Roadmap)

*   **Tích hợp thanh toán trực tuyến:** Kết nối phân hệ Tài chính (Finance) trên Admin Web với các cổng thanh toán (MoMo, VNPay, ZaloPay) để tự động hóa quy trình thu phí và xuất hóa đơn viện phí thực tế cho bệnh nhân.
*   **Quản lý giá và tài chính dược phẩm:** Bổ sung việc quản lý đơn giá nhập, đơn giá bán của từng loại thuốc, hạch toán doanh thu bán thuốc thực tế và liên thông số liệu trực tiếp sang phân hệ Tài chính (Finance).
*   **Nâng cấp phân hệ Kho Dược động:** Triển khai đầy đủ tính năng xuất-nhập-tồn kho thuốc, cảnh báo thuốc cận hạn sử dụng (dưới 3 tháng) và cảnh báo khi số lượng thuốc chạm ngưỡng tối thiểu.
*   **Hệ thống hiển thị hàng đợi tại phòng khám (Queue Display):** Đồng bộ mã QR check-in trên Mobile App với màn hình LCD tại cửa phòng khám để hiển thị số thứ tự gọi khám tự động của bệnh nhân thông qua kết nối thời gian thực (WebSocket).
*   **Tích hợp Speech-to-Text trên Mobile App:** Phát triển tính năng nhận diện giọng nói giúp bệnh nhân lớn tuổi tương tác với trợ lý AI dễ dàng hơn bằng lời nói thay vì gõ văn bản.
*   **AI hỗ trợ kê toa và CDSS (Clinical Decision Support System):** Ứng dụng trí tuệ nhân tạo phân tích mã bệnh ICD-10 và sinh hiệu của bệnh nhân để tự động đề xuất đơn thuốc tối ưu, đồng thời cảnh báo các nguy cơ tương tác chéo hoặc liều lượng bất thường đối với trẻ em và người cao tuổi.
*   **AI tự động trích xuất thông tin cận lâm sàng (OCR/Vision AI):** Tích hợp mô hình AI thị giác máy tính quét các file kết quả xét nghiệm chỉ số hoặc ảnh siêu âm, X-quang để tự động nhận dạng, điền dữ liệu và tóm tắt kết luận vào bệnh án điện tử (EMR) của bác sĩ.
*   **AI phân tích dữ liệu và cảnh báo sức khỏe sớm:** Sử dụng học máy phân tích lịch sử sinh hiệu và thể trạng (BMI) để vẽ biểu đồ xu hướng sức khỏe động, đưa ra cảnh báo sớm về các nguy cơ tim mạch hoặc bệnh mãn tính cho bệnh nhân trên Mobile App.

---

## 2. Câu Hỏi Thảo Luận Đề Xuất Cho Giảng Viên

1.  **Về tối ưu hiệu năng đặt lịch:** Phương án kỹ thuật tối ưu nào (khóa lạc quan, khóa bi quan hay khóa phân tán Redis) nên được áp dụng để giải quyết triệt để vấn đề tranh chấp slot khám (Race Condition) khi có hàng ngàn bệnh nhân đặt lịch trực tuyến cùng lúc?
2.  **Về liên thông dữ liệu ngành:** Trong tương lai phát triển, làm thế nào để tích hợp cơ chế đồng bộ đơn thuốc và kho thuốc trực tiếp lên Hệ thống Cơ sở dữ liệu Dược Quốc gia của Bộ Y Tế Việt Nam?
3.  **Về bảo mật và riêng tư AI:** Việc triển khai các mô hình ngôn ngữ lớn local (Local LLM) kết hợp RAG chạy nội bộ có thực sự giải quyết triệt để bài toán bảo mật thông tin y tế nhạy cảm của người bệnh so với việc sử dụng API đám mây thương mại?
4.  **Về tối ưu hóa AI biên:** Cơ chế phân luồng kép (Dual-Model Routing) giữa mô hình Lễ tân và mô hình Bác sĩ có cần thiết phải tối ưu hóa thêm ở mức biên (Edge AI) để có thể vận hành mượt mà trực tiếp trên thiết bị di động của bệnh nhân không?
5.  **Về cập nhật dữ liệu y khoa:** Làm thế nào để cập nhật tự động và kiểm tra tính nhất quán của cơ sở dữ liệu tương tác hoạt chất thuốc (`DrugInteraction`) mỗi khi Bộ Y Tế ban hành các quy định chống chỉ định mới?
6.  **Về thuật toán phân bổ hàng đợi khám:** Giải pháp quản lý hàng đợi thông minh tại chỗ nên phân bổ độ ưu tiên (Priority Queue) như thế nào giữa bệnh nhân đặt lịch Online trước và bệnh nhân vãng lai (Walk-in) tại quầy tiếp đón để đảm bảo tính công bằng và hiệu quả vận hành?
7.  **Về ranh giới pháp lý của AI trong y tế:** Thiết kế hệ thống AI hỗ trợ ra quyết định lâm sàng (CDSS) nên được giới hạn phạm vi ranh giới trách nhiệm như thế nào để vừa là công cụ đắc lực hỗ trợ bác sĩ, vừa đảm bảo tính pháp lý y khoa và quy trách nhiệm rõ ràng khi có sai sót chẩn đoán xảy ra?
8.  **Về giải phóng slot và tự động dọn dẹp No-Show:** Trong quy trình trạng thái lịch hẹn, việc lịch PENDING/CONFIRMED chiếm slot khám có thể gây lãng phí tài nguyên nếu bệnh nhân không đến. Giải pháp Scheduler chạy ngầm để dọn dẹp các lịch hẹn quá hạn chuyển sang trạng thái `NO_SHOW` cần lưu ý những vấn đề gì để tránh hủy nhầm lịch của bệnh nhân?
9.  **Về cơ chế gọi công cụ (Tool Calling) của AI:** Làm thế nào để đảm bảo mô hình AI trích xuất chính xác các thực thể (bác sĩ, ngày, giờ khám, triệu chứng) dưới dạng cấu trúc dữ liệu JSON để gọi API đặt lịch ở Backend mà không bị lỗi định dạng hoặc nhầm lẫn tham số giữa các ý định (Intent)?
