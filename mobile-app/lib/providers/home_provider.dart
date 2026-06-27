import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:clinic_management_system/app_exports.dart';
import '../core/network/dio_client.dart';
import 'package:dio/dio.dart';
import '../utils/image_utils.dart';

import '../models/doctor_model.dart';
import '../models/service_model.dart';
import '../services/doctor_service.dart';
import 'package:clinic_management_system/utils/service_price_utils.dart';

class HomeProvider extends ChangeNotifier {
  final DioClient _dioClient = DioClient();
  final DoctorService _doctorService = DoctorService();

  List<DoctorModel> doctors = [];
  List<dynamic> specialties = [];
  List<ServiceModel> services = [];
  List<ServiceModel> featuredServices = [];
  List<dynamic> quickActions = [];
  String? logoUrl;
  String? bannerUrl;
  
  bool isLoading = false;
  String? error;

  String fixImageUrl(String? url) {
    return ImageUtils.fixImageUrl(url);
  }

  List<dynamic> _extractList(dynamic data) {
    if (data is List) return data;
    if (data is Map && data.containsKey('content')) return data['content'] as List;
    return data == null ? [] : [data];
  }

  Future<void> fetchHomeData() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final startTime = DateTime.now();

      final responses = await Future.wait([
        _doctorService.getSpecialties(),
        _doctorService.getDoctors(),
        _dioClient.dio.get('/services/all', queryParameters: {'bookableOnly': true}),
        _dioClient.dio.get('/services/featured', queryParameters: {'bookableOnly': true}),
        _dioClient.dio.get('/public/quick-actions'),
        _dioClient.dio.get('/static/logo'),
        _dioClient.dio.get('/static/banner'),
      ]);

      specialties = responses[0] as List<dynamic>;
      doctors = (responses[1] as List<dynamic>)
              .map((json) => DoctorModel.fromJson(json))
              .toList();
      services = _extractList((responses[2] as Response).data['data'])
              .map((json) => ServiceModel.fromJson(json))
              .where((s) => isPatientBookableService(s.serviceType))
              .toList();
      featuredServices = _extractList((responses[3] as Response).data['data'])
              .map((json) => ServiceModel.fromJson(json))
              .where((s) => s.effectivePrice > 0 && isPatientBookableService(s.serviceType))
              .toList();
      if (featuredServices.isEmpty) {
        featuredServices = services.where((s) => s.effectivePrice > 0).take(8).toList();
      }
      quickActions = _extractList((responses[4] as Response).data['data']);
      logoUrl = (responses[5] as Response).data['data']?['logoUrl'];
      bannerUrl = (responses[6] as Response).data['data']?['bannerUrl'];

      // Lazy Shimmer logic: Ensure at least 300ms delay to prevent flickering
      final elapsedTime = DateTime.now().difference(startTime).inMilliseconds;
      if (elapsedTime < 300) {
        await Future.delayed(Duration(milliseconds: 300 - elapsedTime));
      }
    } on DioException catch (e) {
      error = e.message ?? 'An error occurred';
      print('DioError: ${e.response?.data}');
    } catch (e) {
      error = e.toString();
      print('Error: $e');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
