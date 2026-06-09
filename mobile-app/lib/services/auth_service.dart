import 'package:dio/dio.dart';
import 'package:clinic_management_system/core/network/dio_client.dart';

class AuthService {
  final DioClient _dioClient = DioClient();

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dioClient.dio.post(
        '/auth/patient/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        return response.data['data']; // AuthResponse
      } else {
        throw Exception(response.data['message'] ?? 'Login failed');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Login failed');
      }
      throw Exception('Network error');
    }
  }

  Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await _dioClient.dio.get('/patients/profile');
      if (response.statusCode == 200) {
        return response.data['data'];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to get profile');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Failed to get profile');
      }
      throw Exception('Network error');
    }
  }

  Future<Map<String, dynamic>> register(String fullName, String phone, String email, String password) async {
    try {
      final response = await _dioClient.dio.post(
        '/auth/patient/register',
        data: {
          'fullName': fullName,
          'phone': phone,
          'email': email,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        return response.data['data'];
      } else {
        throw Exception(response.data['message'] ?? 'Register failed');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Register failed');
      }
      throw Exception('Network error');
    }
  }

  Future<void> logout() async {
    try {
      await _dioClient.dio.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    }
  }
}
