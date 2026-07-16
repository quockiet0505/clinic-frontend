import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';

class GoogleRegisterScreen extends StatefulWidget {
  final String email;
  final String fullName;
  final String idToken;

  const GoogleRegisterScreen({
    super.key,
    required this.email,
    required this.fullName,
    required this.idToken,
  });

  @override
  State<GoogleRegisterScreen> createState() => _GoogleRegisterScreenState();
}

class _GoogleRegisterScreenState extends State<GoogleRegisterScreen> {
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _genderController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.fullName);
    _emailController = TextEditingController(text: widget.email);
  }

  void _handleRegister() async {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final email = _emailController.text.trim();
    final gender = _genderController.text.trim();
    final dob = _dobController.text.trim();
    final address = _addressController.text.trim();

    if (name.isEmpty || phone.isEmpty || email.isEmpty || gender.isEmpty || dob.isEmpty || address.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Vui lòng điền đầy đủ tất cả thông tin')));
      return;
    }

    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.googleRegister(
      name,
      phone,
      email,
      widget.idToken,
      gender.toUpperCase() == 'NỮ' ? 'FEMALE' : 'MALE',
      dob,
      address,
    );

    if (!mounted) return;

    if (success) {
      // Đăng nhập thành công và fetch profile xong, chuyển thẳng vào MainScreen
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const MainScreen()),
        (route) => false,
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(authProvider.error ?? 'Đăng ký Google thất bại')));
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _genderController.dispose();
    _dobController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: GradientAppBar(
        title: '',
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            children: [
              Image.asset(
                'assets/images/logo.png',
                height: 80,
                fit: BoxFit.contain,
                filterQuality: FilterQuality.high,
                errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.health_and_safety,
                    size: 80,
                    color: AppColors.primary),
              ),
              const SizedBox(height: 16),
              Text('Hoàn thiện hồ sơ',
                  style: AppStyles.heading1
                      .copyWith(color: AppColors.textMainLight)),
              const SizedBox(height: 8),
              Text(
                'Tài khoản Google của bạn đã được kết nối.\nVui lòng cung cấp số điện thoại để phòng khám liên hệ.',
                style: AppStyles.bodyMedium
                    .copyWith(color: AppColors.textSubLight),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              CustomTextField(
                hintText: 'Họ và tên',
                prefixIcon: Icons.person_outline,
                controller: _nameController,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                hintText: 'Email (Đã xác minh qua Google)',
                prefixIcon: Icons.email_outlined,
                controller: _emailController,
                readOnly: true, // Không cho sửa email Google
              ),
              const SizedBox(height: 16),
              CustomTextField(
                hintText: 'Số điện thoại',
                prefixIcon: Icons.phone_outlined,
                controller: _phoneController,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                hintText: 'Giới tính (Nam/Nữ)',
                prefixIcon: Icons.wc,
                controller: _genderController,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                hintText: 'Ngày sinh (YYYY-MM-DD)',
                prefixIcon: Icons.calendar_today,
                controller: _dobController,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                hintText: 'Địa chỉ',
                prefixIcon: Icons.location_on_outlined,
                controller: _addressController,
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
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
