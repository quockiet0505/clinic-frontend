// --- lib/screens/main_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  
  // Using placeholders for unbuilt screens to avoid errors
  final List<Widget> _screens = [
    const HomeScreen(),
    const AppointmentScreen(),
    const Center(child: Text('Records (Coming Soon)')),
    const Center(child: Text('Chat AI (Coming Soon)')),
    const Center(child: Text('Profile (Coming Soon)')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      body: IndexedStack(index: _currentIndex, children: _screens),
      
      // Modern Bottom Navigation Bar
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.08),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
          borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
            backgroundColor: Colors.white,
            selectedItemColor: AppColors.primary,
            unselectedItemColor: AppColors.textSubLight.withOpacity(0.5),
            type: BottomNavigationBarType.fixed,
            elevation: 0,
            showSelectedLabels: true,
            showUnselectedLabels: true,
            selectedLabelStyle: AppStyles.caption.copyWith(fontWeight: FontWeight.bold, fontSize: 11),
            unselectedLabelStyle: AppStyles.caption.copyWith(fontSize: 10),
            items: const [
              BottomNavigationBarItem(icon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.home_outlined)), activeIcon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.home_rounded)), label: 'Home'),
              BottomNavigationBarItem(icon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.calendar_today_outlined)), activeIcon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.calendar_month_rounded)), label: 'Schedule'),
              BottomNavigationBarItem(icon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.receipt_long_outlined)), activeIcon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.receipt_rounded)), label: 'Records'),
              BottomNavigationBarItem(icon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.chat_bubble_outline_rounded)), activeIcon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.chat_bubble_rounded)), label: 'Chat'),
              BottomNavigationBarItem(icon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.person_outline_rounded)), activeIcon: Padding(padding: EdgeInsets.only(bottom: 4), child: Icon(Icons.person_rounded)), label: 'Profile'),
            ],
          ),
        ),
      ),
    );
  }
}