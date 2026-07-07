import '../models/service_model.dart';

extension ServicePriceUtils on ServiceModel {
  /// True only when discount is lower than original (and > 0).
  bool get hasDiscount =>
      discountAmount != null &&
      discountAmount! > 0 &&
      discountAmount! < originalPrice;

  double get effectivePrice => hasDiscount ? discountAmount! : originalPrice;

  int get discountPercent {
    if (!hasDiscount || originalPrice <= 0) return 0;
    return ((1 - discountAmount! / originalPrice) * 100).round();
  }
}

String serviceTypeLabel(String? type) {
  switch (type) {
    case 'EXAM':
      return 'Khám bệnh';
    case 'LAB_TEST':
      return 'Xét nghiệm';
    case 'X_RAY':
      return 'Chụp X-Quang';
    case 'ULTRASOUND':
      return 'Siêu âm';
    case 'CT_SCAN':
      return 'Chụp CT';
    case 'MRI':
      return 'Chụp MRI';
    case 'ENDOSCOPY':
      return 'Nội soi';
    case 'OTHER':
      return 'Khác';
    default:
      return type ?? 'Dịch vụ';
  }
}
