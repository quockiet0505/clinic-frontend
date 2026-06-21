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
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: result.status == 'Bình thường' ? Colors.green.withValues(alpha: 0.1) : AppColors.warning.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(8),
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
                              Text(DateFormatter.formatDateTime(result.date), style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontSize: 13)),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(color: Colors.blue.withValues(alpha: 0.1), shape: BoxShape.circle),
                                child: const Icon(Icons.science, color: Colors.blue, size: 24),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Text(result.serviceName ?? 'Xét nghiệm', style: AppStyles.heading3.copyWith(fontSize: 16)),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      
                      if (result.price != null && result.price! > 0) ...[
                        _buildResultRow('Giá dịch vụ', CurrencyFormatter.formatVND(result.price!), valueColor: Colors.orange),
                        const SizedBox(height: 12),
                        const Divider(color: Color(0xFFF1F5F9)),
                        const SizedBox(height: 12),
                      ],

                      _buildResultRow('Kết quả', result.resultData ?? 'Đang cập nhật', isBold: true),
                      if (result.normalRange != null && result.normalRange!.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        _buildResultRow('CSBT', result.normalRange!),
                      ],
                      if (result.unit != null && result.unit!.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        _buildResultRow('Đơn vị', result.unit!),
                      ],
                      if (result.conclusion != null && result.conclusion!.isNotEmpty) ...[
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Kết luận:', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text(result.conclusion!, style: AppStyles.bodyMedium.copyWith(fontSize: 14)),
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
