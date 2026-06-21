import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_time_screen.dart';
import 'package:clinic_management_system/models/doctor_model.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';
import 'package:clinic_management_system/utils/image_utils.dart';
import 'package:clinic_management_system/widgets/common/clinic_list_toolbar.dart';
import 'package:clinic_management_system/widgets/common/clinic_segmented_tabs.dart';

class AllDoctorsScreen extends StatefulWidget {
  const AllDoctorsScreen({super.key});

  @override
  State<AllDoctorsScreen> createState() => _AllDoctorsScreenState();
}

class _AllDoctorsScreenState extends State<AllDoctorsScreen> {
  String _selectedSpecialty = 'ALL';
  String _searchQuery = '';
  int _sortByFee = 0;

  List<ClinicTabItem> _specialtyTabs(HomeProvider provider) {
    return [
      const ClinicTabItem(value: 'ALL', label: 'Tất cả'),
      ...provider.specialties.map(
        (s) => ClinicTabItem(
          value: '${s['expertiseId'] ?? s['expertiseName']}',
          label: s['expertiseName'] ?? 'Chuyên khoa',
        ),
      ),
    ];
  }

  List<DoctorModel> _filterDoctors(HomeProvider provider) {
    var list = provider.doctors.where((doctor) {
      if (_selectedSpecialty != 'ALL') {
        final tab = _specialtyTabs(provider).firstWhere((t) => t.value == _selectedSpecialty);
        if (doctor.specialty != tab.label) return false;
      }
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final name = (doctor.name ?? '').toLowerCase();
        final spec = (doctor.specialty ?? '').toLowerCase();
        if (!name.contains(q) && !spec.contains(q)) return false;
      }
      return true;
    }).toList();

    if (_sortByFee == 1) {
      list.sort((a, b) => a.consultationFee.compareTo(b.consultationFee));
    } else if (_sortByFee == 2) {
      list.sort((a, b) => b.consultationFee.compareTo(a.consultationFee));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      body: Consumer2<HomeProvider, AppointmentProvider>(
        builder: (context, homeProvider, appointmentProvider, child) {
          if (homeProvider.isLoading) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }

          final doctors = _filterDoctors(homeProvider);
          final tabs = _specialtyTabs(homeProvider);

          return Column(
            children: [
              _buildHeader(context),
              ClinicListToolbar(
                searchHint: 'Tìm kiếm bác sĩ, chuyên khoa...',
                autofocusSearch: true,
                onSearchChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
                sortState: _sortByFee,
                onSortTap: () => setState(() => _sortByFee = (_sortByFee + 1) % 3),
                tabs: tabs,
                selectedTab: _selectedSpecialty,
                onTabChanged: (v) => setState(() => _selectedSpecialty = v),
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
              ),
              Expanded(
                child: doctors.isEmpty
                    ? Center(
                        child: Text(
                          homeProvider.doctors.isEmpty ? 'Chưa có bác sĩ' : 'Không tìm thấy bác sĩ phù hợp',
                          style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                        itemCount: doctors.length,
                        itemBuilder: (context, index) =>
                            _buildDoctorCard(context, doctors[index], appointmentProvider),
                      ),
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
              'Tất cả bác sĩ',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textMainLight),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(width: 40),
        ],
      ),
    );
  }

  Widget _buildDoctorCard(BuildContext context, DoctorModel doctor, AppointmentProvider appointmentProvider) {
    return GestureDetector(
      onTap: () {
        appointmentProvider.selectDoctor(doctor);
        Navigator.push(context, MaterialPageRoute(builder: (context) => const SelectTimeScreen()));
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4))],
        ),
        child: Row(
          children: [
            Hero(
              tag: 'all_doctor_img_${doctor.id}',
              child: ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(
                  ImageUtils.fixImageUrl(doctor.imageUrl),
                  height: 76,
                  width: 76,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      Container(color: Colors.grey[200], height: 76, width: 76, child: const Icon(Icons.person, color: Colors.grey)),
                ),
              ),
            ),
            const SizedBox(width: 14),
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
                    doctor.specialty ?? 'Chuyên khoa',
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
                          const Icon(Icons.star_rounded, color: AppColors.warning, size: 16),
                          const SizedBox(width: 4),
                          Text(
                            doctor.rating.toStringAsFixed(1),
                            style: AppStyles.caption.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      Text(
                        CurrencyFormatter.formatVND(doctor.consultationFee),
                        style: AppStyles.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold),
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
