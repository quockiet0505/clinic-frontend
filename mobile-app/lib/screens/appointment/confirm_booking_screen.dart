// --- lib/screens/appointment/confirm_booking_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class ConfirmBookingScreen extends StatefulWidget {
  const ConfirmBookingScreen({super.key});

  @override
  State<ConfirmBookingScreen> createState() => _ConfirmBookingScreenState();
}

class _ConfirmBookingScreenState extends State<ConfirmBookingScreen> {
  bool _isLoading = false;

  void _handleConfirm() async {
    setState(() => _isLoading = true);
    
    // Simulate API call to save appointment
    await Future.delayed(const Duration(seconds: 2));
    
    if (!mounted) return;
    setState(() => _isLoading = false);

    // Show Success Dialog
    _showSuccessDialog();
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
                  color: AppColors.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 64),
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
      appBar: AppBar(
        backgroundColor: AppColors.bgLight,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('Confirm Booking', style: AppStyles.heading2.copyWith(color: AppColors.textMainLight)),
        centerTitle: true,
      ),
      body: Column(
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
                  _buildDoctorCard(),
                  const SizedBox(height: 32),

                  // 2. Appointment Schedule Card
                  _buildSectionTitle('Schedule Details'),
                  const SizedBox(height: 12),
                  _buildScheduleCard(),
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
          _buildBottomBar(),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: AppStyles.heading3.copyWith(color: AppColors.textMainLight));
  }

  Widget _buildDoctorCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.network('https://i.pravatar.cc/150?img=5', height: 70, width: 70, fit: BoxFit.cover),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Dr. Alexa Johnson', style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text('Neurology', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          _buildInfoRow(Icons.calendar_month_rounded, 'Date', 'Thu, Oct 27, 2026'),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(color: Color(0xFFF1F1F1), thickness: 1),
          ),
          _buildInfoRow(Icons.access_time_rounded, 'Time', '10:00 AM - 10:30 AM'),
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
          _buildPriceRow('Consultation Fee', '\$60.00'),
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
              Text('\$62.00', style: AppStyles.heading2.copyWith(color: AppColors.primary)),
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

  Widget _buildBottomBar() {
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
        isLoading: _isLoading,
        onPressed: _handleConfirm,
      ),
    );
  }
}