import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_time_screen.dart';
import 'package:clinic_management_system/screens/home/all_doctors_screen.dart';
import 'package:clinic_management_system/screens/home/all_services_screen.dart';
import 'package:clinic_management_system/screens/home/all_specialties_screen.dart';
import 'package:clinic_management_system/screens/notifications/notification_screen.dart';
import 'package:clinic_management_system/screens/notifications/notification_screen.dart';
import 'package:clinic_management_system/utils/service_price_utils.dart';
import 'package:clinic_management_system/widgets/common/service_price_text.dart';
import 'package:easy_localization/easy_localization.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HomeProvider>().fetchHomeData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFDBEAFE), // Blue-100 (Xanh nhạt)
              Colors.white,      // Trắng
              Color(0xFFEFF6FF), // Blue-50 (Xanh trắng)
            ],
            stops: [0.0, 0.4, 1.0],
          ),
        ),
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: () => context.read<HomeProvider>().fetchHomeData(),
            child: Consumer<HomeProvider>(
              builder: (context, provider, child) {
                return SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.only(bottom: 30),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(provider),
                      const SizedBox(height: 24),
                      if (provider.quickActions.isNotEmpty || provider.isLoading) _buildQuickIcons(provider),
                      const SizedBox(height: 24),
                      if (provider.bannerUrl != null || provider.isLoading) _buildBanner(provider),
                      const SizedBox(height: 32),
                      _buildTopDoctors(provider),
                      const SizedBox(height: 32),
                      _buildServices(provider),
                      const SizedBox(height: 32),
                      _buildCategories(provider),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(HomeProvider provider) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          Row(
            children: [
              if (provider.logoUrl != null)
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2))]),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: Image.network(
                      provider.fixImageUrl(provider.logoUrl),
                      height: 32,
                      width: 32,
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) => const Icon(Icons.local_hospital, color: AppColors.primary, size: 32),
                    ),
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2))]),
                  child: const Icon(Icons.local_hospital, color: AppColors.primary, size: 32),
                ),
              
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('home_greeting'.tr(), style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
                  Text(context.read<AuthProvider>().user?['fullName'] ?? 'Bệnh nhân', style: AppStyles.heading2.copyWith(color: AppColors.textMainLight, fontSize: 18)),
                ],
              ),
              const Spacer(),
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    height: 40, width: 40,
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))]),
                    child: IconButton(
                      icon: const Icon(Icons.notifications_none_rounded, color: AppColors.primary, size: 24),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationScreen()));
                      },
                    ),
                  ),
                  Positioned(
                    top: -2, right: -2,
                    child: Container(
                      width: 12, height: 12,
                      decoration: BoxDecoration(color: AppColors.error, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Search Bar
          Container(
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
                  child: Text('home_find_doctor'.tr(), style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight.withOpacity(0.7))),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickIcons(HomeProvider provider) {
    if (provider.isLoading) {
      return Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[100]!,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(4, (index) => Container(height: 70, width: 70, color: Colors.white)),
          ),
        ),
      );
    }

    return SizedBox(
      height: 110,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: provider.quickActions.length,
        itemBuilder: (context, index) {
          final action = provider.quickActions[index];
          // Kích thước để hiển thị 4 mục trên màn hình
          final itemWidth = (MediaQuery.of(context).size.width - 40) / 4;
          
          return GestureDetector(
            onTap: () {
              if (action['id'] == 2) {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AllSpecialtiesScreen()));
              } else if (action['id'] == 3) {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AllServicesScreen()));
              } else if (action['id'] == 5 || action['id'] == 1 || action['id'] == 4) {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AllDoctorsScreen()));
              }
            },
            child: SizedBox(
              width: itemWidth,
              child: Column(
                children: [
                  Container(
                    height: 55, width: 55,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
                    ),
                    child: Image.network(
                      provider.fixImageUrl(action['iconUrl']),
                      errorBuilder: (context, error, stackTrace) => const Icon(Icons.category, color: AppColors.primary),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 2.0),
                    child: SizedBox(
                      height: 28, // Đảm bảo luôn chiếm khoảng trống 2 dòng chữ để các icon thẳng hàng
                      child: Text(
                        action['title'] ?? '',
                        style: AppStyles.caption.copyWith(color: AppColors.textMainLight, fontSize: 11, fontWeight: FontWeight.w600, height: 1.2),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
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

  Widget _buildBanner(HomeProvider provider) {
    if (provider.isLoading) {
      return Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[100]!,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 24),
          height: 160,
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Container(
        height: 160,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          gradient: const LinearGradient(
            colors: [AppColors.primary, AppColors.secondary],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10)),
          ],
        ),
        child: Stack(
          children: [
            // Background Vector Icon overlay
            Positioned(
              right: -20,
              bottom: -20,
              child: Icon(
                Icons.health_and_safety_rounded,
                size: 150,
                color: Colors.white.withOpacity(0.15),
              ),
            ),
            // Banner Content
            Positioned(
              left: 20,
              top: 30,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2), 
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text('Dịch vụ mới', style: AppStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 12),
                  Text('Tư vấn trực tuyến\nvới chuyên gia', style: AppStyles.heading3.copyWith(color: Colors.white)),
                  const SizedBox(height: 8),
                  Text('Khám bệnh từ xa mọi lúc mọi nơi', style: AppStyles.caption.copyWith(color: Colors.white.withOpacity(0.9))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopDoctors(HomeProvider provider) {
    return Column(
      children: [
        _buildSectionHeader('Bác sĩ nổi bật', onViewAll: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AllDoctorsScreen()));
        }),
        const SizedBox(height: 16),
        SizedBox(
          height: 190, // Reduced from 220
          child: provider.isLoading
              ? _buildShimmerCards()
              : ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  itemCount: provider.doctors.length,
                  itemBuilder: (context, index) {
                    final doctor = provider.doctors[index];
                    return _buildDoctorCard(context, doctor, provider);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildDoctorCard(BuildContext context, DoctorModel doctor, HomeProvider provider) {
    return GestureDetector(
      onTap: () {
        context.read<AppointmentProvider>().selectDoctor(doctor);
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SelectTimeScreen()),
        );
      },
      child: Container(
        width: 130, // Reduced from 160 to fit 3 on screen
        margin: const EdgeInsets.only(right: 12, bottom: 10),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white, 
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: AppColors.textSubLight.withOpacity(0.08), blurRadius: 15, offset: const Offset(0, 5)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Hero(
              tag: 'doctor_img_home_${doctor.id}',
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  provider.fixImageUrl(doctor.imageUrl), 
                  height: 90, width: double.infinity, fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200], height: 90, child: const Icon(Icons.person, color: Colors.grey)),
                ),
              ),
            ),
            const Spacer(),
            Text(doctor.name ?? 'Bác sĩ', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontSize: 13, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 2),
            Text(doctor.specialty ?? 'Chuyên khoa', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontSize: 10)),
            const SizedBox(height: 4),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(color: AppColors.warning.withOpacity(0.1), borderRadius: BorderRadius.circular(6)),
                  child: Row(
                    children: [
                      const Icon(Icons.star_rounded, color: AppColors.warning, size: 12),
                      const SizedBox(width: 2),
                      Text('5.0', style: AppStyles.caption.copyWith(color: AppColors.warning, fontSize: 10, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServices(HomeProvider provider) {
    final displayServices = provider.featuredServices;

    return Column(
      children: [
        _buildSectionHeader('Dịch vụ nổi bật', onViewAll: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AllServicesScreen()));
        }),
        const SizedBox(height: 16),
        SizedBox(
          height: 280,
          child: provider.isLoading
              ? _buildShimmerCards()
              : displayServices.isEmpty
                  ? Center(
                      child: Text('Chưa có dịch vụ nổi bật', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                    )
                  : ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      itemCount: displayServices.length,
                      itemBuilder: (context, index) {
                        final service = displayServices[index];
                        return _buildFeaturedServiceCard(context, service, provider);
                      },
                    ),
        ),
      ],
    );
  }

  Widget _buildFeaturedServiceCard(BuildContext context, dynamic service, HomeProvider provider) {
    return GestureDetector(
      onTap: () {
        context.read<AppointmentProvider>().selectService(service);
        Navigator.push(context, MaterialPageRoute(builder: (_) => const SelectTimeScreen()));
      },
      child: Container(
        width: 220,
        margin: const EdgeInsets.only(right: 14, bottom: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(color: AppColors.primary.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 6)),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Image.network(
                  provider.fixImageUrl(service.imageUrl),
                  height: 110,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 110,
                    color: AppColors.accentMint,
                    child: const Icon(Icons.biotech_rounded, color: AppColors.secondary, size: 36),
                  ),
                ),
                if (service.hasDiscount)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF4444),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '-${service.discountPercent}%',
                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),
              ],
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      service.serviceName,
                      style: AppStyles.bodyLarge.copyWith(
                        color: AppColors.textMainLight,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        height: 1.25,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    ServicePriceText(service: service, priceFontSize: 14, strikeFontSize: 10),
                    const SizedBox(height: 10),
                    Container(
                      width: double.infinity,
                      height: 34,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF2563EB), Color(0xFF60A5FA)],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'Đặt khám ngay',
                        style: AppStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategories(HomeProvider provider) {
    return Column(
      children: [
        _buildSectionHeader('Chuyên khoa', onViewAll: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AllSpecialtiesScreen()));
        }),
        const SizedBox(height: 16),
        SizedBox(
          height: 110,
          child: provider.isLoading
              ? Shimmer.fromColors(
                  baseColor: Colors.grey[300]!,
                  highlightColor: Colors.grey[100]!,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: 4,
                    itemBuilder: (context, index) {
                      final itemWidth = (MediaQuery.of(context).size.width - 40) / 4;
                      return SizedBox(
                        width: itemWidth,
                        child: Column(
                          children: [
                            Container(height: 55, width: 55, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16))),
                            const SizedBox(height: 8),
                            Container(height: 12, width: 40, color: Colors.white),
                          ],
                        ),
                      );
                    },
                  ),
                )
              : ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: provider.specialties.length,
                  itemBuilder: (context, index) {
                    final specialty = provider.specialties[index];
                    final itemWidth = (MediaQuery.of(context).size.width - 40) / 4;
                    return GestureDetector(
                      onTap: () {
                        context.read<AppointmentProvider>().selectSpecialty(specialty);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const SelectTimeScreen()));
                      },
                      child: SizedBox(
                        width: itemWidth,
                        child: Column(
                          children: [
                            Container(
                              height: 55, width: 55,
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white, 
                                borderRadius: BorderRadius.circular(16), 
                                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4))]
                              ),
                              child: Image.network(
                                provider.fixImageUrl(specialty['iconUrl'] ?? specialty['imageUrl']),
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => const Icon(Icons.medical_services, color: AppColors.primary, size: 24),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 2.0),
                              child: SizedBox(
                                height: 28, // Đảm bảo luôn chiếm khoảng trống 2 dòng chữ
                                child: Text(
                                  specialty['expertiseName'] ?? '', 
                                  style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight, fontSize: 11, fontWeight: FontWeight.w600, height: 1.2),
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title, {VoidCallback? onViewAll}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
          GestureDetector(
            onTap: onViewAll,
            child: Text('Xem tất cả', style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildShimmerCards() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 24),
        itemCount: 3,
        itemBuilder: (context, index) {
          return Container(
            width: 160,
            margin: const EdgeInsets.only(right: 16, bottom: 10),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
          );
        },
      ),
    );
  }
}