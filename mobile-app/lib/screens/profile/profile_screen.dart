import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/screens/profile/edit_profile_screen.dart';
import 'package:clinic_management_system/screens/profile/edit_medical_profile_screen.dart';
import 'package:clinic_management_system/screens/profile/feedback_screen.dart';
import 'package:clinic_management_system/screens/profile/review_history_screen.dart';
import 'package:clinic_management_system/screens/profile/faq_screen.dart';
import 'package:provider/provider.dart';
import 'package:easy_localization/easy_localization.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Consumer<AuthProvider>(
        builder: (context, auth, child) {
          final user = auth.user;
          final fullName = user?['fullName'] ?? 'Người dùng';
          final email = user?['email'] ?? '---';
          final phone = user?['phone'] ?? '---';
          final gender = user?['gender'];
          final dob = user?['dateOfBirth'];
          final address = user?['address'];
          final roleName = user?['roleName'] ?? 'Bệnh nhân';
          
          final height = user?['height'];
          final weight = user?['weight'];
          final bloodPressure = user?['bloodPressure'];
          final pulse = user?['pulse'];
          final bloodType = user?['bloodType'];
          final allergies = user?['allergies'];
          final chronicDiseases = user?['chronicDiseases'];
          final medicalHistory = user?['medicalHistory'];

          String genderLabel = '---';
          if (gender == 'MALE') genderLabel = 'Nam';
          if (gender == 'FEMALE') genderLabel = 'Nữ';

          String dobFormatted = '---';
          if (dob != null) {
            try {
              final d = DateTime.parse(dob.toString());
              dobFormatted = '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
            } catch (_) {
              dobFormatted = dob.toString().substring(0, 10);
            }
          }

          return CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // ─── Hero Header ───
              SliverToBoxAdapter(
                child: _buildHeroHeader(context, auth, fullName, email, roleName),
              ),

              // ─── Thông tin cá nhân ───
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 20, 20, 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Thông tin cá nhân', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF64748B), letterSpacing: 0.3)),
                      GestureDetector(
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const EditProfileScreen())),
                        child: const Row(
                          children: [
                            Text('Chi tiết', style: TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.w600, fontSize: 13)),
                            SizedBox(width: 4),
                            Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Color(0xFF2563EB)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildCard([
                    _buildInfoRow(
                      icon: Icons.location_on_outlined,
                      iconBg: const Color(0xFFF1F5F9),
                      iconColor: const Color(0xFF64748B),
                      title: 'Địa chỉ',
                      value: address ?? 'Chưa cập nhật',
                    ),
                    _buildDivider(),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(12)),
                                  child: const Icon(Icons.phone_outlined, size: 20, color: Color(0xFF2563EB)),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('Số điện thoại', style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                                      const SizedBox(height: 4),
                                      Text(phone, style: const TextStyle(fontSize: 15, color: Color(0xFF0F172A), fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(width: 1, height: 40, color: const Color(0xFFE2E8F0)),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(color: const Color(0xFFFDF4FF), borderRadius: BorderRadius.circular(12)),
                                  child: const Icon(Icons.person_outline_rounded, size: 20, color: Color(0xFFC026D3)),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('Giới tính', style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                                      const SizedBox(height: 4),
                                      Text(genderLabel, style: const TextStyle(fontSize: 15, color: Color(0xFF0F172A), fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ]),
                ),
              ),

              // ─── Hồ sơ sức khỏe ───
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 20, 20, 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Hồ sơ sức khoẻ', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF64748B), letterSpacing: 0.3)),
                      GestureDetector(
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const EditMedicalProfileScreen())),
                        child: const Row(
                          children: [
                            Text('Chi tiết', style: TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.w600, fontSize: 13)),
                            SizedBox(width: 4),
                            Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Color(0xFF2563EB)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildCard([
                    _buildInfoRow(
                      icon: Icons.height_rounded,
                      iconBg: const Color(0xFFF1F5F9),
                      iconColor: const Color(0xFF64748B),
                      title: 'Chiều cao / Cân nặng',
                      value: (height != null || weight != null) ? '${height ?? '--'} cm / ${weight ?? '--'} kg' : 'Chưa cập nhật',
                    ),
                    _buildDivider(),
                    _buildInfoRow(
                      icon: Icons.bloodtype_outlined,
                      iconBg: const Color(0xFFFEF2F2),
                      iconColor: const Color(0xFFEF4444),
                      title: 'Nhóm máu',
                      value: bloodType ?? 'Chưa cập nhật',
                    ),
                    _buildDivider(),
                    _buildInfoRow(
                      icon: Icons.warning_amber_rounded,
                      iconBg: const Color(0xFFFFFBEB),
                      iconColor: const Color(0xFFF59E0B),
                      title: 'Dị ứng',
                      value: allergies != null && allergies.toString().isNotEmpty ? allergies.toString() : 'Không có ghi nhận',
                      isWarning: allergies != null && allergies.toString().isNotEmpty && allergies.toString().toLowerCase() != 'không',
                    ),
                  ]),
                ),
              ),

              // ─── Tài khoản ───
              SliverToBoxAdapter(
                child: _buildSectionTitle('Tài khoản'),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildCard([
                    _buildActionRow(
                      context,
                      icon: Icons.lock_outline_rounded,
                      iconColor: const Color(0xFF7C3AED),
                      iconBg: const Color(0xFFF5F3FF),
                      title: 'Đổi mật khẩu',
                      subtitle: 'Bảo mật tài khoản của bạn',
                      onTap: () => _showChangePasswordSheet(context, auth),
                    ),
                    // _buildDivider(),
                    // _buildActionRow(
                    //   context,
                    //   icon: Icons.language_rounded,
                    //   iconColor: const Color(0xFF059669),
                    //   iconBg: const Color(0xFFECFDF5),
                    //   title: context.locale.languageCode == 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English',
                    //   subtitle: context.locale.languageCode == 'vi' ? 'Nhấn để chuyển sang tiếng Anh' : 'Tap to switch to Vietnamese',
                    //   trailing: Container(
                    //     padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    //     decoration: BoxDecoration(
                    //       color: const Color(0xFFECFDF5),
                    //       borderRadius: BorderRadius.circular(8),
                    //     ),
                    //     child: Text(
                    //       context.locale.languageCode == 'vi' ? 'VI' : 'EN',
                    //       style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF059669)),
                    //     ),
                    //   ),
                    //   onTap: () async {
                    //     if (context.locale.languageCode == 'vi') {
                    //       await context.setLocale(const Locale('en'));
                    //     } else {
                    //       await context.setLocale(const Locale('vi'));
                    //     }
                    //   },
                    // ),
                  ]),
                ),
              ),

              // ─── Khác ───
              SliverToBoxAdapter(child: _buildSectionTitle('Khác')),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildCard([
                    _buildActionRow(
                      context,
                      icon: Icons.star_outline_rounded,
                      iconColor: const Color(0xFFF59E0B),
                      iconBg: const Color(0xFFFFFBEB),
                      title: 'Đánh giá & Góp ý',
                      subtitle: 'Giúp chúng tôi cải thiện dịch vụ',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FeedbackScreen())),
                    ),
                    _buildDivider(),
                    _buildActionRow(
                      context,
                      icon: Icons.history_rounded,
                      iconColor: const Color(0xFF10B981),
                      iconBg: const Color(0xFFD1FAE5),
                      title: 'Lịch sử đánh giá',
                      subtitle: 'Xem lại các đánh giá đã gửi',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ReviewHistoryScreen())),
                    ),
                    _buildDivider(),
                    _buildActionRow(
                      context,
                      icon: Icons.help_outline_rounded,
                      iconColor: const Color(0xFF0EA5E9),
                      iconBg: const Color(0xFFF0F9FF),
                      title: 'Trung tâm hỗ trợ',
                      subtitle: 'Câu hỏi thường gặp, liên hệ',
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FAQScreen())),
                    ),
                  ]),
                ),
              ),

              // ─── Đăng xuất ───
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
                  child: _buildLogoutButton(context, auth),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 140)),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeroHeader(BuildContext context, AuthProvider auth, String fullName, String email, String roleName) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0369A1), Color(0xFF0EA5E9)],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
          child: Column(
            children: [
              // AppBar row
              Row(
                children: [
                  const Text(
                    'Hồ sơ',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const EditProfileScreen())),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white.withOpacity(0.25)),
                      ),
                      child: const Text(
                        'Chỉnh sửa',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Avatar + info
              Row(
                children: [
                  // Avatar
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.2),
                      border: Border.all(color: Colors.white.withOpacity(0.4), width: 2.5),
                    ),
                    child: const Center(
                      child: Icon(Icons.person_rounded, size: 42, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 18),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          fullName,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                            letterSpacing: -0.4,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Row(
                          children: [
                            Icon(Icons.email_outlined, size: 13, color: Colors.white.withOpacity(0.7)),
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                email,
                                style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.8)),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.white.withOpacity(0.2)),
                          ),
                          child: Text(
                            roleName,
                            style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.9), fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickInfoGrid(String phone, String gender, String dob, String? address) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _buildInfoChip(Icons.phone_rounded, 'Điện thoại', phone, const Color(0xFF0284C7), const Color(0xFFF0F9FF))),
            const SizedBox(width: 12),
            Expanded(child: _buildInfoChip(Icons.person_outline_rounded, 'Giới tính', gender, const Color(0xFF7C3AED), const Color(0xFFF5F3FF))),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildInfoChip(Icons.cake_outlined, 'Ngày sinh', dob, const Color(0xFF059669), const Color(0xFFECFDF5))),
            const SizedBox(width: 12),
            Expanded(child: _buildInfoChip(Icons.location_on_outlined, 'Địa chỉ', address ?? '---', const Color(0xFFF59E0B), const Color(0xFFFFFBEB))),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoChip(IconData icon, String label, String value, Color iconColor, Color bgColor) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 12, offset: const Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, size: 18, color: iconColor),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 12, 20, 10),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w700,
          color: Color(0xFF64748B),
          letterSpacing: 0.3,
        ),
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
      child: Column(children: children),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String value,
    bool isWarning = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, size: 20, color: iconColor),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: isWarning ? const Color(0xFFDC2626) : const Color(0xFF0F172A),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionRow(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Widget? trailing,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, size: 20, color: iconColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF0F172A))),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                ],
              ),
            ),
            const SizedBox(width: 8),
            trailing ?? const Icon(Icons.chevron_right_rounded, size: 20, color: Color(0xFFCBD5E1)),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return const Padding(
      padding: EdgeInsets.only(left: 72),
      child: Divider(height: 1, color: Color(0xFFF1F5F9)),
    );
  }

  Widget _buildLogoutButton(BuildContext context, AuthProvider auth) {
    return GestureDetector(
      onTap: () => _handleLogout(context, auth),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFFEE2E2)),
          boxShadow: [
            BoxShadow(color: Colors.red.withOpacity(0.04), blurRadius: 12, offset: const Offset(0, 3)),
          ],
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 20),
            SizedBox(width: 10),
            Text(
              'Đăng xuất',
              style: TextStyle(color: Color(0xFFDC2626), fontWeight: FontWeight.w700, fontSize: 15),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleLogout(BuildContext context, AuthProvider auth) async {
    final confirmed = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 36),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 24),
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(20)),
              child: const Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 30),
            ),
            const SizedBox(height: 16),
            const Text('Đăng xuất', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
            const SizedBox(height: 8),
            const Text(
              'Bạn có chắc muốn đăng xuất khỏi ứng dụng?',
              style: TextStyle(fontSize: 14, color: Color(0xFF64748B), height: 1.5),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => Navigator.pop(ctx, false),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Text('Hủy', textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF334155), fontSize: 15)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GestureDetector(
                    onTap: () => Navigator.pop(ctx, true),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFDC2626),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Text('Đăng xuất', textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 15)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );

    if (confirmed == true && context.mounted) {
      await auth.logout();
      if (!context.mounted) return;
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  void _showChangePasswordSheet(BuildContext context, AuthProvider auth) {
    final currentPassCtrl = TextEditingController();
    final newPassCtrl = TextEditingController();
    final confirmPassCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          bool obscureCurrent = true;
          bool obscureNew = true;
          bool obscureConfirm = true;

          return Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 36),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(2))),
                  ),
                  const SizedBox(height: 16),
                  Center(
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFBFDBFE), width: 1.5),
                      ),
                      child: const Icon(Icons.lock_person_rounded, color: Color(0xFF2563EB), size: 28),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Center(child: Text('Đổi mật khẩu', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)))),
                  const SizedBox(height: 4),
                  const Center(child: Text('Mật khẩu mới phải khác mật khẩu hiện tại', style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)))),
                  const SizedBox(height: 24),
                  _buildPasswordField('Mật khẩu hiện tại', currentPassCtrl, obscureCurrent, () => setSheetState(() => obscureCurrent = !obscureCurrent), Icons.lock_outline_rounded),
                  const SizedBox(height: 14),
                  _buildPasswordField('Mật khẩu mới', newPassCtrl, obscureNew, () => setSheetState(() => obscureNew = !obscureNew), Icons.key_rounded),
                  const SizedBox(height: 14),
                  _buildPasswordField('Xác nhận mật khẩu mới', confirmPassCtrl, obscureConfirm, () => setSheetState(() => obscureConfirm = !obscureConfirm), Icons.key_rounded),
                  const SizedBox(height: 28),
                  SizedBox(
                    width: double.infinity,
                    child: GestureDetector(
                      onTap: () async {
                        if (newPassCtrl.text != confirmPassCtrl.text) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Mật khẩu xác nhận không khớp!'), backgroundColor: Color(0xFFDC2626)),
                          );
                          return;
                        }
                        Navigator.pop(ctx);
                        final success = await auth.changePassword(currentPassCtrl.text, newPassCtrl.text);
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                          content: Text(success ? 'Đổi mật khẩu thành công!' : (auth.error ?? 'Đổi mật khẩu thất bại!')),
                          backgroundColor: success ? const Color(0xFF059669) : const Color(0xFFDC2626),
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ));
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [Color(0xFF0284C7), Color(0xFF38BDF8)]),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: const Text('Xác nhận đổi mật khẩu', textAlign: TextAlign.center, style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildPasswordField(String label, TextEditingController ctrl, bool obscure, VoidCallback toggle, IconData prefixIcon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
        const SizedBox(height: 8),
        TextField(
          controller: ctrl,
          obscureText: obscure,
          style: const TextStyle(fontSize: 15, color: Color(0xFF0F172A)),
          decoration: InputDecoration(
            prefixIcon: Icon(prefixIcon, size: 20, color: const Color(0xFF64748B)),
            filled: true,
            fillColor: const Color(0xFFF8FAFC),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFF2563EB), width: 1.5),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            suffixIcon: IconButton(
              icon: Icon(
                obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                size: 19,
                color: const Color(0xFF94A3B8),
              ),
              onPressed: toggle,
            ),
          ),
        ),
      ],
    );
  }
}
