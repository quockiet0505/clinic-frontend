import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_time_screen.dart';
import 'package:clinic_management_system/models/service_model.dart';
import 'package:clinic_management_system/utils/service_price_utils.dart';
import 'package:clinic_management_system/widgets/common/clinic_list_toolbar.dart';
import 'package:clinic_management_system/widgets/common/clinic_segmented_tabs.dart';
import 'package:clinic_management_system/widgets/common/service_price_text.dart';

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
    ClinicTabItem(value: 'EXAM', label: 'Khám bệnh'),
    ClinicTabItem(value: 'LAB_TEST', label: 'Xét nghiệm'),
    ClinicTabItem(value: 'IMAGING', label: 'Chẩn đoán hình ảnh'),
  ];

  List<ServiceModel> _filter(List<ServiceModel> source) {
    var list = source.where((s) {
      final matchesSearch = _searchQuery.isEmpty ||
          s.serviceName.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesType = _selectedType == 'ALL' || s.serviceType == _selectedType;
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
      body: Consumer<HomeProvider>(
        builder: (context, provider, child) {
          final filtered = _filter(provider.services);

          return Column(
            children: [
              _buildHeader(context),
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
                child: provider.isLoading
                    ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                    : _buildServiceList(context, filtered, provider),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      color: const Color(0xFFF8FAFF),
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 12,
        left: 20,
        right: 20,
        bottom: 12,
      ),
      child: Row(
        children: [
          Container(
            height: 40,
            width: 40,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight, size: 18),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          const Expanded(
            child: Text(
              'Tất cả dịch vụ',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textMainLight),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(width: 40),
        ],
      ),
    );
  }

  Widget _buildServiceList(BuildContext context, List<ServiceModel> services, HomeProvider provider) {
    if (services.isEmpty) {
      return Center(
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
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
      itemCount: services.length,
      itemBuilder: (context, index) {
        final service = services[index];
        return GestureDetector(
          onTap: () {
            context.read<AppointmentProvider>().selectService(service);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const SelectTimeScreen()));
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(color: AppColors.primary.withValues(alpha: 0.04), blurRadius: 16, offset: const Offset(0, 4)),
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
                      height: 140,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        height: 140,
                        color: AppColors.accentMint,
                        child: const Center(child: Icon(Icons.biotech_rounded, color: AppColors.secondary, size: 40)),
                      ),
                    ),
                    if (service.hasDiscount)
                      Positioned(
                        top: 10,
                        right: 10,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '-${service.discountPercent}%',
                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w800),
                          ),
                        ),
                      ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              serviceTypeLabel(service.serviceType),
                              style: AppStyles.caption.copyWith(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 10),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        service.serviceName,
                        style: AppStyles.heading3.copyWith(fontSize: 16, color: AppColors.textMainLight),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 10),
                      ServicePriceText(service: service),
                      if (service.description != null && service.description!.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        Text(
                          service.description!,
                          style: AppStyles.caption.copyWith(color: AppColors.textSubLight, height: 1.4),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      const SizedBox(height: 14),
                      Container(
                        width: double.infinity,
                        height: 40,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF60A5FA)]),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'Đặt khám ngay',
                          style: AppStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
