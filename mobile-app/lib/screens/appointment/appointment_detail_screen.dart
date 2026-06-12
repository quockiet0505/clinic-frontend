import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/utils/image_utils.dart';
import 'package:clinic_management_system/models/appointment_model.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

class AppointmentDetailScreen extends StatelessWidget {
  final AppointmentModel appointment;

  const AppointmentDetailScreen({super.key, required this.appointment});

  @override
  Widget build(BuildContext context) {
    final homeProvider = context.read<HomeProvider>();
    final doctor = homeProvider.doctors.where((doc) => doc.id == appointment.mainDoctorId).firstOrNull;
    final doctorName = appointment.doctorName ?? 'Bác sĩ';
    final expertise = appointment.specialty ?? 'Chuyên khoa';
    final String avatarUrl = ImageUtils.fixImageUrl(appointment.doctorAvatar ?? doctor?.imageUrl);

    String formattedDate = appointment.appointmentDate;
    if (formattedDate.isNotEmpty) {
      try {
        final d = DateTime.parse(formattedDate);
        formattedDate = DateFormat('EEEE, dd/MM/yyyy', 'vi_VN').format(d);
      } catch (_) {}
    }

    String formattedTime = appointment.timeStart ?? '';
    if (formattedTime.length >= 5) {
      formattedTime = formattedTime.substring(0, 5);
    }

    Color statusColor = Colors.green;
    String statusText = appointment.status;
    bool canEditOrCancel = false;

    if (appointment.status == 'SCHEDULED' || appointment.status == 'CONFIRMED' || appointment.status == 'PENDING') {
      statusColor = const Color(0xFF10B981); // Emerald
      statusText = 'Đã xác nhận / Sắp tới';
      canEditOrCancel = true;
    } else if (appointment.status == 'CANCELLED') {
      statusColor = const Color(0xFFEF4444); // Red
      statusText = 'Đã hủy';
    } else if (appointment.status == 'COMPLETED') {
      statusColor = const Color(0xFF6366F1); // Indigo
      statusText = 'Đã hoàn thành';
    }

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: const GradientAppBar(
        title: 'Chi tiết Lịch khám',
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: statusColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: statusColor.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Icon(
                    appointment.status == 'CANCELLED' ? Icons.cancel_rounded : (appointment.status == 'COMPLETED' ? Icons.check_circle_rounded : Icons.info_rounded),
                    color: statusColor,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Trạng thái: $statusText',
                      style: AppStyles.bodyLarge.copyWith(color: statusColor, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Doctor / Service Info
            Text('Thông tin bác sĩ', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.network(
                      avatarUrl,
                      height: 70, width: 70, fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200], height: 70, width: 70, child: const Icon(Icons.person, color: Colors.grey)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(doctorName, style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(expertise, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Time & Note Info
            Text('Thông tin lịch hẹn', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  _buildInfoRow(Icons.calendar_month_rounded, 'Ngày khám', formattedDate),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(height: 1)),
                  _buildInfoRow(Icons.access_time_rounded, 'Thời gian', formattedTime.isEmpty ? 'Chưa xác định' : formattedTime),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(height: 1)),
                  _buildInfoRow(
                    appointment.appointmentType == 'ONLINE' ? Icons.smartphone_rounded : Icons.directions_walk_rounded,
                    'Hình thức',
                    appointment.appointmentType == 'ONLINE'
                        ? 'Đặt lịch online → Khám trực tiếp'
                        : 'Walk-in (Khám không đặt trước)',
                  ),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(height: 1)),
                  _buildInfoRow(Icons.medical_information_rounded, 'Mã lịch hẹn', '#APT-${appointment.appointmentId}'),
                  if (doctor != null) ...[
                    const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(height: 1)),
                    _buildInfoRow(Icons.payments_rounded, 'Phí khám', CurrencyFormatter.formatVND(doctor.consultationFee), isHighlight: true),
                  ],
                  if (appointment.note != null && appointment.note!.isNotEmpty) ...[
                    const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(height: 1)),
                    _buildInfoRow(Icons.edit_note_rounded, 'Triệu chứng', appointment.note!),
                  ],
                  if (appointment.cancelReason != null && appointment.cancelReason!.isNotEmpty) ...[
                    const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(height: 1)),
                    _buildInfoRow(Icons.warning_rounded, 'Lý do hủy', appointment.cancelReason!, isError: true),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: canEditOrCancel ? Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () {
                  // TODO: Cancel Appointment
                },
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  side: BorderSide(color: const Color(0xFFEF4444).withValues(alpha: 0.5)),
                ),
                child: const Text('Hủy lịch', style: TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: ElevatedButton(
                  onPressed: () {
                    // TODO: Reschedule Appointment
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text('Đổi giờ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ),
          ],
        ),
      ) : null,
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value, {bool isError = false, bool isHighlight = false}) {
    final Color iconColor = isError ? Colors.red : (isHighlight ? const Color(0xFF10B981) : AppColors.primary);
    final Color textColor = isError ? Colors.red : (isHighlight ? const Color(0xFF10B981) : AppColors.textMainLight);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: iconColor, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
              const SizedBox(height: 2),
              Text(
                value, 
                style: AppStyles.bodyMedium.copyWith(
                  color: textColor,
                  fontWeight: isHighlight ? FontWeight.w700 : FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
