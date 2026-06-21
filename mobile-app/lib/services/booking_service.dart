import 'package:clinic_management_system/core/network/dio_client.dart';

class BookingService {
  final DioClient _dioClient = DioClient();

  Future<List<dynamic>> getMyAppointments() async {
    try {
      final response = await _dioClient.dio.get('/appointments/my');
      if (response.statusCode == 200) {
        final data = response.data['data'];
        if (data is List) return data;
        if (data is Map && data.containsKey('content')) return data['content'] as List;
        return data == null ? [] : [data];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch appointments');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<List<dynamic>> getAvailableSlots(int doctorId, String date) async {
    try {
      final response = await _dioClient.dio.get('/appointments/available-time', queryParameters: {
        'doctorId': doctorId > 0 ? doctorId : null,
        'date': date,
      });
      if (response.statusCode == 200) {
        final data = response.data['data'];
        if (data is List) return data;
        if (data is Map && data.containsKey('content')) return data['content'] as List;
        return data == null ? [] : [data];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch slots');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<void> confirmBooking({
    int? doctorId,
    int? serviceId,
    int? expertiseId,
    required String date,
    required String timeStart,
    required String timeEnd,
    required String note,
  }) async {
    try {
      final response = await _dioClient.dio.post('/appointments/book', data: {
        if (doctorId != null && doctorId > 0) 'doctorId': doctorId,
        if (serviceId != null) 'serviceId': serviceId,
        if (expertiseId != null) 'expertiseId': expertiseId,
        'appointmentDate': date,
        'timeStart': timeStart,
        'timeEnd': timeEnd,
        'notes': note,
      });
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(response.data['message'] ?? 'Failed to book appointment');
      }
    } catch (e) {
      rethrow;
    }
  }
}
