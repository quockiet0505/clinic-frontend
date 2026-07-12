import 'dart:async';
import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';
import 'package:clinic_management_system/services/billing_service.dart';

class BillingHistoryScreen extends StatefulWidget {
  const BillingHistoryScreen({super.key});

  @override
  State<BillingHistoryScreen> createState() => _BillingHistoryScreenState();
}

class _BillingHistoryScreenState extends State<BillingHistoryScreen> {
  final BillingService _billingService = BillingService();
  List<dynamic> _invoices = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchInvoices();
  }

  Future<void> _fetchInvoices() async {
    setState(() => _isLoading = true);
    try {
      final data = await _billingService.getMyInvoices();
      setState(() {
        _invoices = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi tải lịch sử hóa đơn: $e')),
        );
      }
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'UNPAID':
        return 'Chưa thanh toán';
      case 'PENDING_VERIFY':
        return 'Đang đối soát';
      case 'PAID':
        return 'Đã thanh toán';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'PAID':
        return Colors.green;
      case 'PENDING_VERIFY':
        return Colors.orange;
      case 'UNPAID':
        return Colors.amber.shade800;
      case 'REFUNDED':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  void _showPaymentDialog(Map<String, dynamic> invoice) {
    final int invoiceId = invoice['invoiceId'];
    final double totalPrice = (invoice['totalPrice'] as num).toDouble();
    final String qrUrl =
        'https://img.vietqr.io/image/MB-0767664699-compact2.png?amount=${totalPrice.round()}&addInfo=BILL$invoiceId&accountName=DUONG%20QUOC%20KIET';

    Timer? pollTimer;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            if (pollTimer == null) {
              pollTimer = Timer.periodic(const Duration(seconds: 5), (timer) async {
                try {
                  final data = await _billingService.getMyInvoices();
                  final current = data.firstWhere((i) => i['invoiceId'] == invoiceId, orElse: () => null);
                  if (current != null && current['status'] == 'PAID') {
                    timer.cancel();
                    if (context.mounted) {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Thanh toán thành công! Hệ thống đã nhận được tiền.'),
                          backgroundColor: Colors.green,
                        ),
                      );
                      _fetchInvoices();
                    }
                  }
                } catch (e) {}
              });
            }

            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 32,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Thanh toán Chuyển khoản',
                    style: AppStyles.heading2.copyWith(fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Vui lòng quét mã VietQR để thực hiện giao dịch',
                    style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Số tiền cần chuyển:',
                          style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '${totalPrice.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')} đ',
                          style: AppStyles.heading2.copyWith(fontSize: 16, color: AppColors.primary),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.grey.shade200),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        qrUrl,
                        width: 220,
                        height: 220,
                        fit: BoxFit.contain,
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return Container(
                            width: 220,
                            height: 220,
                            color: Colors.grey.shade50,
                            child: const Center(
                              child: CircularProgressIndicator(),
                            ),
                          );
                        },
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            width: 220,
                            height: 220,
                            color: Colors.red.shade50,
                            child: const Center(
                              child: Icon(Icons.error_outline_rounded, color: Colors.red, size: 40),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.orange.shade100),
                    ),
                    child: Text(
                      'Vui lòng không chỉnh sửa số tiền và nội dung chuyển khoản (BILL$invoiceId) để hệ thống nhận diện tự động chính xác.',
                      style: AppStyles.caption.copyWith(color: Colors.orange.shade800, fontWeight: FontWeight.w600),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.amber.shade700),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Hệ thống đang chờ nhận thanh toán...',
                          style: AppStyles.bodyMedium.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Colors.amber.shade800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    ).whenComplete(() {
      pollTimer?.cancel();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F9FF),
      appBar: const GradientAppBar(title: 'Lịch sử thanh toán'),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _invoices.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.receipt_long_rounded, size: 64, color: AppColors.textSubLight.withValues(alpha: 0.3)),
                      const SizedBox(height: 16),
                      Text(
                        'Không có lịch sử hóa đơn',
                        style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold, color: AppColors.textMainLight),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Hóa đơn khám của bạn sẽ xuất hiện tại đây.',
                        style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _invoices.length,
                  itemBuilder: (context, index) {
                    final invoice = _invoices[index];
                    final int invoiceId = invoice['invoiceId'];
                    final double totalPrice = (invoice['totalPrice'] as num).toDouble();
                    final String status = invoice['status'];
                    final String createdAt = invoice['createdAt'];
                    final List<dynamic> items = invoice['items'] ?? [];

                    final formattedDate = createdAt.length >= 10 ? createdAt.substring(0, 10) : createdAt;

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      color: Colors.white,
                      elevation: 0,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Hóa đơn #BILL-$invoiceId',
                                  style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _getStatusColor(status).withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    _getStatusText(status),
                                    style: AppStyles.caption.copyWith(
                                      color: _getStatusColor(status),
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Ngày tạo: $formattedDate',
                              style: AppStyles.caption.copyWith(color: AppColors.textSubLight),
                            ),
                            const SizedBox(height: 12),
                            const Divider(height: 1, color: Color(0xFFF1F5F9)),
                            const SizedBox(height: 12),
                            ...items.map((item) {
                              final double price = (item['priceAtTime'] as num).toDouble();
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        '• ${item['description']}',
                                        style: AppStyles.bodyMedium.copyWith(color: Colors.grey.shade700),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '${price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')} đ',
                                      style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              );
                            }),
                            const SizedBox(height: 12),
                            const Divider(height: 1, color: Color(0xFFF1F5F9)),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Tổng cộng:',
                                  style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold),
                                ),
                                Text(
                                  '${totalPrice.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')} đ',
                                  style: AppStyles.heading2.copyWith(fontSize: 16, color: AppColors.primary),
                                ),
                              ],
                            ),
                            if (status == 'UNPAID') ...[
                              const SizedBox(height: 16),
                              SizedBox(
                                width: double.infinity,
                                height: 44,
                                child: GradientButton(
                                  text: 'Thanh toán QR',
                                  onPressed: () => _showPaymentDialog(invoice),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
