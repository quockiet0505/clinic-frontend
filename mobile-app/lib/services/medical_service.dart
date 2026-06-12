import 'package:clinic_management_system/core/network/dio_client.dart';
import 'package:dio/dio.dart';

class MedicalService {
  final DioClient _dioClient = DioClient();

  Future<List<dynamic>> getServices() async {
    try {
      final response = await _dioClient.dio.get('/services');
      if (response.statusCode == 200) {
        return response.data['data'] ?? [];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch services');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch services');
    } catch (e) {
      rethrow;
    }
  }

  Future<List<dynamic>> getMyRecords() async {
    try {
      final response = await _dioClient.dio.get('/medical-records/my');
      if (response.statusCode == 200) {
        return response.data['data'] ?? [];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch records');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch records');
    } catch (e) {
      rethrow;
    }
  }

  Future<List<dynamic>> getMyLabResults() async {
    try {
      final response = await _dioClient.dio.get('/service-results/my');
      if (response.statusCode == 200) {
        return response.data['data'] ?? [];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch lab results');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch lab results');
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getRecordDetail(int recordId) async {
    try {
      final response = await _dioClient.dio.get('/medical-records/$recordId');
      if (response.statusCode == 200) {
        return response.data['data'] ?? {};
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch record detail');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch record detail');
    } catch (e) {
      rethrow;
    }
  }
}
