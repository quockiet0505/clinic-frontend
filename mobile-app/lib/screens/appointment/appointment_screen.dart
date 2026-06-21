import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/utils/image_utils.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_doctor_screen.dart';
import 'package:clinic_management_system/models/appointment_model.dart';
import 'package:clinic_management_system/screens/appointment/appointment_detail_screen.dart';
import 'package:intl/intl.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:clinic_management_system/widgets/common/clinic_list_toolbar.dart';
import 'package:clinic_management_system/widgets/common/clinic_segmented_tabs.dart';

class AppointmentScreen extends StatefulWidget {
  const AppointmentScreen({super.key});

  @override
  State<AppointmentScreen> createState() => _AppointmentScreenState();
}

class _AppointmentScreenState extends State<AppointmentScreen> {
  String _searchQuery = '';
  String _selectedTab = 'ALL';
  DateTime? _filterDate;

  static const _tabs = [
    ClinicTabItem(value: 'ALL', label: 'Tất cả'),
    ClinicTabItem(value: 'UPCOMING', label: 'Sắp tới'),
    ClinicTabItem(value: 'COMPLETED', label: 'Hoàn thành'),
    ClinicTabItem(value: 'CANCELLED', label: 'Đã hủy'),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AppointmentProvider>().fetchMyAppointments();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      body: SafeArea(
        child: Column(
          children: [
            // ─── Header ───
            Container(
              color: const Color(0xFFF8FAFF),
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.calendar_month_rounded, color: AppColors.primary, size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'Lịch hẹn',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1F2937),
                        ),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () => Navigator.push(context,
                            MaterialPageRoute(builder: (_) => const SelectDoctorScreen())),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF2DD4BF), Color(0xFF0EA5E9)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(color: const Color(0xFF0EA5E9).withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 3)),
                            ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.add_rounded, color: Colors.white, size: 18),
                              SizedBox(width: 4),
                              Text('Đặt lịch', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  ClinicListToolbar(
                    searchHint: 'Tìm bác sĩ, chuyên khoa...',
                    onSearchChanged: (v) => setState(() => _searchQuery = v.trim()),
                    onDateFilterTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _filterDate ?? DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2100),
                      );
                      if (date != null) setState(() => _filterDate = date);
                    },
                    dateFilterActive: _filterDate != null,
                    tabs: _tabs,
                    selectedTab: _selectedTab,
                    onTabChanged: (v) => setState(() => _selectedTab = v),
                    padding: EdgeInsets.zero,
                  ),
                  if (_filterDate != null) ...[
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: InputChip(
                        label: Text(
                          'Ngày: ${DateFormat('dd/MM/yyyy').format(_filterDate!)}',
                          style: const TextStyle(fontSize: 12),
                        ),
                        onDeleted: () => setState(() => _filterDate = null),
                        deleteIconColor: AppColors.primary,
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // ─── Body ───
            Expanded(
              child: Consumer<AppointmentProvider>(
                builder: (context, provider, child) {
                  if (provider.isLoading) {
                    return const Center(child: CircularProgressIndicator(color: AppColors.primary));
                  }

                  final filtered = _filterAppointments(provider.myAppointments);
                  return _buildList(filtered, provider.myAppointments.isNotEmpty, context.read<HomeProvider>());
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<AppointmentModel> _filterAppointments(List<AppointmentModel> source) {
    List<AppointmentModel> result;
    switch (_selectedTab) {
      case 'UPCOMING':
        result = source.where((a) => a.status == 'SCHEDULED' || a.status == 'CONFIRMED' || a.status == 'PENDING').toList();
        break;
      case 'COMPLETED':
        result = source.where((a) => a.status == 'COMPLETED').toList();
        break;
      case 'CANCELLED':
        result = source.where((a) => a.status == 'CANCELLED').toList();
        break;
      default:
        result = List.from(source);
    }

    if (_filterDate != null) {
      result = result.where((a) {
        try {
          final d = DateTime.parse(a.appointmentDate);
          return d.year == _filterDate!.year && d.month == _filterDate!.month && d.day == _filterDate!.day;
        } catch (_) {
          return false;
        }
      }).toList();
    }

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      result = result.where((a) =>
          (a.doctorName ?? '').toLowerCase().contains(q) ||
          (a.specialty ?? '').toLowerCase().contains(q)).toList();
    }
    return result;
  }

  Widget _buildList(List<AppointmentModel> appointments, bool hasAny, HomeProvider homeProvider) {
    if (appointments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.08),
                shape: BoxShape.circle,
              ),
              child: Icon(
                hasAny ? Icons.search_off_rounded : Icons.calendar_today_rounded,
                size: 48, color: AppColors.primary.withValues(alpha: 0.5)
              ),
            ),
            const SizedBox(height: 16),
            Text(
              hasAny ? 'Không tìm thấy lịch hẹn' : 'Bạn chưa có lịch hẹn nào',
              style: const TextStyle(color: Color(0xFF6B7280), fontSize: 15, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 8),
            Text(
              hasAny ? 'Thử tìm kiếm khác' : 'Hãy đặt lịch khám ngay hôm nay!',
              style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 13),
            ),
          ],
        ),
      );
    }

    appointments.sort((a, b) => b.appointmentDate.compareTo(a.appointmentDate));

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 32),
      itemCount: appointments.length,
      itemBuilder: (context, index) => _buildCard(appointments[index], homeProvider),
    );
  }

  Widget _buildCard(AppointmentModel apt, HomeProvider homeProvider) {
    final doctor = homeProvider.doctors.where((d) => d.id == apt.mainDoctorId).firstOrNull;
    final avatarUrl = ImageUtils.fixImageUrl(apt.doctorAvatar ?? doctor?.imageUrl);
    final doctorName = apt.doctorName ?? 'Bác sĩ';
    final expertise = apt.specialty ?? 'Chuyên khoa';

    String formattedDate = '';
    try {
      final d = DateTime.parse(apt.appointmentDate);
      formattedDate = DateFormat('EEE, dd/MM/yyyy').format(d);
    } catch (_) {
      formattedDate = apt.appointmentDate;
    }
    final formattedTime = (apt.timeStart?.length ?? 0) >= 5 ? apt.timeStart!.substring(0, 5) : (apt.timeStart ?? '--:--');

    Color statusColor;
    String statusText;
    IconData statusIcon;
    switch (apt.status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
      case 'PENDING':
        statusColor = const Color(0xFF10B981);
        statusText = 'Sắp tới';
        statusIcon = Icons.event_available_rounded;
        break;
      case 'CANCELLED':
        statusColor = const Color(0xFFEF4444);
        statusText = 'Đã hủy';
        statusIcon = Icons.cancel_rounded;
        break;
      case 'COMPLETED':
        statusColor = const Color(0xFF6366F1);
        statusText = 'Hoàn thành';
        statusIcon = Icons.check_circle_rounded;
        break;
      default:
        statusColor = const Color(0xFF9CA3AF);
        statusText = apt.status;
        statusIcon = Icons.info_rounded;
    }

    final isOnline = apt.appointmentType == 'ONLINE';

    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(
        builder: (_) => AppointmentDetailScreen(appointment: apt)
      )),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, 6)),
          ],
        ),
        child: Column(
          children: [
            // Top strip
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: statusColor.withValues(alpha: 0.08),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: Row(
                children: [
                  Icon(statusIcon, color: statusColor, size: 16),
                  const SizedBox(width: 6),
                  Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 13)),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: (isOnline ? const Color(0xFF3B82F6) : const Color(0xFFF59E0B)).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isOnline ? Icons.smartphone_rounded : Icons.directions_walk_rounded,
                          size: 12,
                          color: isOnline ? const Color(0xFF3B82F6) : const Color(0xFFF59E0B),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          isOnline ? 'Đặt online' : 'Walk-in',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isOnline ? const Color(0xFF3B82F6) : const Color(0xFFF59E0B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [statusColor.withValues(alpha: 0.6), statusColor],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: CircleAvatar(
                      radius: 26,
                      backgroundColor: Colors.grey[200],
                      backgroundImage: NetworkImage(avatarUrl),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF1F2937))),
                        const SizedBox(height: 2),
                        Text(expertise, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.schedule_rounded, size: 14, color: Color(0xFF9CA3AF)),
                            const SizedBox(width: 4),
                            Text(formattedTime, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF374151))),
                            const SizedBox(width: 12),
                            const Icon(Icons.calendar_month_rounded, size: 14, color: Color(0xFF9CA3AF)),
                            const SizedBox(width: 4),
                            Text(formattedDate, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right_rounded, color: Color(0xFFD1D5DB), size: 22),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
