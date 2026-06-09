import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';

class SelectDoctorScreen extends StatefulWidget {
  const SelectDoctorScreen({super.key});

  @override
  State<SelectDoctorScreen> createState() => _SelectDoctorScreenState();
}

class _SelectDoctorScreenState extends State<SelectDoctorScreen> {
  int _selectedSpecialtyIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: const GradientAppBar(
        title: 'Chọn Bác sĩ',
      ),
      body: Consumer2<HomeProvider, AppointmentProvider>(
        builder: (context, homeProvider, appointmentProvider, child) {
          if (homeProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return Column(
            children: [
              // 1. Search Bar
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 48,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [BoxShadow(color: AppColors.textSubLight.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10))],
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.search_rounded, color: AppColors.textSubLight.withOpacity(0.7)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextField(
                                decoration: InputDecoration(
                                  hintText: 'Tìm kiếm bác sĩ, chuyên khoa...',
                                  hintStyle: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight.withOpacity(0.7)),
                                  border: InputBorder.none,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Container(
                      height: 48, width: 48,
                      decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4))]),
                      child: IconButton(
                        icon: const Icon(Icons.tune_rounded, color: Colors.white, size: 24),
                        onPressed: () {},
                      ),
                    ),
                  ],
                ),
              ),

              // 2. Specialty Categories
              SizedBox(
                height: 50,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: homeProvider.specialties.length + 1, // +1 for "All"
                  itemBuilder: (context, index) {
                    final isSelected = _selectedSpecialtyIndex == index;
                    final isAll = index == 0;
                    final specialtyName = isAll ? 'Tất cả' : homeProvider.specialties[index - 1]['expertiseName'];
                    
                    return GestureDetector(
                      onTap: () => setState(() => _selectedSpecialtyIndex = index),
                      child: Container(
                        margin: const EdgeInsets.only(right: 12),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary : Colors.transparent,
                          border: Border.all(
                            color: isSelected ? AppColors.primary : AppColors.textSubLight.withOpacity(0.2),
                          ),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Text(
                          specialtyName ?? '',
                          style: AppStyles.bodyMedium.copyWith(
                            color: isSelected ? Colors.white : AppColors.textSubLight,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),

              // 3. Doctors List
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: homeProvider.doctors.length,
                  itemBuilder: (context, index) {
                    final doctor = homeProvider.doctors[index];
                    
                    // Basic filtering logic based on specialty
                    if (_selectedSpecialtyIndex != 0) {
                      final selectedSpecialty = homeProvider.specialties[_selectedSpecialtyIndex - 1]['expertiseName'];
                      if (doctor['expertiseName'] != selectedSpecialty) {
                        return const SizedBox.shrink();
                      }
                    }

                    return _buildDoctorCard(context, doctor, appointmentProvider, homeProvider);
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildDoctorCard(BuildContext context, Map<String, dynamic> doctor, AppointmentProvider appointmentProvider, HomeProvider homeProvider) {
    return GestureDetector(
      onTap: () {
        appointmentProvider.selectDoctor(doctor);
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SelectTimeScreen()),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            Hero(
              tag: 'doctor_img_${doctor['staffId']}',
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  homeProvider.fixImageUrl(doctor['imageUrl']),
                  height: 80,
                  width: 80,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200], height: 80, width: 80, child: const Icon(Icons.person, color: Colors.grey)),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    doctor['fullName'] ?? 'Unknown',
                    style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${doctor['expertiseName']} • ClinicCare',
                    style: AppStyles.caption.copyWith(color: AppColors.textSubLight),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, color: AppColors.warning, size: 18),
                          const SizedBox(width: 4),
                          Text(
                            '5.0 (120)',
                            style: AppStyles.caption.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      Text(
                        '\$50', // Would get from API /doctor_service_price if available
                        style: AppStyles.bodyLarge.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}