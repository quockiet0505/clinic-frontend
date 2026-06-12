import 'package:clinic_management_system/core/network/dio_client.dart';

class DoctorService {
  final DioClient _dioClient = DioClient();

  Future<List<dynamic>> getSpecialties() async {
    try {
      final response = await _dioClient.dio.get('/expertise');
      if (response.statusCode == 200) {
        return response.data['data'] ?? [];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch specialties');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<List<dynamic>> getDoctors() async {
    try {
      final response = await _dioClient.dio.get('/staffs/doctors');
      if (response.statusCode == 200) {
        return response.data['data'] ?? [];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch doctors');
      }
    } catch (e) {
      rethrow;
    }
  }
}
