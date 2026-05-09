// --- lib/widgets/common/social_button.dart ---
import 'package:clinic_management_system/app_exports.dart';

class SocialButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const SocialButton({super.key, required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          side: BorderSide(color: AppColors.textSubLight.withOpacity(0.2)),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.g_mobiledata, color: Colors.red, size: 32),
            const SizedBox(width: 8),
            Text(text, style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight)),
          ],
        ),
      ),
    );
  }
}