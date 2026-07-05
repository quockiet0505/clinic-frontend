import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';
import 'package:clinic_management_system/services/feedback_service.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:provider/provider.dart';

class FeedbackScreen extends StatefulWidget {
  const FeedbackScreen({super.key});

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  int _rating = 0;
  final TextEditingController _commentController = TextEditingController();
  bool _isAnonymous = false;
  bool _isSubmitting = false;

  @override
  Widget build(BuildContext context) {
    final appointmentProvider = context.watch<AppointmentProvider>();
    final hasCompletedAppointment = appointmentProvider.myAppointments.any((a) => a.status == 'COMPLETED');

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const GradientAppBar(title: 'Đánh giá Phòng khám'),
      body: !hasCompletedAppointment 
        ? Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.block_rounded, size: 64, color: AppColors.textSubLight.withValues(alpha: 0.3)),
                const SizedBox(height: 16),
                Text('Bạn chưa có lượt khám nào', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text('Chỉ bệnh nhân đã khám mới có thể đánh giá.', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
              ],
            ),
          )
        : SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 20),
            const SizedBox(height: 24),
            Text('Bạn đánh giá thế nào về trải nghiệm tại phòng khám?', style: AppStyles.heading2.copyWith(fontSize: 20), textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text('Ý kiến của bạn giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn.', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight), textAlign: TextAlign.center),
            
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (index) {
                return IconButton(
                  icon: Icon(
                    index < _rating ? Icons.star_rounded : Icons.star_border_rounded,
                    size: 40,
                    color: index < _rating ? Colors.amber : AppColors.textSubLight.withValues(alpha: 0.3),
                  ),
                  onPressed: () {
                    setState(() {
                      _rating = index + 1;
                    });
                  },
                );
              }),
            ),
            
            const SizedBox(height: 40),
            Align(
              alignment: Alignment.centerLeft,
              child: Text('Góp ý thêm (Không bắt buộc)', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _commentController,
              maxLines: 5,
              decoration: InputDecoration(
                hintText: 'Nhập góp ý của bạn...',
                hintStyle: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight.withValues(alpha: 0.5)),
                filled: true,
                fillColor: AppColors.primary.withValues(alpha: 0.03),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            Row(
              children: [
                SizedBox(
                  height: 24,
                  width: 24,
                  child: Checkbox(
                    value: _isAnonymous,
                    onChanged: (v) => setState(() => _isAnonymous = v ?? false),
                    activeColor: AppColors.primary,
                  ),
                ),
                const SizedBox(width: 8),
                const Text('Đánh giá ẩn danh', style: TextStyle(fontSize: 14)),
              ],
            ),

            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: GradientButton(
                text: 'Gửi Đánh Giá',
                isLoading: _isSubmitting,
                onPressed: _rating > 0 && !_isSubmitting ? () async {
                  setState(() => _isSubmitting = true);
                  try {
                    await FeedbackService().submitClinicReview(
                      rating: _rating,
                      comment: _commentController.text,
                      isAnonymous: _isAnonymous,
                    );
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Cảm ơn bạn đã gửi đánh giá!')),
                      );
                      Navigator.pop(context);
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(e.toString())),
                      );
                      setState(() => _isSubmitting = false);
                    }
                  }
                } : () {},
              ),
            ),
          ],
        ),
      ),
    );
  }
}
