import 'package:clinic_management_system/app_exports.dart';
import 'package:shimmer/shimmer.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';

import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_doctor_screen.dart';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class AllSpecialtiesScreen extends StatelessWidget {
  const AllSpecialtiesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: const GradientAppBar(title: 'Tất cả Chuyên khoa'),
      body: Consumer<HomeProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }

          final specialties = provider.specialties;

          return GridView.builder(
            padding: const EdgeInsets.all(24),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              mainAxisSpacing: 24,
              crossAxisSpacing: 16,
              childAspectRatio: 0.65,
            ),
            itemCount: specialties.length,
            itemBuilder: (context, index) {
              final specialty = specialties[index];
              return GestureDetector(
                onTap: () {
                  context.read<AppointmentProvider>().selectSpecialty(specialty);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const SelectDoctorScreen()));
                },
                child: Column(
                  children: [
                    Expanded(
                      child: AspectRatio(
                        aspectRatio: 1,
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(color: AppColors.primary.withOpacity(0.08), blurRadius: 15, offset: const Offset(0, 5)),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: CachedNetworkImage(imageUrl: provider.fixImageUrl(specialty['iconUrl'] ?? specialty['imageUrl']),
                        memCacheWidth: 400,
                        fadeInDuration: Duration.zero,
                        fadeOutDuration: Duration.zero,
                              fit: BoxFit.cover,
                              errorWidget: (context, url, error) => const Icon(Icons.medical_services, color: AppColors.primary, size: 36),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      specialty['expertiseName'] ?? '',
                      style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold, fontSize: 12),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
