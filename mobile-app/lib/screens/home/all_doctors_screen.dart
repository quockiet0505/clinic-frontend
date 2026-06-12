import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/widgets/common/custom_search_bar.dart';
import 'package:clinic_management_system/utils/image_utils.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_time_screen.dart';
import 'package:clinic_management_system/models/doctor_model.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';

class AllDoctorsScreen extends StatefulWidget {
  const AllDoctorsScreen({super.key});

  @override
  State<AllDoctorsScreen> createState() => _AllDoctorsScreenState();
}

class _AllDoctorsScreenState extends State<AllDoctorsScreen> {
  int _selectedSpecialtyIndex = 0;
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: const GradientAppBar(
        title: 'Tất cả Bác sĩ',
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
                child: CustomSearchBar(
                  hintText: 'Tìm kiếm bác sĩ, chuyên khoa...',
                  autofocus: true,
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val.toLowerCase();
                    });
                  },
                  onFilterTap: () {},
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
                            color: isSelected ? AppColors.primary : AppColors.textSubLight.withValues(alpha: 0.2),
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
                  padding: const EdgeInsets.symmetric(horizontal: 20).copyWith(bottom: 100),
                  itemCount: homeProvider.doctors.length,
                  itemBuilder: (context, index) {
                    final doctor = homeProvider.doctors[index];
                    
                    // Basic filtering logic based on specialty
                    if (_selectedSpecialtyIndex != 0) {
                      final selectedSpecialty = homeProvider.specialties[_selectedSpecialtyIndex - 1]['expertiseName'];
                      if (doctor.specialty != selectedSpecialty) {
                        return const SizedBox.shrink();
                      }
                    }

                    // Filtering based on search query
                    if (_searchQuery.isNotEmpty) {
                      final doctorName = (doctor.name ?? '').toLowerCase();
                      final doctorSpec = (doctor.specialty ?? '').toLowerCase();
                      if (!doctorName.contains(_searchQuery) && !doctorSpec.contains(_searchQuery)) {
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

  Widget _buildDoctorCard(BuildContext context, DoctorModel doctor, AppointmentProvider appointmentProvider, HomeProvider homeProvider) {
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
          border: Border.all(color: AppColors.textSubLight.withValues(alpha: 0.1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            Hero(
              tag: 'all_doctor_img_${doctor.id}', // changed tag to avoid conflict if both screens in stack
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  ImageUtils.fixImageUrl(doctor.imageUrl),
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
                    doctor.name ?? 'Unknown',
                    style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${doctor.specialty} • ClinicCare',
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
                            '${doctor.rating.toStringAsFixed(1)} (${doctor.viewCount})',
                            style: AppStyles.caption.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      Text(
                        CurrencyFormatter.formatVND(doctor.consultationFee),
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
