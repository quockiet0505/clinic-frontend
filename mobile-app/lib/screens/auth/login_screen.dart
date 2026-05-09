// --- lib/screens/auth/login_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLoading = false;

  void _handleLogin() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;
    setState(() => _isLoading = false);
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const MainScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 60),
              Image.asset(
                'assets/images/logo.png', 
                height: 160, 
                fit: BoxFit.contain, 
            
                filterQuality: FilterQuality.high, 
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.health_and_safety, size: 120, color: AppColors.primary)
              ),              
              const SizedBox(height: 8),
              Text('Welcome Back!', style: AppStyles.heading1.copyWith(color: AppColors.textMainLight)),
              const SizedBox(height: 8),
              Text('Use Credentials to access your account', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
              const SizedBox(height: 40),
              const CustomTextField(hintText: 'Email Address', prefixIcon: Icons.email_outlined),
              const SizedBox(height: 16),
              const CustomTextField(hintText: 'Enter Password', prefixIcon: Icons.lock_outline, isPassword: true),
              const SizedBox(height: 12),
              Align(alignment: Alignment.centerRight, child: TextButton(onPressed: () {}, child: Text('Forgot Password?', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary)))),
              const SizedBox(height: 24),
              CustomButton(text: 'Log in', isLoading: _isLoading, onPressed: _handleLogin),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(child: Divider(color: AppColors.textSubLight.withOpacity(0.2))),
                  Padding(padding: const EdgeInsets.symmetric(horizontal: 16), child: Text('Or', style: AppStyles.caption.copyWith(color: AppColors.textSubLight))),
                  Expanded(child: Divider(color: AppColors.textSubLight.withOpacity(0.2))),
                ],
              ),
              const SizedBox(height: 24),
              SocialButton(text: 'Sign in with Google', onPressed: () {}),
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Don't have an account? ", style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight)),
                  GestureDetector(
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const RegisterScreen())),
                    child: Text('Sign up', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
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