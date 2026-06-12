import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/screens/profile/edit_profile_screen.dart';
import 'package:clinic_management_system/screens/profile/feedback_screen.dart';
import 'package:provider/provider.dart';
import 'package:easy_localization/easy_localization.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      body: SafeArea(
        child: Consumer<AuthProvider>(
          builder: (context, auth, child) {
            final user = auth.user;
            final fullName = user?['fullName'] ?? 'Người dùng';
            final email = user?['email'] ?? 'Đang tải...';
            final phone = user?['phone'] ?? '---';
            final gender = user?['gender'];
            final dob = user?['dateOfBirth'];
            final height = user?['height'];
            final bloodType = user?['bloodType'];
            final allergies = user?['allergies'];
            final medicalHistory = user?['medicalHistory'];

            return SingleChildScrollView(
              child: Column(
                children: [
                  // ─── Unified Header ───
                  Container(
                    color: const Color(0xFFF8FAFF),
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.person_rounded, color: AppColors.primary, size: 20),
                        ),
                        const SizedBox(width: 10),
                        const Text('Cá nhân',
                            style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1F2937))),
                        const Spacer(),
                        GestureDetector(
                          onTap: () => Navigator.push(context,
                              MaterialPageRoute(builder: (_) => const EditProfileScreen())),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.edit_rounded, color: AppColors.primary, size: 14),
                                SizedBox(width: 6),
                                Text('Chỉnh sửa',
                                    style: TextStyle(
                                        color: AppColors.primary,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 12)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(height: 1, color: const Color(0xFFE5E7EB).withValues(alpha: 0.5)),

                  const SizedBox(height: 16),

                  // ─── Avatar + Info Card ───
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                              color: Colors.black.withValues(alpha: 0.05),
                              blurRadius: 12,
                              offset: const Offset(0, 4)),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 64,
                            height: 64,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.primary.withValues(alpha: 0.1),
                              border: Border.all(
                                  color: AppColors.primary.withValues(alpha: 0.2),
                                  width: 2),
                            ),
                            child: const Center(
                                child: Icon(Icons.person_rounded,
                                    size: 34, color: AppColors.primary)),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(fullName,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 17,
                                        color: Color(0xFF1F2937))),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.email_outlined,
                                        size: 12, color: Color(0xFF9CA3AF)),
                                    const SizedBox(width: 4),
                                    Flexible(
                                      child: Text(email,
                                          style: const TextStyle(
                                              fontSize: 12, color: Color(0xFF6B7280)),
                                          overflow: TextOverflow.ellipsis),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    const Icon(Icons.phone_outlined,
                                        size: 12, color: Color(0xFF9CA3AF)),
                                    const SizedBox(width: 4),
                                    Text(phone,
                                        style: const TextStyle(
                                            fontSize: 12, color: Color(0xFF6B7280))),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // ─── Vitals quick row ───
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        Expanded(child: _quickStatCard(gender == 'MALE' ? 'Nam' : gender == 'FEMALE' ? 'Nữ' : '---', 'Giới tính', Icons.person_outline_rounded, const Color(0xFF6366F1), const Color(0xFFEEF2FF))),
                        const SizedBox(width: 10),
                        Expanded(child: _quickStatCard(dob != null ? dob.toString().substring(0, 10) : '---', 'Ngày sinh', Icons.cake_outlined, const Color(0xFFF59E0B), const Color(0xFFFFFBEB))),
                        const SizedBox(width: 10),
                        Expanded(child: _quickStatCard(height != null ? '$height cm' : '---', 'Cao', Icons.height_rounded, const Color(0xFF10B981), const Color(0xFFECFDF5))),
                      ],
                    ),
                  ),

                  // ─── Sức khỏe ───
                  _sectionTitle('Thông tin sức khỏe', Icons.favorite_border_rounded),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: _healthCard(
                                icon: Icons.bloodtype_rounded,
                                iconColor: const Color(0xFFEF4444),
                                bgColor: const Color(0xFFFEF2F2),
                                label: 'Nhóm máu',
                                value: bloodType ?? 'Chưa có',
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _healthCard(
                                icon: Icons.height_rounded,
                                iconColor: const Color(0xFF6366F1),
                                bgColor: const Color(0xFFEEF2FF),
                                label: 'Chiều cao',
                                value: height != null ? '$height cm' : 'Chưa có',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _healthInfoCard(
                          icon: Icons.warning_amber_rounded,
                          iconColor: const Color(0xFFF59E0B),
                          bgColor: const Color(0xFFFFFBEB),
                          label: 'Dị ứng',
                          value: allergies ?? 'Không có thông tin',
                        ),
                        const SizedBox(height: 12),
                        _healthInfoCard(
                          icon: Icons.history_edu_rounded,
                          iconColor: const Color(0xFF10B981),
                          bgColor: const Color(0xFFECFDF5),
                          label: 'Tiền sử bệnh',
                          value: medicalHistory ?? 'Không có thông tin',
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ─── Cài đặt tài khoản ───
                  _sectionTitle('Tài khoản', Icons.manage_accounts_rounded),
                  const SizedBox(height: 10),
                  _menuGroup(context, [
                    _MenuItem(
                      icon: Icons.lock_outline_rounded,
                      iconBg: const Color(0xFFEEF2FF),
                      iconColor: const Color(0xFF6366F1),
                      title: 'Đổi mật khẩu',
                      onTap: () => _showChangePasswordDialog(context, auth),
                    ),
                    _MenuItem(
                      icon: Icons.language_rounded,
                      iconBg: const Color(0xFFECFDF5),
                      iconColor: const Color(0xFF10B981),
                      title: context.locale.languageCode == 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English',
                      trailingText: context.locale.languageCode == 'vi' ? 'VI' : 'EN',
                      onTap: () async {
                        if (context.locale.languageCode == 'vi') {
                          await context.setLocale(const Locale('en'));
                        } else {
                          await context.setLocale(const Locale('vi'));
                        }
                      },
                    ),
                  ]),

                  const SizedBox(height: 12),

                  // ─── Khác ───
                  _sectionTitle('Khác', Icons.more_horiz_rounded),
                  const SizedBox(height: 10),
                  _menuGroup(context, [
                    _MenuItem(
                      icon: Icons.star_border_rounded,
                      iconBg: const Color(0xFFFFFBEB),
                      iconColor: const Color(0xFFF59E0B),
                      title: 'Đánh giá & Góp ý',
                      onTap: () => Navigator.push(context,
                          MaterialPageRoute(builder: (_) => const FeedbackScreen())),
                    ),
                    _MenuItem(
                      icon: Icons.help_outline_rounded,
                      iconBg: const Color(0xFFF0F9FF),
                      iconColor: const Color(0xFF0EA5E9),
                      title: 'Hỗ trợ',
                      onTap: () {},
                    ),
                    _MenuItem(
                      icon: Icons.settings_outlined,
                      iconBg: const Color(0xFFF3F4F6),
                      iconColor: const Color(0xFF6B7280),
                      title: 'Cài đặt',
                      onTap: () {},
                    ),
                  ]),

                  const SizedBox(height: 12),

                  // ─── Logout ───
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: GestureDetector(
                      onTap: () async {
                        final confirmed = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            title: const Text('Đăng xuất', style: TextStyle(fontWeight: FontWeight.bold)),
                            content: const Text('Bạn có chắc muốn đăng xuất không?'),
                            actions: [
                              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Hủy')),
                              ElevatedButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                                child: const Text('Đăng xuất', style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        );
                        if (confirmed == true && context.mounted) {
                          await context.read<AuthProvider>().logout();
                          if (!context.mounted) return;
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(builder: (_) => const LoginScreen()),
                            (route) => false,
                          );
                        }
                      },
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                          boxShadow: [
                            BoxShadow(
                                color: Colors.red.withValues(alpha: 0.05),
                                blurRadius: 10,
                                offset: const Offset(0, 4))
                          ],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.logout_rounded, color: Colors.red, size: 18),
                            SizedBox(width: 10),
                            Text('Đăng xuất',
                                style: TextStyle(
                                    color: Colors.red,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15)),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 100),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _quickStatCard(String value, String label, IconData icon, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 3))
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 16),
          ),
          const SizedBox(height: 6),
          Text(value,
              style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  color: Color(0xFF1F2937)),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis),
          Text(label,
              style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 10),
              textAlign: TextAlign.center),
        ],
      ),
    );
  }


  Widget _sectionTitle(String title, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          Icon(icon, size: 16, color: const Color(0xFF6366F1)),
          const SizedBox(width: 8),
          Text(title,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF6B7280),
                  letterSpacing: 0.5)),
        ],
      ),
    );
  }

  Widget _menuGroup(BuildContext context, List<_MenuItem> items) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 12,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        children: items.asMap().entries.map((e) {
          final idx = e.key;
          final item = e.value;
          return Column(
            children: [
              InkWell(
                onTap: item.onTap,
                borderRadius: BorderRadius.circular(20),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: item.iconBg,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(item.icon, color: item.iconColor, size: 18),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                          child: Text(item.title,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 15,
                                  color: Color(0xFF1F2937)))),
                      if (item.trailingText != null)
                        Container(
                          padding:
                              const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                              color: const Color(0xFFF3F4F6),
                              borderRadius: BorderRadius.circular(8)),
                          child: Text(item.trailingText!,
                              style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF6B7280))),
                        ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward_ios_rounded,
                          color: Color(0xFFD1D5DB), size: 14),
                    ],
                  ),
                ),
              ),
              if (idx < items.length - 1)
                const Divider(
                    height: 1, thickness: 1, color: Color(0xFFF1F5F9), indent: 56, endIndent: 16),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _healthCard({
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(height: 10),
          Text(value,
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937))),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 12)),
        ],
      ),
    );
  }

  Widget _healthInfoCard({
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: Color(0xFF374151))),
                const SizedBox(height: 4),
                Text(value,
                    style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280), height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showChangePasswordDialog(BuildContext context, AuthProvider auth) {
    final currentPassCtrl = TextEditingController();
    final newPassCtrl = TextEditingController();
    final confirmPassCtrl = TextEditingController();
    bool obscureCurrent = true;
    bool obscureNew = true;
    bool obscureConfirm = true;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Row(
            children: [
              Icon(Icons.lock_rounded, color: Color(0xFF6366F1), size: 22),
              SizedBox(width: 10),
              Text('Đổi mật khẩu',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _pwField('Mật khẩu hiện tại', currentPassCtrl, obscureCurrent,
                  () => setDialogState(() => obscureCurrent = !obscureCurrent)),
              const SizedBox(height: 12),
              _pwField('Mật khẩu mới', newPassCtrl, obscureNew,
                  () => setDialogState(() => obscureNew = !obscureNew)),
              const SizedBox(height: 12),
              _pwField('Xác nhận mật khẩu mới', confirmPassCtrl, obscureConfirm,
                  () => setDialogState(() => obscureConfirm = !obscureConfirm)),
            ],
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Hủy', style: TextStyle(color: Color(0xFF6B7280)))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366F1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              onPressed: () async {
                if (newPassCtrl.text != confirmPassCtrl.text) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Mật khẩu xác nhận không khớp!'),
                        backgroundColor: Colors.red));
                  return;
                }
                Navigator.pop(ctx);
                final success = await auth.changePassword(
                    currentPassCtrl.text, newPassCtrl.text);
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                  content: Text(success
                      ? 'Đổi mật khẩu thành công!'
                      : (auth.error ?? 'Đổi mật khẩu thất bại!')),
                  backgroundColor: success ? const Color(0xFF10B981) : Colors.red,
                ));
              },
              child: const Text('Lưu', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _pwField(String hint, TextEditingController ctrl, bool obscure, VoidCallback toggle) {
    return TextField(
      controller: ctrl,
      obscureText: obscure,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF9CA3AF)),
        filled: true,
        fillColor: const Color(0xFFF3F4F6),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
        suffixIcon: IconButton(
          icon: Icon(obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              size: 18, color: const Color(0xFF9CA3AF)),
          onPressed: toggle,
        ),
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final String? trailingText;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    this.trailingText,
    required this.onTap,
  });
}
