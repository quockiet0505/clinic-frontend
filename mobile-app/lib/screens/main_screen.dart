import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/screens/records/records_screen.dart';
import 'package:clinic_management_system/screens/chat/chat_screen.dart';
import 'package:clinic_management_system/screens/profile/profile_screen.dart';

import 'package:easy_localization/easy_localization.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    const HomeScreen(),
    const AppointmentScreen(),
    const RecordsScreen(),
    const ChatScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      body: IndexedStack(index: _currentIndex, children: _screens),
      
      // Solid Bottom Navigation Bar
      extendBody: false,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Container(
            height: 70,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.home_rounded, Icons.home_outlined, 'tab_home'.tr()),
                _buildNavItem(1, Icons.calendar_month_rounded, Icons.calendar_today_outlined, 'tab_schedule'.tr()),
                _buildNavItem(2, Icons.receipt_rounded, Icons.receipt_long_outlined, 'tab_records'.tr()),
                _buildNavItem(3, Icons.chat_bubble_rounded, Icons.chat_bubble_outline_rounded, 'tab_chat'.tr()),
                _buildNavItem(4, Icons.person_rounded, Icons.person_outline_rounded, 'tab_profile'.tr()),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData activeIcon, IconData inactiveIcon, String label) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutQuint,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isSelected ? activeIcon : inactiveIcon,
              color: isSelected ? AppColors.primary : AppColors.textSubLight.withOpacity(0.6),
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: AppStyles.caption.copyWith(
                color: isSelected ? AppColors.primary : AppColors.textSubLight.withOpacity(0.6),
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }
}