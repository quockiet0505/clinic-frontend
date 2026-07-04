import 'package:clinic_management_system/app_exports.dart';
import 'package:shimmer/shimmer.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_time_screen.dart';
import 'package:clinic_management_system/models/service_model.dart';
import 'package:clinic_management_system/utils/service_price_utils.dart';
import 'package:clinic_management_system/widgets/common/clinic_list_toolbar.dart';
import 'package:clinic_management_system/widgets/common/clinic_segmented_tabs.dart';
import 'package:clinic_management_system/widgets/common/service_price_text.dart';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class AllServicesScreen extends StatefulWidget {
  const AllServicesScreen({super.key});

  @override
  State<AllServicesScreen> createState() => _AllServicesScreenState();
}

class _AllServicesScreenState extends State<AllServicesScreen> {
  String _searchQuery = '';
  String _selectedType = 'ALL';
  int _sortByPrice = 0;

  static const _typeTabs = [
    ClinicTabItem(value: 'ALL', label: 'Tất cả'),
    ClinicTabItem(value: 'DISCOUNT', label: 'Giảm giá'),
    ClinicTabItem(value: 'LAB_TEST', label: 'Xét nghiệm'),
    ClinicTabItem(value: 'X_RAY', label: 'Chụp X-Quang'),
  ];

  /// Merge `services` + `featuredServices` (unique theo serviceId) để bảo đảm hiển thị
  /// đầy đủ cả các dịch vụ nổi bật lẫn các dịch vụ thường.
  List<ServiceModel> _mergedServices(HomeProvider provider) {
    final seen = <int>{};
    final merged = <ServiceModel>[];
    for (final list in [provider.services, provider.featuredServices]) {
      for (final s in list) {
        if (seen.add(s.serviceId)) merged.add(s);
      }
    }
    return merged;
  }

  List<ServiceModel> _filter(List<ServiceModel> source) {
    var list = source.where((s) {
      if (s.effectivePrice <= 0) return false;
      if (!isPatientBookableService(s.serviceType)) return false;

      final matchesSearch = _searchQuery.isEmpty ||
          s.serviceName.toLowerCase().contains(_searchQuery.toLowerCase());

      final bool matchesType;
      switch (_selectedType) {
        case 'ALL':
          matchesType = true;
          break;
        case 'DISCOUNT':
          matchesType = s.hasDiscount;
          break;
        default:
          matchesType = s.serviceType == _selectedType;
      }
      return matchesSearch && matchesType;
    }).toList();

    if (_sortByPrice == 1) {
      list.sort((a, b) => a.effectivePrice.compareTo(b.effectivePrice));
    } else if (_sortByPrice == 2) {
      list.sort((a, b) => b.effectivePrice.compareTo(a.effectivePrice));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      appBar: const GradientAppBar(title: 'Tất cả dịch vụ'),
      body: Column(
        children: [
          ClinicListToolbar(
            searchHint: 'Tìm kiếm dịch vụ...',
            onSearchChanged: (v) => setState(() => _searchQuery = v.trim()),
            sortState: _sortByPrice,
            onSortTap: () => setState(() => _sortByPrice = (_sortByPrice + 1) % 3),
            tabs: _typeTabs,
            selectedTab: _selectedType,
            onTabChanged: (v) => setState(() => _selectedType = v),
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
          ),
          Expanded(
            child: Consumer<HomeProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return const Center(child: CircularProgressIndicator(color: AppColors.primary));
                }
                final filtered = _filter(_mergedServices(provider));
                return AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  switchInCurve: Curves.easeOut,
                  switchOutCurve: Curves.easeIn,
                  child: _buildServiceList(
                    context,
                    filtered,
                    provider,
                    key: ValueKey('$_selectedType-$_sortByPrice'),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceList(BuildContext context, List<ServiceModel> services, HomeProvider provider, {Key? key}) {
    if (services.isEmpty) {
      return Center(
        key: key,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off_rounded, size: 48, color: AppColors.primary.withValues(alpha: 0.35)),
            const SizedBox(height: 12),
            Text(
              provider.services.isEmpty ? 'Chưa có dịch vụ' : 'Không tìm thấy dịch vụ phù hợp',
              style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      key: key,
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
      itemCount: services.length,
      itemBuilder: (context, index) => _ServiceListCard(
        service: services[index],
        provider: provider,
      ),
    );
  }
}

/// Single service row — clean trust-first layout: image • content • price chevron.
/// Tap toàn bộ card để chuyển sang chọn lịch.
class _ServiceListCard extends StatelessWidget {
  final ServiceModel service;
  final HomeProvider provider;

  const _ServiceListCard({required this.service, required this.provider});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        clipBehavior: Clip.antiAlias,
        elevation: 0,
        child: InkWell(
          onTap: () {
            context.read<AppointmentProvider>().selectService(service);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const SelectTimeScreen()));
          },
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFFE2E8F0)),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: CachedNetworkImage(imageUrl: provider.fixImageUrl(service.imageUrl),
                        memCacheWidth: 400,
                        fadeInDuration: Duration.zero,
                        fadeOutDuration: Duration.zero,
                        height: 76,
                        width: 76,
                        fit: BoxFit.cover,
                        errorWidget: (context, url, error) => Container(
                          height: 76,
                          width: 76,
                          decoration: BoxDecoration(
                            color: AppColors.accentMint,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(Icons.biotech_rounded, color: AppColors.secondary, size: 30),
                        ),
                      ),
                    ),
                    if (service.hasDiscount)
                      Positioned(
                        top: -6,
                        left: -6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '-${service.discountPercent}%',
                            style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          serviceTypeLabel(service.serviceType),
                          style: AppStyles.caption.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                            fontSize: 10,
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
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
                      const SizedBox(height: 4),
                      if (service.description != null && service.description!.isNotEmpty)
                        Text(
                          service.description!,
                          style: AppStyles.caption.copyWith(
                            color: AppColors.textSubLight,
                            fontSize: 11,
                            height: 1.35,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      const SizedBox(height: 8),
                      ServicePriceText(service: service, priceFontSize: 14, strikeFontSize: 10),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                const Padding(
                  padding: EdgeInsets.only(top: 4),
                  child: Icon(
                    Icons.chevron_right_rounded,
                    color: Color(0xFFCBD5E1),
                    size: 22,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
