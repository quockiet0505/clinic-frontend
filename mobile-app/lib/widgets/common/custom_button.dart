import 'package:clinic_management_system/app_exports.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final Color? color;

  const CustomButton({
    super.key, 
    required this.text, 
    required this.onPressed, 
    this.isLoading = false,
    this.color
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: color != null ? LinearGradient(colors: [color!, color!.withOpacity(0.8)], begin: Alignment.centerLeft, end: Alignment.centerRight) : AppColors.primaryGradient,
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
        ),
        child: isLoading
            ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3))
            : Text(text, style: AppStyles.buttonText.copyWith(fontWeight: FontWeight.bold, fontSize: 16)),
      ),
    );
  }
}