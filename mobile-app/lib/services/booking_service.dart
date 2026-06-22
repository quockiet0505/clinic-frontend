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

  Future<List<dynamic>> getAvailableSlots({
    int? doctorId,
    int? expertiseId,
    int? serviceId,
    required String date,
  }) async {
    try {
      final response = await _dioClient.dio.get('/appointments/slots', queryParameters: {
        if (doctorId != null && doctorId > 0) 'doctorId': doctorId,
        if (expertiseId != null && expertiseId > 0) 'expertiseId': expertiseId,
        if (serviceId != null && serviceId > 0) 'serviceId': serviceId,
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
    int? suggestedExpertiseId,
    required String bookingMode,
    required String date,
    required String timeStart,
    required String timeEnd,
    required String note,
    bool isAiSuggested = false,
  }) async {
    try {
      final response = await _dioClient.dio.post('/appointments', data: {
        if (doctorId != null && doctorId > 0) 'mainDoctorId': doctorId,
        if (serviceId != null) 'serviceId': serviceId,
        if (expertiseId != null) 'expertiseId': expertiseId,
        if (suggestedExpertiseId != null) 'suggestedExpertiseId': suggestedExpertiseId,
        'bookingMode': bookingMode,
        'isAiSuggested': isAiSuggested,
        'appointmentDate': date,
        'timeStart': timeStart,
        'timeEnd': timeEnd,
        'appointmentType': 'ONLINE',
        'createdBy': 'PATIENT',
        'note': note,
      });
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(response.data['message'] ?? 'Failed to book appointment');
      }
    } catch (e) {
      rethrow;
    }
  }
}
