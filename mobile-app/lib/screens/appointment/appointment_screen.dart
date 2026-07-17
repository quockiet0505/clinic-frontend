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
  String _selectedStatus = 'ALL';
  String _selectedType = 'ALL';
  DateTime? _filterDate;

  String _statusLabel(String val) {
    switch (val) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'CHECKED_IN': return 'Đã check-in';
      case 'IN_PROGRESS': return 'Đang khám';
      case 'WAITING_RESULT': return 'Chờ kết quả';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã huỷ';
      case 'SKIPPED': return 'Bị qua lượt';
      case 'NO_SHOW': return 'Không đến khám';
      default: return 'Tất cả trạng thái';
    }
  }

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
      body: Column(
        children: [
          // ─── Header ───
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFFDBEAFE), Color(0xFFF8FAFF)],
                stops: [0.0, 1.0],
              ),
            ),
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 16,
              left: 20,
              right: 20,
              bottom: 0,
            ),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF0284C7), Color(0xFF38BDF8)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.calendar_month_rounded, color: Colors.white, size: 20),
                        ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Lịch hẹn',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1F2937),
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Quản lý lịch khám',
                              style: TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SelectDoctorScreen())),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
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
                              Icon(Icons.add_rounded, color: Colors.white, size: 16),
                              SizedBox(width: 4),
                              Text('Đặt lịch', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
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
                    tabs: const [
                      ClinicTabItem(value: 'ALL', label: 'Tất cả'),
                      ClinicTabItem(value: 'ONLINE', label: 'Online'),
                      ClinicTabItem(value: 'WALK_IN', label: 'Walk-in'),
                    ],
                    selectedTab: _selectedType,
                    onTabChanged: (v) => setState(() => _selectedType = v),
                    padding: EdgeInsets.zero,
                    trailingTabWidget: GestureDetector(
                      onTap: () {
                        showModalBottomSheet(
                          context: context,
                          backgroundColor: Colors.transparent,
                          isScrollControlled: true,
                          builder: (BuildContext context) {
                            final statuses = [
                              'ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 
                              'WAITING_RESULT', 'COMPLETED', 'CANCELLED', 'SKIPPED', 'NO_SHOW'
                            ];
                            return Container(
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                              ),
                              padding: const EdgeInsets.fromLTRB(0, 12, 0, 24),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(2))),
                                  const SizedBox(height: 20),
                                  const Text('Lọc theo trạng thái', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                                  const SizedBox(height: 16),
                                  ...statuses.map((item) {
                                    final isSelected = item == _selectedStatus;
                                    return InkWell(
                                      onTap: () {
                                        setState(() => _selectedStatus = item);
                                        Navigator.pop(context);
                                      },
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                        color: isSelected ? const Color(0xFFEFF6FF) : Colors.transparent,
                                        child: Row(
                                          children: [
                                            Text(
                                              _statusLabel(item),
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                                                color: isSelected ? const Color(0xFF2563EB) : const Color(0xFF334155),
                                              ),
                                            ),
                                            const Spacer(),
                                            if (isSelected) const Icon(Icons.check_circle_rounded, color: Color(0xFF2563EB), size: 20),
                                          ],
                                        ),
                                      ),
                                    );
                                  }),
                                  const SizedBox(height: 16),
                                ],
                              ),
                            );
                          },
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          children: [
                            const Text('Trạng thái', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B))),
                            const SizedBox(width: 2),
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: _selectedStatus != 'ALL' ? const Color(0xFF2563EB) : Colors.transparent,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: Color(0xFF64748B)),
                          ],
                        ),
                      ),
                    ),
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
                  const SizedBox(height: 8),
                ],
              ),
            ),

            // ─── Body ───
            Expanded(
              child: Consumer2<AppointmentProvider, HomeProvider>(
                builder: (context, provider, homeProvider, child) {
                  if (provider.isLoading) {
                    return const Center(child: CircularProgressIndicator(color: AppColors.primary));
                  }

                  final filtered = _filterAppointments(provider.myAppointments);
                  return _buildList(filtered, provider.myAppointments.isNotEmpty, homeProvider);
                },
              ),
            ),
          ],
        ),
    );
  }

  List<AppointmentModel> _filterAppointments(List<AppointmentModel> source) {
    List<AppointmentModel> result;
    if (_selectedStatus != 'ALL') {
      if (_selectedStatus == 'CONFIRMED') {
        result = source.where((a) => a.status == 'CONFIRMED' || a.status == 'SCHEDULED').toList();
      } else {
        result = source.where((a) => a.status == _selectedStatus).toList();
      }
    } else {
      result = List.from(source);
    }

    if (_selectedType != 'ALL') {
      result = result.where((a) => a.appointmentType == _selectedType).toList();
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
      return RefreshIndicator(
        color: AppColors.primary,
        backgroundColor: Colors.white,
        onRefresh: () async {
          await context.read<AppointmentProvider>().fetchMyAppointments(forceRefresh: true);
        },
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.5,
              child: Center(
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
              ),
            ),
          ],
        ),
      );
    }

    appointments.sort((a, b) => b.appointmentDate.compareTo(a.appointmentDate));

    return RefreshIndicator(
      color: AppColors.primary,
      backgroundColor: Colors.white,
      onRefresh: () async {
        await context.read<AppointmentProvider>().fetchMyAppointments(forceRefresh: true);
      },
      child: ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 120),
        itemCount: appointments.length,
        itemBuilder: (context, index) => _buildCard(appointments[index], homeProvider),
      ),
    );
  }

  Widget _buildCard(AppointmentModel apt, HomeProvider homeProvider) {
    final doctor = homeProvider.doctors.where((d) => d.id == apt.mainDoctorId).firstOrNull;
    final avatarUrl = ImageUtils.fixImageUrl(apt.doctorAvatar ?? doctor?.imageUrl);
    final doctorName = apt.doctorName ?? 'Chưa gán bác sĩ';
    final expertise = apt.specialty ?? 'Chuyên khoa';
    final isService = apt.bookingMode == 'SERVICE';

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
      case 'PENDING':
        statusColor = const Color(0xFFF59E0B);
        statusText = 'Chờ xác nhận';
        statusIcon = Icons.help_outline_rounded;
        break;
      case 'CONFIRMED':
      case 'SCHEDULED':
        statusColor = const Color(0xFF10B981);
        statusText = 'Đã xác nhận';
        statusIcon = Icons.event_available_rounded;
        break;
      case 'CHECKED_IN':
        statusColor = const Color(0xFF3B82F6);
        statusText = 'Đã check-in';
        statusIcon = Icons.how_to_reg_rounded;
        break;
      case 'IN_PROGRESS':
        statusColor = const Color(0xFF6366F1);
        statusText = 'Đang khám';
        statusIcon = Icons.health_and_safety_rounded;
        break;
      case 'WAITING_RESULT':
        statusColor = const Color(0xFF8B5CF6);
        statusText = 'Chờ kết quả';
        statusIcon = Icons.science_rounded;
        break;
      case 'SKIPPED':
        statusColor = const Color(0xFFF97316);
        statusText = 'Bị qua lượt';
        statusIcon = Icons.access_time_rounded;
        break;
      case 'COMPLETED':
        statusColor = const Color(0xFF64748B);
        statusText = 'Hoàn thành';
        statusIcon = Icons.check_circle_rounded;
        break;
      case 'CANCELLED':
        statusColor = const Color(0xFFEF4444);
        statusText = 'Đã huỷ';
        statusIcon = Icons.cancel_rounded;
        break;
      case 'NO_SHOW':
        statusColor = const Color(0xFFDC2626);
        statusText = 'Không đến khám';
        statusIcon = Icons.event_busy_rounded;
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
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 16, offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isService)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE5E7EB), width: 1.5),
                ),
                child: const Icon(Icons.medical_services_outlined, color: AppColors.primary, size: 28),
              )
            else
              Container(
                padding: const EdgeInsets.all(2),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE5E7EB), width: 1.5),
                ),
                child: CircleAvatar(
                  radius: 26,
                  backgroundColor: Colors.grey[100],
                  backgroundImage: NetworkImage(avatarUrl),
                ),
              ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isService ? (apt.serviceName ?? 'Dịch vụ') : doctorName, 
                              style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF1F2937)),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(isService ? 'Xét nghiệm / Chụp chiếu' : expertise, style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      // Type Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: isOnline 
                                ? [const Color(0xFF2563EB).withValues(alpha: 0.15), const Color(0xFF2563EB).withValues(alpha: 0.05)]
                                : [const Color(0xFFD97706).withValues(alpha: 0.15), const Color(0xFFD97706).withValues(alpha: 0.05)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          isOnline ? 'Online' : 'Walk-in',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isOnline ? const Color(0xFF2563EB) : const Color(0xFFD97706),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Status Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              statusColor.withValues(alpha: 0.15),
                              statusColor.withValues(alpha: 0.05),
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(statusIcon, color: statusColor, size: 12),
                            const SizedBox(width: 4),
                            Text(statusText, style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      // Date and Time
                      Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.schedule_rounded, size: 14, color: Color(0xFF9CA3AF)),
                              const SizedBox(width: 4),
                              Text(formattedTime, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF374151))),
                              const SizedBox(width: 8),
                              const Icon(Icons.calendar_month_rounded, size: 14, color: Color(0xFF9CA3AF)),
                              const SizedBox(width: 4),
                              Text(formattedDate, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                            ],
                          ),
                        ),
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

  Widget _buildTypeChip(String value, String label, IconData? icon) {
    final isSelected = _selectedType == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedType = value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? AppColors.primary : const Color(0xFFE5E7EB)),
          boxShadow: isSelected ? [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 2))] : null,
        ),
        child: Row(
          children: [
            if (icon != null) ...[
              Icon(icon, size: 14, color: isSelected ? Colors.white : const Color(0xFF6B7280)),
              const SizedBox(width: 6),
            ],
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : const Color(0xFF4B5563),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
