// --- lib/screens/auth/register_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  bool _isLoading = false;

  void _handleRegister() async {
    setState(() => _isLoading = true);
    
    // Giả lập API call 2 giây
    await Future.delayed(const Duration(seconds: 2));
    
    if (!mounted) return;
    setState(() => _isLoading = false);
    
    // Đăng ký xong thì quay lại màn hình Login
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
  
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // App Logo
              const SizedBox(height: 60),
              Image.asset(
                'assets/images/logo.png', 
                height: 160, 
                fit: BoxFit.contain, 
            
                filterQuality: FilterQuality.high, 
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.health_and_safety, size: 120, color: AppColors.primary)
              ),  

              const SizedBox(height: 8),

              Text('Create an Account', style: AppStyles.heading1.copyWith(color: AppColors.textMainLight)),
              const SizedBox(height: 8),
              Text(
                'Please fill this detail to create an account', 
                style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),

              // Inputs
              const CustomTextField(
                hintText: 'Full Name',
                prefixIcon: Icons.person_outline,
              ),
              const SizedBox(height: 16),
              const CustomTextField(
                hintText: 'Email Address',
                prefixIcon: Icons.email_outlined,
              ),
              const SizedBox(height: 16),
              const CustomTextField(
                hintText: 'Password',
                prefixIcon: Icons.lock_outline,
                isPassword: true,
              ),
              const SizedBox(height: 32),

              // Register Button
              CustomButton(
                text: 'Sign Up',
                isLoading: _isLoading,
                onPressed: _handleRegister,
              ),
              const SizedBox(height: 24),

              // Divider
              Row(
                children: [
                  Expanded(child: Divider(color: AppColors.textSubLight.withOpacity(0.2))),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text('Or', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                  ),
                  Expanded(child: Divider(color: AppColors.textSubLight.withOpacity(0.2))),
                ],
              ),
              const SizedBox(height: 24),

              // Google Sign In
              SocialButton(
                text: 'Sign in with Google',
                onPressed: () {},
              ),
              const SizedBox(height: 32),

              // Login Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Already have an account? ", style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight)),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Text('Login', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}