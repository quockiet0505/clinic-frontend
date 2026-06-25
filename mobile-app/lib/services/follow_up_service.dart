import 'package:clinic_management_system/core/network/dio_client.dart';

class PatientFollowUp {
  final int followUpId;
  final String doctorName;
  final String scheduledDatetime;
  final String? note;
  final String status;

  PatientFollowUp({
    required this.followUpId,
    required this.doctorName,
    required this.scheduledDatetime,
    this.note,
    required this.status,
  });

  factory PatientFollowUp.fromJson(Map<String, dynamic> json) {
    return PatientFollowUp(
      followUpId: json['followUpId'] as int? ?? 0,
      doctorName: json['doctorName']?.toString() ?? '',
      scheduledDatetime: json['scheduledDatetime']?.toString() ?? '',
      note: json['note']?.toString(),
      status: json['status']?.toString() ?? 'PENDING',
    );
  }
}

class FollowUpService {
  final DioClient _dioClient = DioClient();

  Future<List<PatientFollowUp>> getMyFollowUps() async {
    final response = await _dioClient.dio.get('/follow-ups/my');
    if (response.statusCode == 200) {
      final data = response.data['data'];
      if (data is List) {
        return data.map((e) => PatientFollowUp.fromJson(Map<String, dynamic>.from(e as Map))).toList();
      }
      return [];
    }
    throw Exception(response.data['message'] ?? 'Failed to fetch follow-ups');
  }

  Future<void> confirm(int followUpId) async {
    final response = await _dioClient.dio.post('/follow-ups/$followUpId/confirm');
    if (response.statusCode != 200) {
      throw Exception(response.data['message'] ?? 'Failed to confirm follow-up');
    }
  }

  Future<void> decline(int followUpId, {String? reason}) async {
    final response = await _dioClient.dio.post(
      '/follow-ups/$followUpId/decline',
      queryParameters: reason != null && reason.isNotEmpty ? {'reason': reason} : null,
    );
    if (response.statusCode != 200) {
      throw Exception(response.data['message'] ?? 'Failed to decline follow-up');
    }
  }
}
