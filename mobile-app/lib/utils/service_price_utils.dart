import '../models/service_model.dart';

extension ServicePriceUtils on ServiceModel {
  /// True only when discount is lower than original (and > 0).
  bool get hasDiscount =>
      discountPrice != null &&
      discountPrice! > 0 &&
      discountPrice! < originalPrice;

  double get effectivePrice => hasDiscount ? discountPrice! : originalPrice;

  int get discountPercent {
    if (!hasDiscount || originalPrice <= 0) return 0;
    return ((1 - discountPrice! / originalPrice) * 100).round();
  }
}

String serviceTypeLabel(String? type) {
  switch (type) {
    case 'EXAM':
      return 'Khám bệnh';
    case 'LAB_TEST':
      return 'Xét nghiệm';
    case 'IMAGING':
      return 'Chẩn đoán hình ảnh';
    default:
      return type ?? 'Dịch vụ';
  }
}
