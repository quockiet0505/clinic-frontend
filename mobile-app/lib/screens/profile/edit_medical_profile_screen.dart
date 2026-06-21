import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';

class EditMedicalProfileScreen extends StatefulWidget {
  const EditMedicalProfileScreen({super.key});

  @override
  State<EditMedicalProfileScreen> createState() => _EditMedicalProfileScreenState();
}

class _EditMedicalProfileScreenState extends State<EditMedicalProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _heightController;
  late TextEditingController _weightController;
  late TextEditingController _bloodPressureController;
  late TextEditingController _pulseController;
  late TextEditingController _allergiesController;
  late TextEditingController _chronicDiseasesController;
  late TextEditingController _medicalHistoryController;
  String? _selectedBloodType;

  bool _isLoading = false;

  static const _bloodTypeOptions = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Chưa rõ'
  ];

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().user;

    _heightController = TextEditingController(text: user?['height']?.toString() ?? '');
    _weightController = TextEditingController(text: user?['weight']?.toString() ?? '');
    _bloodPressureController = TextEditingController(text: user?['bloodPressure'] ?? '');
    _pulseController = TextEditingController(text: user?['pulse']?.toString() ?? '');
    _allergiesController = TextEditingController(text: user?['allergies'] ?? '');
    _chronicDiseasesController = TextEditingController(text: user?['chronicDiseases'] ?? '');
    _medicalHistoryController = TextEditingController(text: user?['medicalHistory'] ?? '');
    
    final dbBloodType = user?['bloodType'];
    if (dbBloodType != null && _bloodTypeOptions.contains(dbBloodType)) {
      _selectedBloodType = dbBloodType;
    } else if (dbBloodType != null) {
      _selectedBloodType = dbBloodType;
    }
  }

  @override
  void dispose() {
    _heightController.dispose();
    _weightController.dispose();
    _bloodPressureController.dispose();
    _pulseController.dispose();
    _allergiesController.dispose();
    _chronicDiseasesController.dispose();
    _medicalHistoryController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    final authProvider = context.read<AuthProvider>();

    // Prepare data
    final user = authProvider.user;
    if (user == null) {
      setState(() => _isLoading = false);
      return;
    }

    // Include existing basic info to satisfy the full UpdateProfileRequest
    final data = {
      'fullName': user['fullName'] ?? '',
      'phone': user['phone'] ?? '',
      'address': user['address'] ?? '',
      if (user['gender'] != null) 'gender': user['gender'],
      if (user['dateOfBirth'] != null) 'dateOfBirth': user['dateOfBirth'],
      
      // The updated medical info
      if (_heightController.text.trim().isNotEmpty) 'height': int.tryParse(_heightController.text.trim()),
      if (_weightController.text.trim().isNotEmpty) 'weight': double.tryParse(_weightController.text.trim()),
      if (_bloodPressureController.text.trim().isNotEmpty) 'bloodPressure': _bloodPressureController.text.trim(),
      if (_pulseController.text.trim().isNotEmpty) 'pulse': int.tryParse(_pulseController.text.trim()),
      if (_selectedBloodType != null && _selectedBloodType != 'Chưa rõ') 'bloodType': _selectedBloodType,
      'allergies': _allergiesController.text.trim(),
      'chronicDiseases': _chronicDiseasesController.text.trim(),
      'medicalHistory': _medicalHistoryController.text.trim(),
    };

    final success = await authProvider.updateProfile(data);
    if (!mounted) return;
    setState(() => _isLoading = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: const Text('Cập nhật hồ sơ y tế thành công!', style: TextStyle(color: Colors.white)),
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
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Hồ sơ y tế cơ bản',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: Color(0xFF0F172A), letterSpacing: -0.3),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF0F172A), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Header Info
            Container(
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: Color(0xFF2563EB),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.health_and_safety_rounded, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Text(
                      'Hồ sơ y tế giúp bác sĩ hiểu rõ tình trạng sức khoẻ nền của bạn trước khi khám.',
                      style: TextStyle(fontSize: 13, color: Color(0xFF1E3A8A), height: 1.5),
                    ),
                  ),
                ],
              ),
            ),

            _buildSectionLabel('Chỉ số sinh tồn cơ bản'),
            _buildCard([
              Row(
                children: [
                  Expanded(
                    child: _buildTextField(
                      label: 'Chiều cao (cm)',
                      controller: _heightController,
                      icon: Icons.height_rounded,
                      hint: '170',
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  Container(width: 1, height: 60, color: const Color(0xFFF1F5F9)),
                  Expanded(
                    child: _buildTextField(
                      label: 'Cân nặng (kg)',
                      controller: _weightController,
                      icon: Icons.monitor_weight_outlined,
                      hint: '65',
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              _buildDivider(),
              Row(
                children: [
                  Expanded(
                    child: _buildTextField(
                      label: 'Huyết áp',
                      controller: _bloodPressureController,
                      icon: Icons.monitor_heart_outlined,
                      hint: '120/80',
                    ),
                  ),
                  Container(width: 1, height: 60, color: const Color(0xFFF1F5F9)),
                  Expanded(
                    child: _buildTextField(
                      label: 'Nhịp tim (bpm)',
                      controller: _pulseController,
                      icon: Icons.favorite_border_rounded,
                      hint: '80',
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              _buildDivider(),
              _buildDropdownField(
                label: 'Nhóm máu',
                value: _selectedBloodType,
                items: [if (_selectedBloodType != null && !_bloodTypeOptions.contains(_selectedBloodType)) _selectedBloodType!, ..._bloodTypeOptions],
                icon: Icons.bloodtype_outlined,
                onChanged: (val) => setState(() => _selectedBloodType = val),
              ),
            ]),

            const SizedBox(height: 20),

            _buildSectionLabel('Bệnh lý nền & Lưu ý'),
            _buildCard([
              _buildTextField(
                label: 'Dị ứng',
                controller: _allergiesController,
                icon: Icons.warning_amber_rounded,
                hint: 'Dị ứng thuốc, thức ăn, phấn hoa...',
                maxLines: 2,
              ),
              _buildDivider(),
              _buildTextField(
                label: 'Bệnh mãn tính',
                controller: _chronicDiseasesController,
                icon: Icons.sick_outlined,
                hint: 'Ghi chú về bệnh mãn tính...',
                maxLines: 2,
              ),
              _buildDivider(),
              _buildTextField(
                label: 'Tiền sử bệnh lý',
                controller: _medicalHistoryController,
                icon: Icons.history_edu_rounded,
                hint: 'Các bệnh mãn tính, phẫu thuật trước đây...',
                maxLines: 3,
              ),
            ]),

            const SizedBox(height: 40),

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
                        : [const Color(0xFF0369A1), const Color(0xFF0EA5E9)],
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
                      _isLoading ? 'Đang lưu...' : 'Lưu hồ sơ y tế',
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
            maxLines: maxLines,
            style: const TextStyle(fontSize: 15, color: Color(0xFF0F172A), fontWeight: FontWeight.w500),
            decoration: InputDecoration(
              prefixIcon: maxLines > 1 
                ? Padding(
                    padding: const EdgeInsets.only(bottom: 40),
                    child: Icon(icon, size: 20, color: const Color(0xFF64748B)),
                  ) 
                : Icon(icon, size: 20, color: const Color(0xFF64748B)),
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
                borderSide: const BorderSide(color: Color(0xFF0EA5E9), width: 1.5),
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
  }) {
    final displayValue = value ?? 'Chọn';
    
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
                                    item,
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
