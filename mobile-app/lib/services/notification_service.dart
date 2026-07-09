import 'package:clinic_management_system/core/network/dio_client.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'dart:io';

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

  // --- FCM Setup ---
  
  Future<void> setupFCM() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;

    NotificationSettings settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      String? token = await messaging.getToken();
      if (token != null) {
        await _syncTokenWithBackend(token);
      }
    }

    // Lắng nghe Token refresh (ví dụ khi xoá data app)
    messaging.onTokenRefresh.listen((newToken) {
      _syncTokenWithBackend(newToken);
    });

    // Lắng nghe Notification khi App đang mở (Foreground)
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Do app đã cài đặt flutter_local_notifications hoặc tự xử lý UI,
      // ở đây chỉ log hoặc có thể dùng FlutterLocalNotificationsPlugin để show popup.
      print('Nhận Push Foreground: ${message.notification?.title}');
    });

    // Lắng nghe khi người dùng bấm vào Notification mở App
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('Mở app từ Push: ${message.notification?.title}');
      // Có thể dùng GlobalKey<NavigatorState> để điều hướng tới NotificationScreen
    });
  }

  Future<void> _syncTokenWithBackend(String token) async {
    try {
      final deviceType = Platform.isIOS ? 'IOS' : 'ANDROID';
      await _dioClient.dio.post('/notifications/fcm-token', data: {
        'token': token,
        'deviceType': deviceType,
      });
    } catch (e) {
      // Bỏ qua lỗi ngầm nếu gọi API thất bại (chẳng hạn chưa login)
      print('Failed to sync FCM Token: $e');
    }
  }
}
