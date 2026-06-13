import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmController = TextEditingController();

  void _nextStep() {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final email = _emailController.text.trim();

    if (name.isEmpty || phone.isEmpty || email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vui lòng điền đủ họ tên, số điện thoại và email')));
      return;
    }
    
    setState(() => _currentStep = 1);
    _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
  }

  void _prevStep() {
    setState(() => _currentStep = 0);
    _pageController.previousPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
  }

  void _handleRegister() async {
    final password = _passwordController.text;
    final confirm = _confirmController.text;

    if (password.isEmpty || confirm.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vui lòng nhập mật khẩu')));
      return;
    }

    if (password != confirm) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Mật khẩu xác nhận không khớp')));
      return;
    }

    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.register(
      _nameController.text.trim(),
      _phoneController.text.trim(),
      _emailController.text.trim(),
      password,
    );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đăng ký thành công! Vui lòng đăng nhập.')));
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(authProvider.error ?? 'Đăng ký thất bại')));
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: GradientAppBar(
        title: '',
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight),
          onPressed: () {
            if (_currentStep == 1) {
              _prevStep();
            } else {
              Navigator.pop(context);
            }
          },
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                children: [
                  Image.asset(
                    'assets/images/logo.png',
                    height: 80,
                    fit: BoxFit.contain,
                    filterQuality: FilterQuality.high,
                    errorBuilder: (context, error, stackTrace) => const Icon(Icons.health_and_safety, size: 80, color: AppColors.primary),
                  ),
                  const SizedBox(height: 16),
                  Text('Tạo tài khoản', style: AppStyles.heading1.copyWith(color: AppColors.textMainLight)),
                  const SizedBox(height: 8),
                  Text(
                    _currentStep == 0 ? 'Nhập thông tin cá nhân của bạn' : 'Tạo mật khẩu bảo mật', 
                    style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
            
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  // PAGE 1: User Info
                  SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      children: [
                        CustomTextField(
                          hintText: 'Họ và tên',
                          prefixIcon: Icons.person_outline,
                          controller: _nameController,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          hintText: 'Số điện thoại',
                          prefixIcon: Icons.phone_outlined,
                          controller: _phoneController,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          hintText: 'Email',
                          prefixIcon: Icons.email_outlined,
                          controller: _emailController,
                        ),
                        const SizedBox(height: 32),
                        CustomButton(
                          text: 'Tiếp theo',
                          onPressed: _nextStep,
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),

                  // PAGE 2: Password
                  SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      children: [
                        CustomTextField(
                          hintText: 'Mật khẩu',
                          prefixIcon: Icons.lock_outline,
                          isPassword: true,
                          controller: _passwordController,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          hintText: 'Xác nhận mật khẩu',
                          prefixIcon: Icons.lock_outline,
                          isPassword: true,
                          controller: _confirmController,
                        ),
                        const SizedBox(height: 32),
                        Consumer<AuthProvider>(
                          builder: (context, auth, child) {
                            return CustomButton(
                              text: 'Hoàn tất Đăng ký',
                              isLoading: auth.isLoading,
                              onPressed: _handleRegister,
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}