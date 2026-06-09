import 'package:clinic_management_system/app_exports.dart';

class BillingScreen extends StatelessWidget {
  const BillingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> invoices = [
      {
        'id': 'INV-001',
        'date': '24/10/2023',
        'amount': '500,000 VND',
        'service': 'Khám chuyên khoa',
        'status': 'Đã thanh toán',
      },
      {
        'id': 'INV-002',
        'date': '15/09/2023',
        'amount': '1,200,000 VND',
        'service': 'Xét nghiệm máu',
        'status': 'Đã thanh toán',
      }
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Lịch sử thanh toán', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(24),
        itemCount: invoices.length,
        itemBuilder: (context, index) {
          final invoice = invoices[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Mã: ${invoice['id']}', style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(invoice['status'], style: AppStyles.caption.copyWith(color: Colors.green, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Ngày khám:', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
                    Text(invoice['date'], style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Dịch vụ:', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
                    Text(invoice['service'], style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600)),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(height: 1, color: Color(0xFFF1F5F9)),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Tổng tiền:', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
                    Text(invoice['amount'], style: AppStyles.heading3.copyWith(color: AppColors.primary)),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
