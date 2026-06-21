import 'package:flutter/material.dart';
import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class FAQScreen extends StatefulWidget {
  const FAQScreen({super.key});

  @override
  State<FAQScreen> createState() => _FAQScreenState();
}

class _FAQScreenState extends State<FAQScreen> {
  final List<Map<String, dynamic>> _faqs = [
    {
      'category': 'Lịch hẹn',
      'question': 'Làm thế nào để đặt lịch khám?',
      'answer': 'Bạn có thể đặt lịch trực tuyến qua mục Đặt lịch, gọi điện hotline 1900 2115, hoặc đến trực tiếp tại quầy lễ tân phòng khám.',
      'icon': Icons.calendar_today_rounded,
      'color': const Color(0xFF0284C7),
      'bgColor': const Color(0xFFE0F2FE),
      'isExpanded': false,
    },
    {
      'category': 'Chính sách',
      'question': 'Hủy lịch hẹn trước bao lâu?',
      'answer': 'Khuyến khích bạn hủy hoặc thay đổi lịch hẹn ít nhất 2 giờ trước giờ khám dự kiến trong Lịch hẹn của tôi, hoặc gọi trực tiếp tổng đài.',
      'icon': Icons.shield_outlined,
      'color': const Color(0xFF059669),
      'bgColor': const Color(0xFFD1FAE5),
      'isExpanded': false,
    },
    {
      'category': 'Thanh toán',
      'question': 'Các phương thức thanh toán?',
      'answer': 'Chúng tôi hỗ trợ: Tiền mặt, Thẻ ngân hàng (ATM/Visa/MasterCard), và Chuyển khoản hoặc quét mã QR (Momo, ZaloPay, VNPay).',
      'icon': Icons.payment_rounded,
      'color': const Color(0xFF7C3AED),
      'bgColor': const Color(0xFFEDE9FE),
      'isExpanded': false,
    },
    {
      'category': 'Hoạt động',
      'question': 'Phòng khám có khám ngoài giờ không?',
      'answer': 'Giờ làm việc hành chính từ 07:00 – 17:00 (Thứ 2 đến Chủ Nhật). Để khám ngoài giờ/cấp cứu, vui lòng gọi trước Hotline 1900 2115.',
      'icon': Icons.access_time_rounded,
      'color': const Color(0xFFD97706),
      'bgColor': const Color(0xFFFEF3C7),
      'isExpanded': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: const GradientAppBar(title: 'Trung tâm hỗ trợ'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0369A1), Color(0xFF0EA5E9)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text('FAQ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                  const SizedBox(height: 12),
                  const Text('Câu Hỏi Thường Gặp', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  Text('Mọi thắc mắc về dịch vụ, quy trình khám và thanh toán.', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 13, height: 1.5)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Danh sách câu hỏi',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 16),
            ...List.generate(_faqs.length, (index) => _buildFaqItem(index)),
            
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  const Icon(Icons.support_agent_rounded, size: 48, color: AppColors.primary),
                  const SizedBox(height: 12),
                  const Text('Bạn cần hỗ trợ thêm?', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  const Text('Gọi ngay Hotline 1900 2115 để được nhân viên y tế hỗ trợ trực tiếp.', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4)),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('Gọi Hotline ngay', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildFaqItem(int index) {
    final item = _faqs[index];
    final isExpanded = item['isExpanded'] as bool;

    return GestureDetector(
      onTap: () {
        setState(() {
          _faqs[index]['isExpanded'] = !isExpanded;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isExpanded ? item['color'].withOpacity(0.3) : Colors.transparent),
          boxShadow: [
            BoxShadow(
              color: isExpanded ? item['color'].withOpacity(0.05) : Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(color: item['bgColor'], borderRadius: BorderRadius.circular(14)),
                  child: Icon(item['icon'], color: item['color'], size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item['category'], style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: item['color'])),
                      const SizedBox(height: 4),
                      Text(item['question'], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                AnimatedRotation(
                  turns: isExpanded ? 0.5 : 0,
                  duration: const Duration(milliseconds: 300),
                  child: const Icon(Icons.keyboard_arrow_down_rounded, color: Color(0xFF94A3B8), size: 24),
                ),
              ],
            ),
            AnimatedCrossFade(
              firstChild: const SizedBox(height: 0, width: double.infinity),
              secondChild: Padding(
                padding: const EdgeInsets.only(top: 16, left: 58),
                child: Text(
                  item['answer'],
                  style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.5, fontWeight: FontWeight.w500),
                ),
              ),
              crossFadeState: isExpanded ? CrossFadeState.showSecond : CrossFadeState.showFirst,
              duration: const Duration(milliseconds: 300),
            ),
          ],
        ),
      ),
    );
  }
}
