import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  void _handleLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vui lòng nhập đầy đủ email và mật khẩu')));
      return;
    }

    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.login(email, password);

    if (!mounted) return;

    if (success) {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const MainScreen()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(authProvider.error ?? 'Đăng nhập thất bại')));
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
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
                height: 80,
                fit: BoxFit.contain,
                filterQuality: FilterQuality.high,
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.health_and_safety, size: 80, color: AppColors.primary),
              ),
              const SizedBox(height: 8),
              Text('Chào mừng trở lại!', style: AppStyles.heading1.copyWith(color: AppColors.textMainLight)),
              const SizedBox(height: 8),
              Text('Đăng nhập để truy cập tài khoản của bạn', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
              const SizedBox(height: 40),
              CustomTextField(hintText: 'Địa chỉ Email', prefixIcon: Icons.email_outlined, controller: _emailController),
              const SizedBox(height: 16),
              CustomTextField(hintText: 'Mật khẩu', prefixIcon: Icons.lock_outline, isPassword: true, controller: _passwordController),
              const SizedBox(height: 12),
              Align(alignment: Alignment.centerRight, child: TextButton(onPressed: () {}, child: Text('Quên mật khẩu?', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary)))),
              const SizedBox(height: 24),
              Consumer<AuthProvider>(
                builder: (context, auth, child) {
                  return CustomButton(text: 'Đăng nhập', isLoading: auth.isLoading, onPressed: _handleLogin);
                },
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(child: Divider(color: AppColors.textSubLight.withOpacity(0.2))),
                  Padding(padding: const EdgeInsets.symmetric(horizontal: 16), child: Text('Hoặc', style: AppStyles.caption.copyWith(color: AppColors.textSubLight))),
                  Expanded(child: Divider(color: AppColors.textSubLight.withOpacity(0.2))),
                ],
              ),
              const SizedBox(height: 24),
              SocialButton(text: 'Đăng nhập với Google', onPressed: () {}),
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Chưa có tài khoản? ", style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight)),
                  GestureDetector(
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const RegisterScreen())),
                    child: Text('Đăng ký', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
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