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
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                            child: const Icon(Icons.medication, color: AppColors.primary, size: 24),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(med.medicineName ?? 'Thuốc', style: AppStyles.heading3.copyWith(fontSize: 16)),
                                if (med.price != null && med.price! > 0)
                                  Text(
                                    CurrencyFormatter.formatVND(med.price!),
                                    style: AppStyles.bodyMedium.copyWith(color: Colors.orange, fontWeight: FontWeight.bold),
                                  ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.green.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              '${med.quantity} ${med.unit}',
                              style: AppStyles.caption.copyWith(color: Colors.green, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (med.dosage != null && med.dosage!.isNotEmpty)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: AppColors.warning.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                          child: Row(
                            children: [
                              const Icon(Icons.info_outline_rounded, color: AppColors.warning, size: 16),
                              const SizedBox(width: 8),
                              Expanded(child: Text(med.dosage!, style: AppStyles.caption.copyWith(color: AppColors.warning, fontWeight: FontWeight.bold))),
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
}
