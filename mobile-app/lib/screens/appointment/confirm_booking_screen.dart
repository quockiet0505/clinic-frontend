import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';

class ConfirmBookingScreen extends StatefulWidget {
  const ConfirmBookingScreen({super.key});

  @override
  State<ConfirmBookingScreen> createState() => _ConfirmBookingScreenState();
}

class _ConfirmBookingScreenState extends State<ConfirmBookingScreen> {

  void _handleConfirm(AppointmentProvider provider) async {
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
          if (doctor == null) return const Center(child: Text("Missing Data"));

          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Doctor Information Card
                      _buildSectionTitle('Doctor Info'),
                      const SizedBox(height: 12),
                      _buildDoctorCard(doctor),
                      const SizedBox(height: 32),

                      // 2. Appointment Schedule Card
                      _buildSectionTitle('Schedule Details'),
                      const SizedBox(height: 12),
                      _buildScheduleCard(provider.selectedDate ?? '', provider.selectedTime ?? ''),
                      const SizedBox(height: 32),

                      // 3. Payment Summary Card
                      _buildSectionTitle('Payment Summary'),
                      const SizedBox(height: 12),
                      _buildPaymentSummaryCard(),
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

  Widget _buildDoctorCard(Map<String, dynamic> doctor) {
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
            tag: 'doctor_img_${doctor['staffId']}',
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                doctor['imageUrl'] ?? 'https://via.placeholder.com/150',
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
                Text('Dr. ${doctor['fullName']}', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(doctor['expertiseName'] ?? 'Specialist', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
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
          _buildInfoRow(Icons.calendar_month_rounded, 'Date', date),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(color: Color(0xFFF1F1F1), thickness: 1),
          ),
          _buildInfoRow(Icons.access_time_rounded, 'Time', time),
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

  Widget _buildPaymentSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          _buildPriceRow('Consultation Fee', '\$50.00'),
          const SizedBox(height: 12),
          _buildPriceRow('Admin Fee', '\$2.00'),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Divider(color: Color(0xFFF1F1F1), thickness: 1),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
              Text('\$52.00', style: AppStyles.heading2.copyWith(color: AppColors.primary)),
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
        text: 'Confirm & Book',
        isLoading: provider.isLoading,
        onPressed: () => _handleConfirm(provider),
      ),
    );
  }
}