import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:easy_localization/easy_localization.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;
  late TextEditingController _addressController;

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().user;
    
    _nameController = TextEditingController(text: user?['fullName'] ?? '');
    _phoneController = TextEditingController(text: user?['phone'] ?? '');
    _emailController = TextEditingController(text: user?['email'] ?? '');
    _addressController = TextEditingController(text: user?['address'] ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _handleUpdateProfile() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = context.read<AuthProvider>();
      
      final data = {
        'fullName': _nameController.text.trim(),
        'phone': _phoneController.text.trim(),
        // Email usually read-only or handled specially, but we send it if API requires
        'email': _emailController.text.trim(),
        'address': _addressController.text.trim(),
      };
      
      final success = await authProvider.updateProfile(data);
      
      if (!mounted) return;
      
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Cập nhật thông tin thành công!', style: AppStyles.bodyMedium.copyWith(color: Colors.white))),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(authProvider.error ?? 'Cập nhật thất bại', style: AppStyles.bodyMedium.copyWith(color: Colors.white)), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Chỉnh sửa thông tin', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, auth, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Thông tin cá nhân', style: AppStyles.heading3),
                  const SizedBox(height: 24),
                  _buildTextField('Họ và tên', _nameController, Icons.person_outline),
                  const SizedBox(height: 16),
                  _buildTextField('Số điện thoại', _phoneController, Icons.phone_outlined, isNumber: true),
                  const SizedBox(height: 16),
                  _buildTextField('Email', _emailController, Icons.email_outlined, enabled: false), // Email usually shouldn't change
                  const SizedBox(height: 16),
                  _buildTextField('Địa chỉ', _addressController, Icons.location_on_outlined),
                  
                  const SizedBox(height: 40),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: GradientButton(
                      text: auth.isLoading ? 'Đang lưu...' : 'Lưu thay đổi',
                      onPressed: auth.isLoading ? () {} : _handleUpdateProfile,
                    ),
                  ),
                ],
              ),
            ),
          );
        }
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {bool enabled = true, bool isNumber = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          enabled: enabled,
          style: AppStyles.bodyLarge,
          keyboardType: isNumber ? TextInputType.phone : TextInputType.text,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Vui lòng nhập $label';
            }
            return null;
          },
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: enabled ? AppColors.primary : Colors.grey),
            filled: true,
            fillColor: enabled ? AppColors.primary.withValues(alpha: 0.03) : Colors.grey.shade100,
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
      ],
    );
  }
}
