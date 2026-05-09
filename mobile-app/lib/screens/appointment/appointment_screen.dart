// --- lib/screens/appointment/appointment_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class AppointmentScreen extends StatelessWidget {
  const AppointmentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: AppColors.bgLight,
        appBar: AppBar(
          backgroundColor: AppColors.bgLight,
          elevation: 0,
          title: Text('My Appointments', 
            style: AppStyles.heading2.copyWith(color: AppColors.textMainLight)),
          centerTitle: false,
          automaticallyImplyLeading: false,
          bottom: TabBar(
            indicatorColor: AppColors.primary,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSubLight,
            labelStyle: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold),
            unselectedLabelStyle: AppStyles.bodyLarge,
            indicatorWeight: 3,
            tabs: const [
              Tab(text: 'Upcoming'),
              Tab(text: 'Past'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildUpcomingTab(context),
            _buildPastTab(),
          ],
        ),
        floatingActionButton: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.3), 
                blurRadius: 15, 
                offset: const Offset(0, 5)
              ),
            ],
          ),
          child: FloatingActionButton.extended(
            backgroundColor: AppColors.primary,
            elevation: 0,
            onPressed: () {
              // Chuyển sang màn hình chọn Bác sĩ
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SelectDoctorScreen()),
              );
            },
            icon: const Icon(Icons.add_rounded, color: Colors.white),
            label: Text('Book Now', style: AppStyles.buttonText),
          ),
        ),
      ),
    );
  }

  Widget _buildUpcomingTab(BuildContext context) {
    // Màn hình này hiển thị danh sách lịch đã đặt (Mockup)
    return ListView.builder(
      padding: const EdgeInsets.all(24),
      itemCount: 1, 
      itemBuilder: (context, index) {
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Oct 27, 2026 - 10:00 AM', 
                    style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                  Text('Confirmed', style: TextStyle(color: AppColors.primary)),
                ],
              ),
              const Divider(height: 32),
              Row(
                children: [
                  const CircleAvatar(backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=5')),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Dr. Alexa Johnson', style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                      Text('Neurology', style: AppStyles.caption),
                    ],
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPastTab() {
    return const Center(child: Text('No past appointments'));
  }
}