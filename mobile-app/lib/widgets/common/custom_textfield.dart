// --- lib/widgets/common/custom_textfield.dart ---
import 'package:clinic_management_system/app_exports.dart';

class CustomTextField extends StatefulWidget {
  final String hintText;
  final IconData? prefixIcon;
  final bool isPassword;
  final TextEditingController? controller;

  const CustomTextField({super.key, required this.hintText, this.prefixIcon, this.isPassword = false, this.controller});

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool _obscureText = true;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.isPassword;
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      obscureText: _obscureText,
      style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight),
      decoration: InputDecoration(
        hintText: widget.hintText,
        hintStyle: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
        prefixIcon: widget.prefixIcon != null ? Icon(widget.prefixIcon, color: AppColors.primary.withOpacity(0.5)) : null,
        suffixIcon: widget.isPassword
            ? IconButton(
                icon: Icon(_obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: AppColors.textSubLight),
                onPressed: () => setState(() => _obscureText = !_obscureText),
              )
            : null,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: AppColors.primary.withOpacity(0.2), width: 1.5)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary, width: 2)),
      ),
    );
  }
}