class BillModel {
  final int billId;
  final int appointmentId;
  final double totalAmount;
  final String status;
  final String? paymentMethod;
  final String createdAt;

  BillModel({
    required this.billId,
    required this.appointmentId,
    required this.totalAmount,
    required this.status,
    this.paymentMethod,
    required this.createdAt,
  });

  factory BillModel.fromJson(Map<String, dynamic> json) {
    return BillModel(
      billId: json['billId'] ?? 0,
      appointmentId: json['appointmentId'] ?? 0,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'UNPAID',
      paymentMethod: json['paymentMethod'],
      createdAt: json['createdAt'] ?? json['date'] ?? '',
    );
  }
}
