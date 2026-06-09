import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/screens/records/prescription_screen.dart';
import 'package:clinic_management_system/screens/records/lab_result_screen.dart';

class RecordDetailScreen extends StatelessWidget {
  final Map<String, dynamic> record;

  const RecordDetailScreen({super.key, required this.record});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Chi tiết bệnh án', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            // Overview Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Mã BA: ${record['id']}', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                        child: Text(record['status'], style: AppStyles.caption.copyWith(color: Colors.green, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(record['diagnosis'], style: AppStyles.heading2.copyWith(fontSize: 22)),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.person_outline, size: 16, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Text('Bác sĩ điều trị: ${record['doctor']}', style: AppStyles.bodyMedium),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Text('Ngày khám: ${record['date']}', style: AppStyles.bodyMedium),
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
                    () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PrescriptionScreen()))
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildActionCard(
                    context, 
                    'Kết quả CLS', 
                    Icons.science_outlined, 
                    Colors.blue, 
                    () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LabResultScreen()))
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
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
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
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
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
