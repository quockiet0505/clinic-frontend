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
      final reviews = await feedbackService.getMyDoctorFeedbacks();
      final hasReviewed = reviews.any((r) => r['appointmentId'] == widget.appointment.appointmentId);
      if (mounted) {
        setState(() {
          _hasReviewed = hasReviewed;
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
    final doctorName = appointment.doctorName ?? 'Bác sĩ';
    final expertise = appointment.specialty ?? 'Chuyên khoa';

    String formattedDate = '';
    try {
      final d = DateTime.parse(appointment.appointmentDate);
      formattedDate = DateFormat('EEEE, dd/MM/yyyy', 'vi_VN').format(d);
    } catch (_) {
      formattedDate = appointment.appointmentDate;
    }
    final formattedTime = (appointment.timeStart?.length ?? 0) >= 5 ? appointment.timeStart!.substring(0, 5) : (appointment.timeStart ?? '--:--');

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      appBar: const GradientAppBar(title: 'Chi tiết lịch hẹn'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Banner
            _buildStatusBanner(),
            const SizedBox(height: 20),

            // Doctor Info Card
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
                    children: [
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
                        ),
                        child: CircleAvatar(
                          radius: 32,
                          backgroundColor: Colors.grey[200],
                          backgroundImage: NetworkImage(avatarUrl),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1F2937))),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3F4F6),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(expertise, style: const TextStyle(fontSize: 13, color: Color(0xFF4B5563), fontWeight: FontWeight.w600)),
                            ),
                          ],
                        ),
                      ),
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
                    appointment.appointmentType == 'ONLINE' ? Icons.videocam_rounded : Icons.location_on_rounded, 
                    'Hình thức', 
                    appointment.appointmentType == 'ONLINE' ? 'Khám trực tuyến (Video call)' : 'Khám trực tiếp tại phòng khám', 
                    const Color(0xFF10B981)
                  ),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 16), child: Divider(height: 1, color: Color(0xFFF3F4F6))),
                  _buildDetailRow(Icons.edit_note_rounded, 'Ghi chú triệu chứng', appointment.note?.isNotEmpty == true ? appointment.note! : 'Không có ghi chú', const Color(0xFFF59E0B)),
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
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ReviewHistoryScreen(),
                          ),
                        );
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
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBanner() {
    Color statusColor;
    String statusText;
    IconData statusIcon;
    switch (widget.appointment.status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
      case 'PENDING':
        statusColor = const Color(0xFF10B981);
        statusText = 'Lịch hẹn sắp tới';
        statusIcon = Icons.event_available_rounded;
        break;
      case 'CANCELLED':
        statusColor = const Color(0xFFEF4444);
        statusText = 'Lịch hẹn đã hủy';
        statusIcon = Icons.cancel_rounded;
        break;
      case 'COMPLETED':
        statusColor = const Color(0xFF6366F1);
        statusText = 'Đã hoàn thành';
        statusIcon = Icons.check_circle_rounded;
        break;
      default:
        statusColor = const Color(0xFF9CA3AF);
        statusText = widget.appointment.status;
        statusIcon = Icons.info_rounded;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: statusColor.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Icon(statusIcon, color: statusColor, size: 24),
          const SizedBox(width: 12),
          Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 15)),
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
