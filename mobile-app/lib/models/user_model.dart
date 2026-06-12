class UserModel {
  final int? patientId;
  final String? fullName;
  final String? email;
  final String? phone;
  final String? gender;
  final String? dateOfBirth;
  final String? address;
  final String? avatarUrl;

  UserModel({
    this.patientId,
    this.fullName,
    this.email,
    this.phone,
    this.gender,
    this.dateOfBirth,
    this.address,
    this.avatarUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      patientId: json['patientId'],
      fullName: json['fullName'],
      email: json['email'],
      phone: json['phone'],
      gender: json['gender'],
      dateOfBirth: json['dateOfBirth'],
      address: json['address'],
      avatarUrl: json['avatarUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'patientId': patientId,
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'gender': gender,
      'dateOfBirth': dateOfBirth,
      'address': address,
      'avatarUrl': avatarUrl,
    };
  }
}
