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
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.green.withValues(alpha: 0.15),
                                  Colors.green.withValues(alpha: 0.05),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(20)
                            ),
                            child: Text(
                              widget.record.status.toUpperCase() == 'DONE' ? 'Hoàn thành' : widget.record.status, 
                              style: AppStyles.caption.copyWith(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 13)
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(widget.record.diagnosis ?? 'Chưa có chẩn đoán', style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF1F2937))),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
                            child: const Icon(Icons.person_rounded, size: 16, color: Color(0xFF64748B)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Bác sĩ điều trị', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                                Text(widget.record.doctorName ?? 'Chưa rõ', style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
                            child: const Icon(Icons.calendar_today_rounded, size: 16, color: Color(0xFF64748B)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Ngày khám', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                                Text(DateFormatter.formatDateTime(widget.record.createdAt), style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Links to other details
                Column(
                  children: [
                    _buildActionTile(
                      context,
                      title: 'Đơn thuốc',
                      subtitle: '${medicines.length} loại thuốc',
                      icon: Icons.medication_rounded,
                      gradientColors: const [Color(0xFFF97316), Color(0xFFEA580C)],
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => PrescriptionScreen(medicines: medicines))),
                    ),
                    const SizedBox(height: 16),
                    _buildActionTile(
                      context,
                      title: 'Khám Cận lâm sàng',
                      subtitle: '${labResults.length} kết quả',
                      icon: Icons.science_rounded,
                      gradientColors: const [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => LabResultScreen(results: labResults))),
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
                        children: [
                          _buildVitalItem('Huyết áp', '120/80', 'mmHg', Icons.water_drop_rounded, const Color(0xFFEF4444)),
                          const SizedBox(width: 12),
                          _buildVitalItem('Nhịp tim', '75', 'bpm', Icons.favorite_rounded, const Color(0xFFF43F5E)),
                          const SizedBox(width: 12),
                          _buildVitalItem('Nhiệt độ', '37', '°C', Icons.thermostat_rounded, const Color(0xFFF59E0B)),
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

  Widget _buildActionTile(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required List<Color> gradientColors,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    gradientColors[0].withValues(alpha: 0.25),
                    gradientColors[1].withValues(alpha: 0.05),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: gradientColors[0], size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF1F2937))),
                  const SizedBox(height: 4),
                  Text(subtitle, style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontSize: 12)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: Color(0xFFCBD5E1), size: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildVitalItem(String title, String value, String unit, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.1)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(title, style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(value, style: AppStyles.heading3.copyWith(color: AppColors.textMainLight, fontSize: 16)),
                  const SizedBox(width: 2),
                  Text(unit, style: AppStyles.caption.copyWith(fontSize: 10, color: AppColors.textSubLight)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
