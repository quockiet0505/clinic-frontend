import 'package:flutter/material.dart';
import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/models/appointment_model.dart';
import 'package:clinic_management_system/utils/image_utils.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:intl/intl.dart';
import 'package:clinic_management_system/screens/appointment/review_screen.dart';
import 'package:clinic_management_system/screens/profile/review_history_screen.dart';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';
import 'package:clinic_management_system/screens/appointment/reschedule_dialog.dart';

import 'package:clinic_management_system/services/feedback_service.dart';

class AppointmentDetailScreen extends StatefulWidget {
  final AppointmentModel appointment;

  const AppointmentDetailScreen({Key? key, required this.appointment}) : super(key: key);

  @override
  State<AppointmentDetailScreen> createState() => _AppointmentDetailScreenState();
}

class _AppointmentDetailScreenState extends State<AppointmentDetailScreen> {
  bool _hasReviewed = false;
  bool _isLoadingReviewStatus = true;

  @override
  void initState() {
    super.initState();
    _checkReviewStatus();
  }

  Future<void> _checkReviewStatus() async {
    if (widget.appointment.status != 'COMPLETED') {
      setState(() => _isLoadingReviewStatus = false);
      return;
    }
    
    try {
      final feedbackService = FeedbackService();
      final doctorReviews = await feedbackService.getMyDoctorFeedbacks();
      final clinicReviews = await feedbackService.getMyClinicFeedbacks();
      
      final hasReviewedDoctor = doctorReviews.any((r) => r['appointmentId'] == widget.appointment.appointmentId);
      final hasReviewedClinic = clinicReviews.any((r) => r['appointmentId'] == widget.appointment.appointmentId);
      
      if (mounted) {
        setState(() {
          _hasReviewed = hasReviewedDoctor || hasReviewedClinic;
          _isLoadingReviewStatus = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingReviewStatus = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final appointment = widget.appointment;
    final homeProvider = context.watch<HomeProvider>();
    final doctor = homeProvider.doctors.where((d) => d.id == appointment.mainDoctorId).firstOrNull;
    final avatarUrl = ImageUtils.fixImageUrl(appointment.doctorAvatar ?? doctor?.imageUrl);
    final doctorName = appointment.doctorName ?? 'Chưa gán bác sĩ';
    final expertise = appointment.specialty ?? 'Chuyên khoa';

    String formattedDate = '';
    try {
      final d = DateTime.parse(appointment.appointmentDate);
      formattedDate = DateFormat('EEEE, dd/MM/yyyy', 'vi_VN').format(d);
    } catch (_) {
      formattedDate = appointment.appointmentDate;
    }
    final formattedTime = (appointment.timeStart?.length ?? 0) >= 5 ? appointment.timeStart!.substring(0, 5) : (appointment.timeStart ?? '--:--');

    bool blockedByTime = false;
    try {
      final aptDateTimeStr = '${appointment.appointmentDate} ${appointment.timeStart}';
      final aptDateTime = DateFormat('yyyy-MM-dd HH:mm:ss').parse(aptDateTimeStr);
      final now = DateTime.now();
      final diff = aptDateTime.difference(now).inHours;
      if (diff < 3 && diff > -24) {
        blockedByTime = true;
      }
    } catch (_) {}

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      appBar: const GradientAppBar(title: 'Chi tiết lịch hẹn'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status banner removed
            if (appointment.status == 'NO_SHOW')
              Container(
                margin: const EdgeInsets.only(top: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  border: Border.all(color: const Color(0xFFFEE2E2)),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(top: 2),
                      child: Icon(Icons.error_outline_rounded, color: Color(0xFFEF4444), size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Cảnh báo: Bạn đã vắng mặt. Nếu không đến khám quá 3 lần, tài khoản của bạn sẽ bị khoá tự động.',
                        style: TextStyle(fontSize: 13, color: Color(0xFFB91C1C), fontWeight: FontWeight.bold, height: 1.5),
                      ),
                    ),
                  ],
                ),
              ),
            if (blockedByTime && (appointment.status == 'PENDING' || appointment.status == 'CONFIRMED'))
              Container(
                margin: const EdgeInsets.only(top: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  border: Border.all(color: const Color(0xFFFEE2E2)),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(top: 2),
                      child: Icon(Icons.access_time_filled_rounded, color: Color(0xFFEF4444), size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Đã quá hạn dời/huỷ lịch (chỉ cho phép trước giờ khám 3 tiếng). Vui lòng liên hệ quầy lễ tân nếu cần hỗ trợ.',
                        style: TextStyle(fontSize: 13, color: Color(0xFFB91C1C), fontWeight: FontWeight.bold, height: 1.5),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 20),

            // Doctor/Service Info Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 20, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (widget.appointment.bookingMode == 'SERVICE')
                        Container(
                          height: 60, width: 60,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
                          ),
                          child: const Icon(Icons.medical_services_outlined, color: AppColors.primary, size: 28),
                        )
                      else
                        Container(
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
                          ),
                          child: CircleAvatar(
                            radius: 28,
                            backgroundColor: Colors.grey[200],
                            backgroundImage: NetworkImage(avatarUrl),
                          ),
                        ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.appointment.bookingMode == 'SERVICE' ? (widget.appointment.serviceName ?? 'Dịch vụ') : doctorName, 
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1F2937))
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3F4F6),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                widget.appointment.bookingMode == 'SERVICE' ? 'Xét nghiệm / Chụp chiếu' : expertise, 
                                style: const TextStyle(fontSize: 13, color: Color(0xFF4B5563), fontWeight: FontWeight.w600)
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      _buildStatusBadge(),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: Divider(height: 1, color: Color(0xFFF3F4F6)),
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: _buildInfoItem(Icons.calendar_month_rounded, 'Ngày hẹn', formattedDate),
                      ),
                      Container(width: 1, height: 40, color: const Color(0xFFF3F4F6)),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 20),
                          child: _buildInfoItem(Icons.schedule_rounded, 'Thời gian', formattedTime),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Details Section
            const Text('Thông tin chi tiết', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937))),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 20, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  _buildDetailRow(Icons.medical_services_rounded, 'Dịch vụ', appointment.serviceName ?? 'Khám chuyên khoa', const Color(0xFF3B82F6)),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 16), child: Divider(height: 1, color: Color(0xFFF3F4F6))),
                  _buildDetailRow(
                    appointment.appointmentType == 'ONLINE' ? Icons.smartphone_rounded : Icons.directions_walk_rounded, 
                    'Hình thức tạo lịch', 
                    appointment.appointmentType == 'ONLINE' ? 'Đặt lịch qua ứng dụng' : 'Tạo trực tiếp tại quầy', 
                    const Color(0xFF10B981)
                  ),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 16), child: Divider(height: 1, color: Color(0xFFF3F4F6))),
                  _buildDetailRow(Icons.edit_note_rounded, 'Ghi chú triệu chứng', appointment.note?.isNotEmpty == true ? appointment.note! : 'Không có ghi chú', const Color(0xFFF59E0B)),
                  if ((appointment.rescheduleCount ?? 0) > 0) ...[
                    const Padding(padding: EdgeInsets.symmetric(vertical: 16), child: Divider(height: 1, color: Color(0xFFF3F4F6))),
                    _buildDetailRow(Icons.edit_calendar_rounded, 'Đã dời lịch (${appointment.rescheduleCount} lần)', appointment.rescheduleReason ?? 'Không rõ lý do', Colors.amber),
                  ],
                ],
              ),
            ),
            
              if (appointment.status == 'COMPLETED') ...[
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoadingReviewStatus ? null : () async {
                      if (_hasReviewed) {
                        final result = await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ReviewScreen(appointment: appointment),
                          ),
                        );
                        if (result == true && mounted) {
                          _checkReviewStatus();
                        }
                      } else {
                        final result = await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ReviewScreen(appointment: appointment),
                          ),
                        );
                        if (result == true && mounted) {
                          setState(() => _hasReviewed = true);
                        }
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _hasReviewed ? Colors.white : const Color(0xFF0EA5E9),
                      foregroundColor: _hasReviewed ? const Color(0xFF0EA5E9) : Colors.white,
                      side: _hasReviewed ? const BorderSide(color: Color(0xFF0EA5E9), width: 1.5) : null,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                    ),
                    child: _isLoadingReviewStatus 
                      ? const SizedBox(
                          height: 24, 
                          width: 24, 
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                        )
                      : Text(
                          _hasReviewed ? 'Xem đánh giá' : 'Đánh giá Dịch vụ', 
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                  ),
                ),
              ],
              
              if (appointment.status == 'PENDING' || appointment.status == 'CONFIRMED') ...[
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: blockedByTime ? null : () async {
                      final result = await showDialog(
                        context: context,
                        builder: (context) => RescheduleDialog(appointment: appointment),
                      );
                      if (result == true) {
                        Navigator.pop(context, true); // Pop out to refresh list
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: blockedByTime ? Colors.grey[200] : Colors.amber[50],
                      foregroundColor: blockedByTime ? Colors.grey[500] : Colors.amber[600],
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                      side: BorderSide(color: blockedByTime ? Colors.grey[300]! : Colors.amber[200]!),
                    ),
                    child: const Text('Dời lịch hẹn', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge() {
    Color statusColor;
    String statusText;
    IconData statusIcon;
    switch (widget.appointment.status) {
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
        statusText = widget.appointment.status;
        statusIcon = Icons.info_rounded;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            statusColor.withOpacity(0.15),
            statusColor.withOpacity(0.05),
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
          Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildInfoItem(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: const Color(0xFF9CA3AF), size: 18),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
              const SizedBox(height: 2),
              Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1F2937))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value, Color iconColor) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: iconColor, size: 18),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
              const SizedBox(height: 4),
              Text(
                value, 
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF1F2937), height: 1.4),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
