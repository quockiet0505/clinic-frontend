import 'package:clinic_management_system/core/network/dio_client.dart';

class PatientNotification {
  final int id;
  final String type;
  final String subject;
  final String content;
  final DateTime sentAt;

  PatientNotification({
    required this.id,
    required this.type,
    required this.subject,
    required this.content,
    required this.sentAt,
  });

  factory PatientNotification.fromJson(Map<String, dynamic> json) {
    return PatientNotification(
      id: json['id'] as int? ?? json['notificationId'] as int? ?? 0,
      type: json['type']?.toString() ?? 'SYSTEM',
      subject: json['subject']?.toString() ?? '',
      content: json['content']?.toString() ?? '',
      sentAt: DateTime.tryParse(json['sentAt']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}

class NotificationService {
  final DioClient _dioClient = DioClient();

  Future<List<PatientNotification>> getMyNotifications() async {
    final response = await _dioClient.dio.get('/notifications/my');
    if (response.statusCode == 200) {
      final data = response.data['data'];
      if (data is List) {
        return data.map((e) => PatientNotification.fromJson(Map<String, dynamic>.from(e as Map))).toList();
      }
      return [];
    }
    throw Exception(response.data['message'] ?? 'Failed to fetch notifications');
  }
}
