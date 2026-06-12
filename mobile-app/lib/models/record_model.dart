class RecordModel {
  final int recordId;
  final int patientId;
  final int? appointmentId;
  final int? mainDoctorId;
  final String? diagnosis;
  final String? treatment;
  final String? note;
  final String status;
  final String createdAt;
  final String? doctorName;
  final String? specialty;

  RecordModel({
    required this.recordId,
    required this.patientId,
    this.appointmentId,
    this.mainDoctorId,
    this.diagnosis,
    this.treatment,
    this.note,
    required this.status,
    required this.createdAt,
    this.doctorName,
    this.specialty,
  });

  factory RecordModel.fromJson(Map<String, dynamic> json) {
    return RecordModel(
      recordId: json['recordId'] ?? 0,
      patientId: json['patientId'] ?? 0,
      appointmentId: json['appointmentId'],
      mainDoctorId: json['mainDoctorId'],
      diagnosis: json['diagnosis'],
      treatment: json['treatment'],
      note: json['note'],
      status: json['status'] ?? 'IN_PROGRESS',
      createdAt: _parseDate(json['createdAt'] ?? json['created_at'] ?? json['date']),
      doctorName: json['mainDoctorName'] ?? json['doctorName'] ?? json['doctor_name'],
      specialty: json['specialty'],
    );
  }

  static String _parseDate(dynamic value) {
    if (value == null) return '';
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
