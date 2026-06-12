class PrescriptionItemModel {
  final int medicineId;
  final String unit;
  final double quantity;
  final String? dosage;
  final double? price;
  final String? medicineName; // For display

  PrescriptionItemModel({
    required this.medicineId,
    required this.unit,
    required this.quantity,
    this.dosage,
    this.price,
    this.medicineName,
  });

  factory PrescriptionItemModel.fromJson(Map<String, dynamic> json) {
    return PrescriptionItemModel(
      medicineId: json['medicineId'] ?? 0,
      unit: json['unit'] ?? '',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 0.0,
      dosage: json['dosage'],
      price: (json['price'] as num?)?.toDouble(),
      medicineName: json['medicineName'] ?? json['medicine_name'],
    );
  }
}

class PrescriptionModel {
  final int id;
  final int recordId;
  final String createdAt;
  final List<PrescriptionItemModel> items;

  PrescriptionModel({
    required this.id,
    required this.recordId,
    required this.createdAt,
    required this.items,
  });

  factory PrescriptionModel.fromJson(Map<String, dynamic> json) {
    return PrescriptionModel(
      id: json['id'] ?? 0,
      recordId: json['recordId'] ?? 0,
      createdAt: json['createdAt'] ?? json['date'] ?? '',
      items: (json['items'] as List?)
              ?.map((e) => PrescriptionItemModel.fromJson(e))
              .toList() ?? [],
    );
  }
}
