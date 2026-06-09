import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_time_screen.dart';

class AllDoctorsScreen extends StatelessWidget {
  const AllDoctorsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      body: Consumer<HomeProvider>(
        builder: (context, provider, child) {
          return Column(
            children: [
              _buildHeader(context),
              Expanded(
                child: provider.isLoading
                    ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                    : _buildDoctorList(context, provider),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFDBEAFE), // Blue-100
            Colors.white,
          ],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    height: 40, width: 40,
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))]),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight, size: 18),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  const Expanded(
                    child: Text('Tất cả Bác sĩ', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textMainLight), textAlign: TextAlign.center),
                  ),
                  const SizedBox(width: 40), // Balance the back button
                ],
              ),
              const SizedBox(height: 24),
              Row(
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
                                hintText: 'Tìm kiếm bác sĩ...',
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
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDoctorList(BuildContext context, HomeProvider provider) {
    final doctors = provider.doctors;
    
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      itemCount: doctors.length,
      itemBuilder: (context, index) {
        final doctor = doctors[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 20),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(color: AppColors.primary.withOpacity(0.04), blurRadius: 20, offset: const Offset(0, 5)),
            ],
          ),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Doctor Image
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.network(
                      provider.fixImageUrl(doctor['imageUrl']),
                      width: 80,
                      height: 80,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        width: 80, height: 80,
                        decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                        child: const Icon(Icons.person, color: AppColors.primary, size: 40),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  // Doctor Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          doctor['doctorName'] ?? 'Bác sĩ',
                          style: AppStyles.heading3.copyWith(fontSize: 16, color: AppColors.textMainLight),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          doctor['specialty'] ?? 'Chuyên khoa Nội',
                          style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.w600),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.star_rounded, color: Colors.orange[400], size: 16),
                            const SizedBox(width: 4),
                            Text('4.8 (120+)', style: AppStyles.caption.copyWith(fontWeight: FontWeight.bold, color: AppColors.textMainLight)),
                            const SizedBox(width: 12),
                            Icon(Icons.work_history_rounded, color: AppColors.primary, size: 14),
                            const SizedBox(width: 4),
                            Text('> 5 năm', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.bgLight,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Giá khám', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                          const SizedBox(height: 2),
                          Text('${doctor['price'] ?? '150.000'} VND', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    SizedBox(
                      height: 36,
                      child: GradientButton(
                        text: 'Đặt khám',
                        height: 36,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        onPressed: () {
                          context.read<AppointmentProvider>().selectDoctor(doctor);
                          Navigator.push(context, MaterialPageRoute(builder: (context) => const SelectTimeScreen()));
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
