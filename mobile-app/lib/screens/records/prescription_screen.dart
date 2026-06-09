import 'package:clinic_management_system/app_exports.dart';

class PrescriptionScreen extends StatelessWidget {
  const PrescriptionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> medicines = [
      {
        'name': 'Amoxicillin 500mg',
        'dosage': '1 viên/lần',
        'frequency': '2 lần/ngày (Sáng, Tối)',
        'duration': '5 ngày',
        'instruction': 'Uống sau khi ăn no'
      },
      {
        'name': 'Paracetamol 500mg',
        'dosage': '1 viên/lần',
        'frequency': 'Khi sốt > 38.5 độ',
        'duration': 'Tùy triệu chứng',
        'instruction': 'Cách nhau tối thiểu 4-6 tiếng'
      }
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Đơn thuốc', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(24),
        itemCount: medicines.length,
        itemBuilder: (context, index) {
          final med = medicines[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                      child: const Icon(Icons.medication, color: AppColors.primary, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(med['name'], style: AppStyles.heading3.copyWith(fontSize: 16)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildInfoRow('Liều lượng:', med['dosage']),
                const SizedBox(height: 8),
                _buildInfoRow('Tần suất:', med['frequency']),
                const SizedBox(height: 8),
                _buildInfoRow('Thời gian:', med['duration']),
                const SizedBox(height: 12),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: AppColors.warning.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, color: AppColors.warning, size: 16),
                      const SizedBox(width: 8),
                      Expanded(child: Text(med['instruction'], style: AppStyles.caption.copyWith(color: AppColors.warning, fontWeight: FontWeight.bold))),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(label, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
        ),
        Expanded(
          child: Text(value, style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600)),
        ),
      ],
    );
  }
}
