class LabResultModel {
  final int resultId;
  final int orderId;
  final String? resultData;
  final String? conclusion;
  final String? attachmentUrl;
  final String? serviceName; // For display
  final String? date;
  final String? status;
  final double? price;
  final String? normalRange;
  final String? unit;

  LabResultModel({
    required this.resultId,
    required this.orderId,
    this.resultData,
    this.conclusion,
    this.attachmentUrl,
    this.serviceName,
    this.date,
    this.status,
    this.price,
    this.normalRange,
    this.unit,
  });

  factory LabResultModel.fromJson(Map<String, dynamic> json) {
    return LabResultModel(
      resultId: json['resultId'] ?? json['id'] ?? 0,
      orderId: json['orderId'] ?? 0,
      resultData: json['resultData'],
      conclusion: json['conclusion'],
      attachmentUrl: json['attachmentUrl'],
      serviceName: json['serviceName'] ?? json['testName'],
      date: _parseDate(json['enteredAt'] ?? json['entered_at'] ?? json['date']),
      status: json['status'] ?? (json['conclusion']?.toString().toLowerCase().contains('bình thường') == true 
          ? 'Bình thường' 
          : (json['conclusion'] != null ? 'Bất thường' : 'Chờ KQ')),
      price: (json['price'] as num?)?.toDouble(),
      normalRange: json['normalRange'],
      unit: json['unit'],
    );
  }

  static String? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is String) return value;
    if (value is List && value.length >= 3) {
      final year = value[0].toString().padLeft(4, '0');
      final month = value[1].toString().padLeft(2, '0');
      final day = value[2].toString().padLeft(2, '0');
      String result = '$year-$month-$day';
      if (value.length >= 6) {
        final hour = value[3].toString().padLeft(2, '0');
        final min = value[4].toString().padLeft(2, '0');
        final sec = value[5].toString().padLeft(2, '0');
        result += 'T$hour:$min:$sec';
      }
      return result;
    }
    return value.toString();
  }
}
