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

const patientBookableServiceTypes = {
  'LAB_TEST',
  'X_RAY',
};

bool isPatientBookableService(String? type) =>
    type != null && patientBookableServiceTypes.contains(type);

bool isHiddenServiceType(String? type) => type == 'EXAM';

enum ServiceType {
  EXAM,
  LAB_TEST,
  X_RAY,
  ULTRASOUND,
  CT_SCAN,
  MRI,
  ENDOSCOPY,
  OTHER,
}

extension ServiceTypeExtension on ServiceType {
  String get displayName {
    switch (this) {
      case ServiceType.EXAM:
        return 'Khám bệnh';
      case ServiceType.LAB_TEST:
        return 'Xét nghiệm';
      case ServiceType.X_RAY:
        return 'Chụp X-Quang';
      case ServiceType.ULTRASOUND:
        return 'Siêu âm';
      case ServiceType.CT_SCAN:
        return 'Chụp CT';
      case ServiceType.MRI:
        return 'Chụp MRI';
      case ServiceType.ENDOSCOPY:
        return 'Nội soi';
      case ServiceType.OTHER:
        return 'Khác';
    }
  }
}
