import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;
  String? _selectedGender;
  DateTime? _selectedDob;

  File? _selectedAvatar;
  final ImagePicker _picker = ImagePicker();

  bool _isLoading = false;

  static const _genderOptions = [
    {'value': 'MALE', 'label': 'Nam'},
    {'value': 'FEMALE', 'label': 'Nữ'},
    {'value': 'OTHER', 'label': 'Khác'},
  ];

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().user;

    _nameController = TextEditingController(text: user?['fullName'] ?? '');
    _phoneController = TextEditingController(text: user?['phone'] ?? '');
    _addressController = TextEditingController(text: user?['address'] ?? '');
    _selectedGender = user?['gender'];

    final dob = user?['dateOfBirth'];
    if (dob != null) {
      try {
        _selectedDob = DateTime.parse(dob.toString());
      } catch (_) {}
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDob ?? DateTime(1990),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      locale: const Locale('vi', 'VN'),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(
            primary: Color(0xFF2563EB),
            onPrimary: Colors.white,
            surface: Colors.white,
          ),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() => _selectedDob = picked);
    }
  }

  Future<void> _pickAvatar() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (image != null) {
      setState(() => _selectedAvatar = File(image.path));
    }
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final authProvider = context.read<AuthProvider>();

    String? dobStr;
    if (_selectedDob != null) {
      dobStr = '${_selectedDob!.year}-${_selectedDob!.month.toString().padLeft(2, '0')}-${_selectedDob!.day.toString().padLeft(2, '0')}';
    }

    final data = {
      'fullName': _nameController.text.trim(),
      'phone': _phoneController.text.trim(),
      'address': _addressController.text.trim(),
      if (_selectedGender != null) 'gender': _selectedGender,
      if (dobStr != null) 'dateOfBirth': dobStr,
    };

    // Note: We'll implement multipart upload in authProvider if _selectedAvatar != null.
    // For now, assume updateProfile handles both data and file.
    final success = await authProvider.updateProfile(data, avatarFile: _selectedAvatar);
    if (!mounted) return;
    setState(() => _isLoading = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: const Text('Cập nhật thông tin thành công!', style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF059669),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ));
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(authProvider.error ?? 'Cập nhật thất bại', style: const TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFFDC2626),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: const GradientAppBar(title: 'Chỉnh sửa thông tin'),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Avatar row
            Center(
              child: Column(
                children: [
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: _pickAvatar,
                    child: Stack(
                      children: [
                        Container(
                          width: 88,
                          height: 88,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            image: _selectedAvatar != null
                                ? DecorationImage(image: FileImage(_selectedAvatar!), fit: BoxFit.cover)
                                : (context.read<AuthProvider>().user?['avatarUrl'] != null
                                    ? DecorationImage(
                                        image: NetworkImage(context.read<AuthProvider>().user!['avatarUrl']),
                                        fit: BoxFit.cover)
                                    : null),
                            gradient: _selectedAvatar == null && context.read<AuthProvider>().user?['avatarUrl'] == null
                                ? const LinearGradient(
                                    colors: [Color(0xFF0369A1), Color(0xFF0EA5E9)],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  )
                                : null,
                            boxShadow: [
                              BoxShadow(color: const Color(0xFF0EA5E9).withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6)),
                            ],
                          ),
                          child: _selectedAvatar == null && context.read<AuthProvider>().user?['avatarUrl'] == null
                              ? const Icon(Icons.person_rounded, size: 46, color: Colors.white)
                              : null,
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: const Color(0xFF2563EB),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: const Icon(Icons.camera_alt_rounded, size: 14, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),

            _buildCard([
              _buildTextField(
                label: 'Họ và tên',
                controller: _nameController,
                icon: Icons.person_outline_rounded,
                hint: 'Nhập họ và tên đầy đủ',
                validator: (v) => (v == null || v.isEmpty) ? 'Vui lòng nhập họ và tên' : null,
              ),
              _buildDivider(),
              _buildTextField(
                label: 'Số điện thoại',
                controller: _phoneController,
                icon: Icons.phone_outlined,
                hint: 'Nhập số điện thoại',
                keyboardType: TextInputType.phone,
                validator: (v) => (v == null || v.isEmpty) ? 'Vui lòng nhập số điện thoại' : null,
              ),
              _buildDivider(),
              Row(
                children: [
                  Expanded(
                    child: _buildDropdownField(
                      label: 'Giới tính',
                      value: _selectedGender,
                      items: _genderOptions.map((e) => e['value']!).toList(),
                      displayMap: {for (var e in _genderOptions) e['value']!: e['label']!},
                      icon: Icons.person_outline_rounded,
                      onChanged: (val) => setState(() => _selectedGender = val),
                    ),
                  ),
                  Container(width: 1, height: 60, color: const Color(0xFFF1F5F9)),
                  Expanded(
                    child: InkWell(
                      onTap: _pickDate,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Ngày sinh', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.cake_outlined, size: 20, color: Color(0xFF64748B)),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _selectedDob != null
                                        ? '${_selectedDob!.day.toString().padLeft(2, '0')}/${_selectedDob!.month.toString().padLeft(2, '0')}/${_selectedDob!.year}'
                                        : 'Chọn',
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w500,
                                      color: _selectedDob != null ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              _buildDivider(),
              _buildTextField(
                label: 'Địa chỉ',
                controller: _addressController,
                icon: Icons.location_on_outlined,
                hint: 'Nhập địa chỉ của bạn',
              ),
            ]),



            // Save button
            GestureDetector(
              onTap: _isLoading ? null : _handleSave,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _isLoading
                        ? [const Color(0xFF94A3B8), const Color(0xFF94A3B8)]
                        : [const Color(0xFF0369A1), Color(0xFF0EA5E9)],
                  ),
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    if (!_isLoading)
                      BoxShadow(color: const Color(0xFF0EA5E9).withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6)),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_isLoading) ...[
                      const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)),
                      const SizedBox(width: 12),
                    ],
                    Text(
                      _isLoading ? 'Đang lưu...' : 'Lưu thay đổi',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 10),
      child: Text(
        label,
        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF64748B), letterSpacing: 0.2),
      ),
    );
  }

  Widget _buildCard(List<Widget> children) {
    return Container(
      margin: const EdgeInsets.only(bottom: 0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
    );
  }

  Widget _buildDivider() {
    return const Padding(
      padding: EdgeInsets.only(left: 16),
      child: Divider(height: 1, color: Color(0xFFF1F5F9)),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required IconData icon,
    required String hint,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
    int maxLines = 1,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            keyboardType: keyboardType,
            validator: validator,
            maxLines: maxLines,
            style: const TextStyle(fontSize: 15, color: Color(0xFF0F172A), fontWeight: FontWeight.w500),
            decoration: InputDecoration(
              prefixIcon: Icon(icon, size: 20, color: const Color(0xFF64748B)),
              hintText: hint,
              hintStyle: const TextStyle(fontSize: 14, color: Color(0xFFCBD5E1)),
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFF2563EB), width: 1.5),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFFDC2626)),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFFDC2626), width: 1.5),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String? value,
    required List<String> items,
    required IconData icon,
    required void Function(String?) onChanged,
    Map<String, String>? displayMap,
  }) {
    final displayValue = value != null ? (displayMap != null ? (displayMap[value] ?? value) : value) : 'Chọn';
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                isScrollControlled: true,
                builder: (BuildContext context) {
                  return Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    ),
                    padding: const EdgeInsets.fromLTRB(0, 12, 0, 24),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(2))),
                        const SizedBox(height: 20),
                        Text('Chọn $label', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                        const SizedBox(height: 16),
                        ...items.map((item) {
                          final isSelected = item == value;
                          return InkWell(
                            onTap: () {
                              onChanged(item);
                              Navigator.pop(context);
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                              color: isSelected ? const Color(0xFFEFF6FF) : Colors.transparent,
                              child: Row(
                                children: [
                                  Text(
                                    displayMap != null ? (displayMap[item] ?? item) : item,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                                      color: isSelected ? const Color(0xFF2563EB) : const Color(0xFF334155),
                                    ),
                                  ),
                                  const Spacer(),
                                  if (isSelected) const Icon(Icons.check_circle_rounded, color: Color(0xFF2563EB), size: 20),
                                ],
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  );
                },
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Icon(icon, size: 20, color: const Color(0xFF64748B)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      displayValue,
                      style: TextStyle(
                        fontSize: 15,
                        color: value != null ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Icon(Icons.keyboard_arrow_down_rounded, color: Color(0xFF64748B), size: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
