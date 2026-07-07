class DoctorModel {
  final int staffId;
  final String fullName;
  final int? expertiseId;
  final String? expertiseName;
  final String? imageUrl;
  final String experience;
  final String biography;
  final double consultationFinalFee;
  final double rating;
  final int patientCount;

  // Aliases for compatibility
  int get id => staffId;
  String get name => fullName;
  String? get specialty => expertiseName;

  DoctorModel({
    required this.staffId,
    required this.fullName,
    this.expertiseId,
    this.expertiseName,
    this.imageUrl,
    required this.experience,
    required this.biography,
    required this.consultationFinalFee,
    required this.rating,
    required this.patientCount,
  });

  factory DoctorModel.fromJson(Map<String, dynamic> json) {
    // Generate mock rating and patientCount as fallback if not provided by backend yet
    final int safeStaffId = (json['staffId'] as num?)?.toInt() ?? 0;
    
    final double rating = (json['rating'] != null) 
        ? (json['rating'] as num).toDouble() 
        : (4.0 + (safeStaffId % 10) / 10.0);
        
    final int patientCount = (json['patientCount'] != null) 
        ? (json['patientCount'] as num).toInt() 
        : (100 + safeStaffId * 15);
        
    final double fee = json['consultationFinalFee'] != null 
        ? (json['consultationFinalFee'] as num).toDouble() 
        : 150000.0;

    return DoctorModel(
      staffId: json['staffId'] ?? 0,
      fullName: json['fullName'] ?? 'Bác sĩ',
      expertiseId: json['expertiseId'] != null ? (json['expertiseId'] as num).toInt() : null,
      expertiseName: json['expertiseName'] ?? 'Chuyên khoa Nội',
      imageUrl: json['imageUrl'],
      experience: json['experience'] ?? 'Nhiều năm kinh nghiệm',
      biography: json['biography'] ?? 'Bác sĩ có chuyên môn cao và luôn tận tâm với bệnh nhân.',
      consultationFinalFee: fee,
      rating: rating,
      patientCount: patientCount,
    );
  }
}
