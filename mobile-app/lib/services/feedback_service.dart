import 'package:clinic_management_system/core/network/dio_client.dart';
import 'package:dio/dio.dart';

class FeedbackService {
  final DioClient _dioClient = DioClient();

  Future<void> submitDoctorReview({
    required int doctorId,
    required int appointmentId,
    required int rating,
    required String comment,
    required bool isAnonymous,
  }) async {
    try {
      final response = await _dioClient.dio.post('/feedbacks/doctor/my', data: {
        'doctorId': doctorId,
        'appointmentId': appointmentId,
        'rating': rating,
        'comment': comment,
        'isAnonymous': isAnonymous,
      });
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(response.data['message'] ?? 'Gửi đánh giá bác sĩ thất bại');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối khi gửi đánh giá');
    }
  }

  Future<void> submitClinicReview({
    int? recordId,
    int? appointmentId,
    required int rating,
    required String comment,
    required bool isAnonymous,
  }) async {
    try {
      final response = await _dioClient.dio.post('/feedbacks/clinic/my', data: {
        if (recordId != null) 'recordId': recordId,
        if (appointmentId != null) 'appointmentId': appointmentId,
        'rating': rating,
        'comment': comment,
        'isAnonymous': isAnonymous,
      });
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(response.data['message'] ?? 'Gửi đánh giá phòng khám thất bại');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối khi gửi đánh giá');
    }
  }
  
  Future<void> updateDoctorReview({
    required int reviewId,
    required int doctorId,
    required int appointmentId,
    required int rating,
    required String comment,
    required bool isAnonymous,
  }) async {
    try {
      final response = await _dioClient.dio.put('/feedbacks/doctor/my/$reviewId', data: {
        'doctorId': doctorId,
        'appointmentId': appointmentId,
        'rating': rating,
        'comment': comment,
        'isAnonymous': isAnonymous,
      });
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(response.data['message'] ?? 'Sửa đánh giá bác sĩ thất bại');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối khi sửa đánh giá');
    }
  }

  Future<void> updateClinicReview({
    required int reviewId,
    int? recordId,
    int? appointmentId,
    required int rating,
    required String comment,
    required bool isAnonymous,
  }) async {
    try {
      final response = await _dioClient.dio.put('/feedbacks/clinic/my/$reviewId', data: {
        if (recordId != null) 'recordId': recordId,
        if (appointmentId != null) 'appointmentId': appointmentId,
        'rating': rating,
        'comment': comment,
        'isAnonymous': isAnonymous,
      });
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(response.data['message'] ?? 'Sửa đánh giá phòng khám thất bại');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối khi sửa đánh giá');
    }
  }

  Future<List<dynamic>> getMyDoctorFeedbacks() async {
    try {
      final response = await _dioClient.dio.get('/feedbacks/doctor/my');
      if (response.statusCode == 200) return response.data['data'] ?? [];
      throw Exception(response.data['message'] ?? 'Lỗi tải đánh giá bác sĩ');
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối mạng');
    }
  }

  Future<List<dynamic>> getMyClinicFeedbacks() async {
    try {
      final response = await _dioClient.dio.get('/feedbacks/clinic/my');
      if (response.statusCode == 200) return response.data['data'] ?? [];
      throw Exception(response.data['message'] ?? 'Lỗi tải đánh giá phòng khám');
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối mạng');
    }
  }
}
