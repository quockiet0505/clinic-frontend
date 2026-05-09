// --- lib/screens/home/home_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight, 
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Header Section
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Good Morning,', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
                        const SizedBox(height: 4),
                        Text('John Wilson 👋', style: AppStyles.heading2.copyWith(color: AppColors.textMainLight)),
                      ],
                    ),
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
                      ),
                      child: const CircleAvatar(
                        radius: 22,
                        backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=11'),
                      ),
                    ),
                  ],
                ),
              ),

              // 2. Search Bar Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        height: 56,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(color: AppColors.primary.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 5)),
                          ],
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.search_rounded, color: AppColors.textSubLight.withOpacity(0.7)),
                            const SizedBox(width: 12),
                            Text('Search doctor, specialist...', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight.withOpacity(0.7))),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Container(
                      height: 56, width: 56,
                      decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(16)),
                      child: const Icon(Icons.tune_rounded, color: Colors.white),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // 3. Upcoming Appointment Banner
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF7A5AF8), Color(0xFF9E84FF)], 
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10)),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                        child: Text('Upcoming Appointment', style: AppStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(height: 16),
                      Text('Today, 14:00 PM', style: AppStyles.heading3.copyWith(color: Colors.white)),
                      const SizedBox(height: 4),
                      Text('Dr. Alexa Johnson - Cardiology', style: AppStyles.bodyMedium.copyWith(color: Colors.white.withOpacity(0.8))),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // 4. Categories Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Categories', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                    Text('See All', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              SizedBox(
                height: 100, // Height to fit icon and text
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  itemCount: MockData.specialties.length,
                  itemBuilder: (context, index) {
                    final specialty = MockData.specialties[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 20),
                      child: _buildCategoryItem(
                        specialty['icon'], 
                        specialty['name'], 
                        specialty['bgColor'], 
                        specialty['iconColor']
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 32),

              // 5. Top Doctors Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Top Doctors', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                    Text('See All', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 220,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  itemCount: MockData.popularDoctors.length,
                  itemBuilder: (context, index) {
                    final doctor = MockData.popularDoctors[index];
                    return _buildDoctorCard(doctor);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper Widget: Category Item
  Widget _buildCategoryItem(IconData icon, String label, Color bgColor, Color iconColor) {
    return Column(
      children: [
        Container(
          height: 65, width: 65,
          decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(20)),
          child: Icon(icon, color: iconColor, size: 30),
        ),
        const SizedBox(height: 8),
        Text(label, style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.w600)),
      ],
    );
  }

  // Helper Widget: Doctor Card
  Widget _buildDoctorCard(Map<String, dynamic> doctor) {
    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 16, bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: AppColors.textSubLight.withOpacity(0.08), blurRadius: 15, offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.network(doctor['image'], height: 110, width: double.infinity, fit: BoxFit.cover),
          ),
          const Spacer(),
          Text(doctor['name'], style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 2),
          Text(doctor['specialty'], style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
          const SizedBox(height: 6),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: AppColors.warning.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                child: Row(
                  children: [
                    const Icon(Icons.star_rounded, color: AppColors.warning, size: 14),
                    const SizedBox(width: 4),
                    Text('${doctor['rating']} (${doctor['reviews']})', style: AppStyles.caption.copyWith(color: AppColors.warning, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}