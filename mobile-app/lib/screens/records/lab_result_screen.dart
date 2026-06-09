import 'package:clinic_management_system/app_exports.dart';

class LabResultScreen extends StatelessWidget {
  const LabResultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> results = [
      {'name': 'Hồng cầu (RBC)', 'value': '4.5', 'unit': 'T/L', 'range': '4.0 - 5.8', 'isNormal': true},
      {'name': 'Bạch cầu (WBC)', 'value': '11.2', 'unit': 'G/L', 'range': '4.0 - 10.0', 'isNormal': false},
      {'name': 'Đường huyết', 'value': '5.2', 'unit': 'mmol/L', 'range': '3.9 - 6.4', 'isNormal': true},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Kết quả xét nghiệm', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Xét nghiệm máu tổng quát', style: AppStyles.heading2.copyWith(fontSize: 18)),
                  const SizedBox(height: 8),
                  Text('Thực hiện: 24/10/2023', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                  const SizedBox(height: 16),
                  const Divider(color: Color(0xFFF1F5F9)),
                  const SizedBox(height: 8),
                  
                  // Table Header
                  Row(
                    children: [
                      Expanded(flex: 2, child: Text('Chỉ số', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold))),
                      Expanded(flex: 1, child: Text('Kết quả', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                      Expanded(flex: 1, child: Text('CSBT', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold), textAlign: TextAlign.right)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  
                  // Table Body
                  ...results.map((result) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Row(
                        children: [
                          Expanded(
                            flex: 2, 
                            child: Text(result['name'], style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600))
                          ),
                          Expanded(
                            flex: 1, 
                            child: Column(
                              children: [
                                Text(
                                  result['value'], 
                                  style: AppStyles.bodyLarge.copyWith(
                                    color: result['isNormal'] ? Colors.green : Colors.red,
                                    fontWeight: FontWeight.bold
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                Text(result['unit'], style: AppStyles.caption.copyWith(fontSize: 10, color: AppColors.textSubLight)),
                              ],
                            ),
                          ),
                          Expanded(
                            flex: 1, 
                            child: Text(result['range'], style: AppStyles.caption.copyWith(color: AppColors.textSubLight), textAlign: TextAlign.right)
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
