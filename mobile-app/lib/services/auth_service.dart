import 'package:dio/dio.dart';
import 'package:clinic_management_system/core/network/dio_client.dart';

class AuthService {
  final DioClient _dioClient = DioClient();

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      print("BASE URL: ${_dioClient.dio.options.baseUrl}");
      print("PATH: /auth/patient/login");
      print("FULL URL: ${_dioClient.dio.options.baseUrl}/auth/patient/login");
      
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

  Future<Map<String, dynamic>> googleLogin(String idToken) async {
    try {
      final response = await _dioClient.dio.post(
        '/auth/google/login',
        data: {
          'idToken': idToken,
        },
      );

      if (response.statusCode == 200) {
        return response.data['data']; // AuthResponse
      } else {
        throw Exception(response.data['message'] ?? 'Google Login failed');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        if (e.response?.statusCode == 404 && e.response?.data['message'] == 'REQUIRES_REGISTRATION') {
          return {
            'requires_registration': true,
            'data': e.response?.data['data'],
          };
        }
        throw Exception(e.response?.data['message'] ?? 'Google Login failed');
      }
      throw Exception('Network error');
    }
  }

  Future<Map<String, dynamic>> googleRegister(String fullName, String phone, String email, String idToken, String gender, String dateOfBirth, String address) async {
    try {
      final response = await _dioClient.dio.post(
        '/auth/google/register',
        data: {
          'fullName': fullName,
          'phone': phone,
          'email': email,
          'idToken': idToken,
          'password': '', // Backend will mock this
          'gender': gender,
          'dateOfBirth': dateOfBirth,
          'address': address,
        },
      );

      if (response.statusCode == 200) {
        return response.data['data'];
      } else {
        throw Exception(response.data['message'] ?? 'Google Register failed');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Google Register failed');
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

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await _dioClient.dio.put('/patients/profile', data: data);
      if (response.statusCode == 200) {
        return response.data['data'];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to update profile');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Failed to update profile');
      }
      throw Exception('Network error');
    }
  }

  Future<String> uploadAvatar(String filePath) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
      });
      final response = await _dioClient.dio.post(
        '/upload/image',
        data: formData,
      );
      if (response.statusCode == 200) {
        return response.data['data']; // Returns the URL
      } else {
        throw Exception(response.data['message'] ?? 'Failed to upload avatar');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Failed to upload avatar');
      }
      throw Exception('Network error');
    }
  }

  Future<Map<String, dynamic>> register(String fullName, String phone, String email, String password, String gender, String dateOfBirth, String address) async {
    try {
      final response = await _dioClient.dio.post(
        '/auth/patient/register',
        data: {
          'fullName': fullName,
          'phone': phone,
          'email': email,
          'password': password,
          'gender': gender,
          'dateOfBirth': dateOfBirth,
          'address': address,
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

  Future<void> changePassword(String currentPassword, String newPassword) async {
    try {
      final response = await _dioClient.dio.put(
        '/auth/change-password',
        data: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
      );
      if (response.statusCode != 200) {
        throw Exception(response.data['message'] ?? 'Failed to change password');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Failed to change password');
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
