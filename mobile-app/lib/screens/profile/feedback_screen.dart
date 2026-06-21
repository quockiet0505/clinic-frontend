import 'package:clinic_management_system/app_exports.dart';

class FeedbackScreen extends StatefulWidget {
  const FeedbackScreen({super.key});

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  int _rating = 0;
  final TextEditingController _commentController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Đánh giá & Góp ý', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.star_rounded, size: 60, color: AppColors.primary),
            ),
            const SizedBox(height: 24),
            Text('Bạn đánh giá thế nào về trải nghiệm?', style: AppStyles.heading2.copyWith(fontSize: 20), textAlign: TextAlign.center),
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
                    color: index < _rating ? Colors.amber : AppColors.textSubLight.withOpacity(0.3),
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
                hintStyle: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight.withOpacity(0.5)),
                filled: true,
                fillColor: AppColors.primary.withOpacity(0.03),
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
            
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: GradientButton(
                text: 'Gửi Đánh Giá',
                onPressed: _rating > 0 ? () {
                  // Submit feedback logic
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Cảm ơn bạn đã gửi đánh giá!')),
                  );
                  Navigator.pop(context);
                } : () {},
              ),
            ),
          ],
        ),
      ),
    );
  }
}
