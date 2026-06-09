import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/screens/profile/edit_profile_screen.dart';
import 'package:clinic_management_system/screens/profile/billing_screen.dart';
import 'package:clinic_management_system/screens/profile/feedback_screen.dart';
import 'package:provider/provider.dart';
import 'package:easy_localization/easy_localization.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: GradientAppBar(
        title: 'profile_title'.tr(),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            // User Header
            Consumer<AuthProvider>(
              builder: (context, auth, child) {
                final user = auth.user;
                final fullName = user?['fullName'] ?? 'Người dùng';
                final email = user?['email'] ?? 'Đang tải...';

                return Center(
                  child: Column(
                    children: [
                      Stack(
                        children: [
                          Container(
                            width: 90,
                            height: 90,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.primary.withOpacity(0.05),
                              border: Border.all(color: Colors.white, width: 3),
                              boxShadow: [
                                BoxShadow(color: AppColors.primary.withOpacity(0.1), blurRadius: 15, offset: const Offset(0, 8)),
                              ],
                            ),
                            child: const Center(
                              child: Icon(Icons.person, size: 40, color: AppColors.primary),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                              child: const Icon(Icons.camera_alt, color: Colors.white, size: 14),
                            ),
                          )
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(fullName, style: AppStyles.heading3.copyWith(color: AppColors.textMainLight, fontSize: 18)),
                      const SizedBox(height: 2),
                      Text(email, style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 32),

            // Options
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: Column(
                children: [
                  _buildOptionItem(context, Icons.person_outline, 'profile_edit'.tr(), () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const EditProfileScreen()));
                  }),
                  _buildDivider(),
                  _buildOptionItem(context, Icons.receipt_long_rounded, 'profile_billing'.tr(), () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const BillingScreen()));
                  }),
                  _buildDivider(),
                  _buildOptionItem(context, Icons.star_border_rounded, 'profile_feedback'.tr(), () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const FeedbackScreen()));
                  }),
                ],
              ),
            ),
            const SizedBox(height: 20),
            
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: Column(
                children: [
                  _buildOptionItem(context, Icons.language_rounded, 'profile_language'.tr(), () async {
                    if (context.locale.languageCode == 'vi') {
                      await context.setLocale(const Locale('en'));
                    } else {
                      await context.setLocale(const Locale('vi'));
                    }
                  }, trailingText: context.locale.languageCode == 'vi' ? 'Tiếng Việt' : 'English'),
                  _buildDivider(),
                  _buildOptionItem(context, Icons.help_outline, 'profile_support'.tr(), () {}),
                  _buildDivider(),
                  _buildOptionItem(context, Icons.settings_outlined, 'profile_settings'.tr(), () {}),
                  _buildDivider(),
                  _buildOptionItem(context, Icons.logout_rounded, 'profile_logout'.tr(), () async {
                    await context.read<AuthProvider>().logout();
                    if (!context.mounted) return;
                    Navigator.pushAndRemoveUntil(
                      context, 
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                    );
                  }, isDestructive: true),
                ],
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildOptionItem(BuildContext context, IconData icon, String title, VoidCallback onTap, {bool isDestructive = false, String? trailingText}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isDestructive ? Colors.red.withOpacity(0.1) : AppColors.primary.withOpacity(0.05),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: isDestructive ? Colors.red : AppColors.primary, size: 18),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title, 
                style: AppStyles.bodyMedium.copyWith(
                  color: isDestructive ? Colors.red : AppColors.textMainLight,
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                )
              ),
            ),
            if (trailingText != null)
              Text(trailingText, style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
            if (trailingText != null) const SizedBox(width: 8),
            Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textSubLight.withOpacity(0.4), size: 14),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(height: 1, thickness: 1, color: const Color(0xFFF1F5F9), indent: 56, endIndent: 16);
  }
}
