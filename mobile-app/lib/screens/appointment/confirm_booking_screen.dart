import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/utils/image_utils.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/models/doctor_model.dart';
import 'package:clinic_management_system/models/service_model.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';

class ConfirmBookingScreen extends StatefulWidget {
  const ConfirmBookingScreen({super.key});

  @override
  State<ConfirmBookingScreen> createState() => _ConfirmBookingScreenState();
}

class _ConfirmBookingScreenState extends State<ConfirmBookingScreen> {

  void _handleConfirm(AppointmentProvider provider) async {
    if (provider.note.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập Lý do khám')),
      );
      return;
    }
    final success = await provider.confirmBooking();
    
    if (!mounted) return;

    if (success) {
      _showSuccessDialog();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(provider.error ?? 'Booking failed')),
      );
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        backgroundColor: Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 64),
              ),
              const SizedBox(height: 24),
              Text('Booking Successful!', style: AppStyles.heading2.copyWith(color: AppColors.textMainLight)),
              const SizedBox(height: 8),
              Text(
                'Your appointment has been successfully booked. You can check it in the Schedule tab.',
                textAlign: TextAlign.center,
                style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
              ),
              const SizedBox(height: 32),
              CustomButton(
                text: 'Back to Home',
                onPressed: () {
                  // Navigate back to MainScreen and clear all previous routes
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const MainScreen()),
                    (route) => false,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: const GradientAppBar(
        title: 'Xác nhận Đặt lịch',
      ),
      body: Consumer<AppointmentProvider>(
        builder: (context, provider, child) {
          final doctor = provider.selectedDoctor;
          final service = provider.selectedService;
          final specialty = provider.selectedSpecialty;
          
          if (doctor == null && service == null && specialty == null) return const Center(child: Text("Missing Data"));

          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Info Card
                      _buildSectionTitle('Thông tin người khám'),
                      const SizedBox(height: 12),
                      if (doctor != null) _buildDoctorCard(doctor)
                      else if (service != null) _buildServiceCard(service)
                      else if (specialty != null) _buildSpecialtyCard(specialty),
                      const SizedBox(height: 32),

                      // 2. Appointment Schedule Card
                      _buildSectionTitle('Chi tiết lịch hẹn'),
                      const SizedBox(height: 16),
                      _buildScheduleCard(
                        provider.selectedDate ?? '', 
                        provider.selectedTimeSlot?['timeStart'] ?? ''
                      ),
                      const SizedBox(height: 32),
                      
                      // 3. Reason Note
                      _buildSectionTitle('Triệu chứng / Lý do khám'),
                      const SizedBox(height: 12),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.textSubLight.withValues(alpha: 0.1)),
                        ),
                        child: Text(
                          provider.note.isNotEmpty ? provider.note : 'Không có',
                          style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // 4. Payment Summary Card
                      _buildSectionTitle('Thanh toán'),
                      const SizedBox(height: 12),
                      _buildPaymentSummaryCard(doctor, service, specialty),
                    ],
                  ),
                ),
              ),
              
              // 4. Bottom Action Bar
              _buildBottomBar(provider),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: AppStyles.heading3.copyWith(color: AppColors.textMainLight));
  }

  Widget _buildDoctorCard(DoctorModel doctor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Hero(
            tag: 'doctor_img_${doctor.id}',
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                doctor.imageUrl != null ? ImageUtils.fixImageUrl(doctor.imageUrl) : 'https://ui-avatars.com/api/?name=N/A&background=random&format=png',
                height: 70, width: 70, fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200], height: 70, width: 70, child: const Icon(Icons.person, color: Colors.grey)),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('BS. ${doctor.name}', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(doctor.specialty ?? 'Chuyên khoa', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard(ServiceModel service) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Container(
            height: 70, width: 70,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(Icons.medical_services_outlined, color: AppColors.primary, size: 36),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(service.serviceName, style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(service.serviceType, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecialtyCard(Map<String, dynamic> specialty) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Container(
            height: 70, width: 70,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.textSubLight.withValues(alpha: 0.1)),
            ),
            child: Image.network(
              ImageUtils.fixImageUrl(specialty['iconUrl'] ?? specialty['imageUrl']),
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => const Icon(Icons.medical_services, color: AppColors.primary, size: 36),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Khám chuyên khoa', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                const SizedBox(height: 4),
                Text(specialty['expertiseName'] ?? '', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleCard(String date, String time) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          _buildInfoRow(Icons.calendar_month_rounded, 'Ngày', date),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(color: Color(0xFFF1F1F1), thickness: 1),
          ),
          _buildInfoRow(Icons.access_time_rounded, 'Giờ', time),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(width: 12),
        Text(label, style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
        const Spacer(),
        Text(value, style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildPaymentSummaryCard(DoctorModel? doctor, ServiceModel? service, Map<String, dynamic>? specialty) {
    double fee = 0;
    if (doctor != null) fee = doctor.consultationFee;
    else if (service != null) fee = service.discountPrice ?? service.originalPrice;
    else if (specialty != null) fee = 150000; // Default consultation fee if no doctor selected

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withValues(alpha: 0.1)),
      ),
      child: Column(
        children: [
          _buildPriceRow('Phí dịch vụ/khám', CurrencyFormatter.formatVND(fee)),
          const SizedBox(height: 12),
          _buildPriceRow('Phí nền tảng', 'Miễn phí'),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Divider(color: Color(0xFFF1F1F1), thickness: 1),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Tổng cộng', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
              Text(CurrencyFormatter.formatVND(fee), style: AppStyles.heading2.copyWith(color: AppColors.primary)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, String price) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
        Text(price, style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.w600)),
      ],
    );
  }

  Widget _buildBottomBar(AppointmentProvider provider) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, -5)),
        ],
      ),
      child: CustomButton(
        text: 'Xác nhận đặt lịch',
        isLoading: provider.isLoading,
        onPressed: () => _handleConfirm(provider),
      ),
    );
  }
}
