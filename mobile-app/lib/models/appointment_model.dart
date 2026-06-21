class AppointmentModel {
  final int appointmentId;
  final int patientId;
  final int? mainDoctorId;
  final int? serviceId;
  final String appointmentDate;
  final String? timeStart;
  final String? timeEnd;
  final String status;
  final String? doctorName;
  final String? specialty;
  final String? doctorAvatar;
  final String? note;
  final String? cancelReason;
  final String? appointmentType;
  final String? serviceName;

  AppointmentModel({
    required this.appointmentId,
    required this.patientId,
    this.mainDoctorId,
    this.serviceId,
    required this.appointmentDate,
    this.timeStart,
    this.timeEnd,
    required this.status,
    this.doctorName,
    this.specialty,
    this.doctorAvatar,
    this.note,
    this.cancelReason,
    this.appointmentType,
    this.serviceName,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    return AppointmentModel(
      appointmentId: json['appointmentId'] ?? 0,
      patientId: json['patientId'] ?? 0,
      mainDoctorId: json['mainDoctorId'],
      serviceId: json['serviceId'],
      appointmentDate: json['appointmentDate'] ?? json['date'] ?? '',
      timeStart: json['timeStart'] ?? json['time_start'] ?? json['time'],
      timeEnd: json['timeEnd'] ?? json['time_end'],
      status: json['status'] ?? 'PENDING',
      doctorName: json['doctorName'] ?? json['doctor_name'],
      specialty: json['specialty'] ?? json['expertiseName'],
      doctorAvatar: json['doctorAvatar'],
      note: json['note'],
      cancelReason: json['cancelReason'],
      appointmentType: json['appointmentType'] ?? 'OFFLINE',
      serviceName: json['serviceName'],
    );
  }
}
