import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/screens/records/prescription_screen.dart';
import 'package:clinic_management_system/screens/records/lab_result_screen.dart';
import 'package:clinic_management_system/models/record_model.dart';
import 'package:clinic_management_system/models/prescription_model.dart';
import 'package:clinic_management_system/models/lab_result_model.dart';
import 'package:clinic_management_system/providers/record_provider.dart';
import 'package:clinic_management_system/utils/date_formatter.dart';
import 'package:provider/provider.dart';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class RecordDetailScreen extends StatefulWidget {
  final RecordModel record;

  const RecordDetailScreen({super.key, required this.record});

  @override
  State<RecordDetailScreen> createState() => _RecordDetailScreenState();
}

class _RecordDetailScreenState extends State<RecordDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RecordProvider>().fetchRecordDetail(widget.record.recordId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: const GradientAppBar(title: 'Chi tiết bệnh án'),
      body: Consumer<RecordProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final detail = provider.recordDetails[widget.record.recordId];
          final prescriptionData = detail?['prescription']?['items'] as List<dynamic>? ?? [];
          final servicesData = detail?['serviceOrders'] as List<dynamic>? ?? [];

          final List<PrescriptionItemModel> medicines = prescriptionData
              .map((e) => PrescriptionItemModel.fromJson(e))
              .toList();

          final List<LabResultModel> labResults = servicesData
              .map((e) {
                return LabResultModel(
                  resultId: e['result']?['resultId'] ?? 0,
                  orderId: e['orderId'] ?? 0,
                  resultData: e['result']?['resultData'],
                  conclusion: e['result']?['conclusion'],
                  attachmentUrl: e['result']?['attachmentUrl'],
                  serviceName: e['serviceName'],
                  date: e['result']?['enteredAt']?.toString() ?? e['createdAt']?.toString(),
                  status: e['result']?['conclusion']?.toString().toLowerCase().contains('bình thường') == true 
                          ? 'Bình thường' 
                          : (e['result']?['conclusion'] != null ? 'Bất thường' : 'Chờ KQ'),
                  price: (e['price'] as num?)?.toDouble(),
                );
              })
              .toList();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                // Overview Card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 15, offset: const Offset(0, 5))],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Mã BA: ${widget.record.recordId}', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold, fontSize: 13)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: Colors.green.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                            child: Text(widget.record.status, style: AppStyles.caption.copyWith(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 13)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(widget.record.diagnosis ?? 'Chưa có chuẩn đoán', style: AppStyles.heading2.copyWith(fontSize: 18)),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          const Icon(Icons.person_outline, size: 16, color: AppColors.primary),
                          const SizedBox(width: 8),
                          Text('Bác sĩ điều trị: ${widget.record.doctorName ?? 'Chưa rõ'}', style: AppStyles.bodyMedium.copyWith(fontSize: 14)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.primary),
                          const SizedBox(width: 8),
                          Text('Ngày khám: ${DateFormatter.formatDateTime(widget.record.createdAt)}', style: AppStyles.bodyMedium.copyWith(fontSize: 14)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Links to other details
                Row(
                  children: [
                    Expanded(
                      child: _buildActionCard(
                        context, 
                        'Đơn thuốc', 
                        Icons.medication_outlined, 
                        Colors.orange, 
                        () => Navigator.push(context, MaterialPageRoute(builder: (_) => PrescriptionScreen(medicines: medicines)))
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildActionCard(
                        context, 
                        'Kết quả CLS', 
                        Icons.science_outlined, 
                        Colors.blue, 
                        () => Navigator.push(context, MaterialPageRoute(builder: (_) => LabResultScreen(results: labResults)))
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Vitals
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 15, offset: const Offset(0, 5))],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Sinh hiệu', style: AppStyles.heading3),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildVitalItem('Huyết áp', '120/80', 'mmHg'),
                          _buildVitalItem('Nhịp tim', '75', 'lần/p'),
                          _buildVitalItem('Nhiệt độ', '37', '°C'),
                        ],
                      ),
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

  Widget _buildActionCard(BuildContext context, String title, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 12),
            Text(title, style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildVitalItem(String title, String value, String unit) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(title, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
        const SizedBox(height: 4),
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(value, style: AppStyles.heading3.copyWith(color: AppColors.primary)),
            const SizedBox(width: 2),
            Text(unit, style: AppStyles.caption.copyWith(fontSize: 10, color: AppColors.textSubLight)),
          ],
        ),
      ],
    );
  }
}
