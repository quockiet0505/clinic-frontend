import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AiChatService {
  late final Dio _dio;
  final String sessionId;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  AiChatService({String? sessionId})
      : sessionId = sessionId ?? 'mobile-${DateTime.now().millisecondsSinceEpoch}' {
    _dio = Dio(
      BaseOptions(
        baseUrl: dotenv.env['AI_CHAT_URL'] ?? 'http://10.0.2.2:8000',
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 120),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
  }

  Future<String?> _readAccessToken() async {
    return _storage.read(key: 'jwt_token');
  }

  Future<String> sendMessage(String message, {String? accessToken}) async {
    try {
      final token = accessToken ?? await _readAccessToken();
      final payload = <String, dynamic>{
        'message': message,
        'session_id': sessionId,
      };
      if (token != null && token.isNotEmpty) {
        payload['access_token'] = token;
      }

      final response = await _dio.post(
        '/api/v1/chat/send',
        data: payload,
      );

      final data = response.data;
      if (data is Map && data['reply'] != null) {
        return data['reply'].toString();
      }
      return 'Xin lỗi, tôi chưa thể trả lời ngay lúc này.';
    } on DioException catch (e) {
      final detail = e.response?.data;
      if (detail is Map && detail['detail'] != null) {
        throw Exception(detail['detail'].toString());
      }
      throw Exception('Không thể kết nối tới AI Chat service. Kiểm tra port 8000.');
    }
  }
}
