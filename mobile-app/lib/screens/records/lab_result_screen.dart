import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/models/lab_result_model.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';
import 'package:clinic_management_system/utils/date_formatter.dart';
import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class LabResultScreen extends StatelessWidget {
  final List<LabResultModel> results;

  const LabResultScreen({super.key, required this.results});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: const GradientAppBar(title: 'Kết quả cận lâm sàng'),
      body: results.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.science_outlined, size: 64, color: AppColors.textSubLight.withValues(alpha: 0.5)),
                  const SizedBox(height: 16),
                  Text('Không có kết quả nào', style: AppStyles.bodyLarge.copyWith(color: AppColors.textSubLight)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(24),
              itemCount: results.length,
              itemBuilder: (context, index) {
                final result = results[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 15, offset: const Offset(0, 5))],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header of card
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.blue.withValues(alpha: 0.25),
                                  Colors.blue.withValues(alpha: 0.05),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.science_rounded, color: Colors.blue, size: 24),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(result.serviceName ?? 'Xét nghiệm', style: AppStyles.heading3.copyWith(fontSize: 16, height: 1.3)),
                                const SizedBox(height: 4),
                                Text(DateFormatter.formatDateTime(result.date), style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontSize: 13)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: result.status == 'Bình thường' 
                                    ? [Colors.green.withValues(alpha: 0.15), Colors.green.withValues(alpha: 0.05)]
                                    : [AppColors.warning.withValues(alpha: 0.15), AppColors.warning.withValues(alpha: 0.05)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              result.status ?? 'Chờ KQ',
                              style: AppStyles.caption.copyWith(
                                color: result.status == 'Bình thường' ? Colors.green : AppColors.warning,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      
                      // Result block
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Column(
                          children: [
                            if (result.price != null && result.price! > 0) ...[
                              _buildResultRow('Giá dịch vụ', CurrencyFormatter.formatVND(result.price!), valueColor: Colors.orange),
                              const SizedBox(height: 12),
                              const Divider(color: Color(0xFFE2E8F0), height: 1),
                              const SizedBox(height: 12),
                            ],
                            _buildResultRow('Kết quả', result.resultData ?? 'Đang cập nhật', 
                              isBold: true, 
                              valueColor: result.status == 'Bình thường' ? AppColors.textMainLight : AppColors.warning),
                            if (result.normalRange != null && result.normalRange!.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              _buildResultRow('CSBT', result.normalRange!),
                            ],
                            if (result.unit != null && result.unit!.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              _buildResultRow('Đơn vị', result.unit!),
                            ],
                          ],
                        ),
                      ),
                      
                      if (result.conclusion != null && result.conclusion!.isNotEmpty) ...[
                        const SizedBox(height: 16),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: result.status == 'Bình thường' ? Colors.green.withValues(alpha: 0.05) : AppColors.warning.withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: result.status == 'Bình thường' ? Colors.green.withValues(alpha: 0.2) : AppColors.warning.withValues(alpha: 0.2)),
                          ),
                          child: RichText(
                            text: TextSpan(
                              children: [
                                TextSpan(text: 'Kết luận: ', style: AppStyles.caption.copyWith(color: result.status == 'Bình thường' ? Colors.green : AppColors.warning, fontWeight: FontWeight.bold)),
                                TextSpan(text: result.conclusion!, style: AppStyles.bodyMedium.copyWith(fontSize: 14, color: AppColors.textMainLight)),
                              ]
                            ),
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

  Widget _buildResultRow(String label, String value, {bool isBold = false, Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight, fontSize: 14)),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: AppStyles.bodyMedium.copyWith(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: valueColor ?? AppColors.textMainLight,
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }
}
