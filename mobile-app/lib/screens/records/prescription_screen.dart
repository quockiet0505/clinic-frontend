import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/models/prescription_model.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class PrescriptionScreen extends StatelessWidget {
  final List<PrescriptionItemModel> medicines;

  const PrescriptionScreen({super.key, required this.medicines});

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: const GradientAppBar(title: 'Đơn thuốc'),
      body: medicines.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.medication_outlined, size: 64, color: AppColors.textSubLight.withValues(alpha: 0.5)),
                  const SizedBox(height: 16),
                  Text('Không có đơn thuốc nào', style: AppStyles.bodyLarge.copyWith(color: AppColors.textSubLight)),
                ],
              ),
            )
          : ListView.builder(
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
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 15, offset: const Offset(0, 5))],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  const Color(0xFF0F766E).withValues(alpha: 0.25),
                                  const Color(0xFF0F766E).withValues(alpha: 0.05),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.medication_liquid_rounded, color: Color(0xFF0F766E), size: 24),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(med.medicineName ?? 'Thuốc', style: AppStyles.heading3.copyWith(fontSize: 16, height: 1.3)),
                                const SizedBox(height: 6),
                                if (med.price != null && med.price! > 0)
                                  Text(
                                    CurrencyFormatter.formatVND(med.price!),
                                    style: AppStyles.bodyMedium.copyWith(color: Colors.orange, fontWeight: FontWeight.bold),
                                  ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Text(
                              '${med.quantity} ${med.unit}',
                              style: AppStyles.caption.copyWith(color: const Color(0xFF475569), fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ),
                        ],
                      ),
                      
                      if (med.dosage != null && med.dosage!.isNotEmpty) ...[
                        const SizedBox(height: 20),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF), // Blue-50
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.integration_instructions_rounded, color: Color(0xFF3B82F6), size: 18), // Blue-500
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  med.dosage!, 
                                  style: AppStyles.bodyMedium.copyWith(color: const Color(0xFF1E3A8A), height: 1.4) // Blue-900
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                );
              },
            ),
    );
  }
}
