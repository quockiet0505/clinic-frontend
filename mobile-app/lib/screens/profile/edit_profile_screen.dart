import 'package:clinic_management_system/app_exports.dart';

class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key});

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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Thông tin cá nhân', style: AppStyles.heading3),
            const SizedBox(height: 24),
            _buildTextField('Họ và tên', 'Nguyễn Văn A', Icons.person_outline),
            const SizedBox(height: 16),
            _buildTextField('Số điện thoại', '0901234567', Icons.phone_outlined),
            const SizedBox(height: 16),
            _buildTextField('Email', 'nguyenvena@gmail.com', Icons.email_outlined),
            const SizedBox(height: 16),
            _buildTextField('Ngày sinh', '01/01/1990', Icons.calendar_today_outlined),
            const SizedBox(height: 16),
            _buildTextField('Địa chỉ', '123 Nguyễn Văn Cừ, Quận 5, TP.HCM', Icons.location_on_outlined),
            
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: GradientButton(
              text: 'Lưu thay đổi',
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã cập nhật thông tin thành công!')));
              },
            ),
          ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, String placeholder, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: placeholder,
          style: AppStyles.bodyLarge,
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: AppColors.primary),
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
      ],
    );
  }
}
