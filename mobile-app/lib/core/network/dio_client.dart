import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DioClient {
  late Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  DioClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: (dotenv.env['USE_LOCAL_API'] == 'true')
            ? (dotenv.env['LOCAL_API_BASE_URL'] ?? 'http://10.0.2.2:8080/api/v1')
            : (dotenv.env['PROD_API_BASE_URL'] ?? 'http://api.duongquockiet.id.vn/api/v1'),
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add JWT Token to header
          String? token = await _storage.read(key: 'jwt_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          // Handle 401 Unauthorized globally
          if (e.response?.statusCode == 401) {
            await _storage.delete(key: 'jwt_token');
            // Navigate to login screen
            // Will be handled in Provider/Auth Logic
          }
          return handler.next(e);
        },
      ),
    );
  }

  Dio get dio => _dio;
}
