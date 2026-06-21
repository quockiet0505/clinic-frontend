import 'package:clinic_management_system/core/network/dio_client.dart';

class DoctorService {
  final DioClient _dioClient = DioClient();

  Future<List<dynamic>> getSpecialties() async {
    try {
      final response = await _dioClient.dio.get('/expertise');
      if (response.statusCode == 200) {
        final data = response.data['data'];
        if (data is List) return data;
        if (data is Map && data.containsKey('content')) return data['content'] as List;
        return data == null ? [] : [data];
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
        final data = response.data['data'];
        if (data is List) return data;
        if (data is Map && data.containsKey('content')) return data['content'] as List;
        return data == null ? [] : [data];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch doctors');
      }
    } catch (e) {
      rethrow;
    }
  }
}
