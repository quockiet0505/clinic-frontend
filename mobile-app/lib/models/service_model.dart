class ServiceModel {
  final int serviceId;
  final String serviceName;
  final String serviceType;
  final double originalPrice;
  final double? discountPrice;
  final String? imageUrl;
  final String? description;

  ServiceModel({
    required this.serviceId,
    required this.serviceName,
    required this.serviceType,
    required this.originalPrice,
    this.discountPrice,
    this.imageUrl,
    this.description,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      serviceId: json['serviceId'] ?? 0,
      serviceName: json['serviceName'] ?? 'Dịch vụ',
      serviceType: json['serviceType'] ?? 'Khám bệnh',
      originalPrice: (json['originalPrice'] as num?)?.toDouble() ?? 0.0,
      discountPrice: (json['discountPrice'] as num?)?.toDouble(),
      imageUrl: json['imageUrl'],
      description: json['description'],
    );
  }
}
