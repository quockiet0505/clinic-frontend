import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/screens/records/record_detail_screen.dart';

class RecordsScreen extends StatelessWidget {
  const RecordsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> records = [
      {
        'id': 'MR-001',
        'date': '24/10/2023',
        'doctor': 'Dr. Nguyễn Văn A',
        'diagnosis': 'Viêm họng hạt',
        'status': 'Hoàn thành'
      },
      {
        'id': 'MR-002',
        'date': '15/09/2023',
        'doctor': 'Dr. Trần Thị B',
        'diagnosis': 'Khám tổng quát',
        'status': 'Hoàn thành'
      }
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: const GradientAppBar(
        title: 'Hồ sơ y tế',
        automaticallyImplyLeading: false, // Don't show back button if it's a bottom nav tab
      ),
      body: records.isEmpty 
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.all(24).copyWith(bottom: 100),
              itemCount: records.length,
              itemBuilder: (context, index) {
                final record = records[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => RecordDetailScreen(record: record)));
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(Icons.medical_information_outlined, color: AppColors.primary),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(record['diagnosis'], style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text('Bác sĩ: ${record['doctor']}', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(Icons.calendar_today_outlined, size: 14, color: AppColors.primary),
                                  const SizedBox(width: 4),
                                  Text(record['date'], style: AppStyles.caption.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600)),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.grey),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.05),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.folder_open_rounded, size: 64, color: AppColors.primary),
          ),
          const SizedBox(height: 24),
          Text('Chưa có hồ sơ y tế', style: AppStyles.heading2.copyWith(fontSize: 20)),
          const SizedBox(height: 8),
          Text('Bạn chưa có lịch sử khám bệnh nào.', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
        ],
      ),
    );
  }
}
