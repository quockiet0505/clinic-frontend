import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:clinic_management_system/app_exports.dart';
import '../core/network/dio_client.dart';
import 'package:dio/dio.dart';
import '../utils/image_utils.dart';

import '../models/doctor_model.dart';
import '../models/service_model.dart';
import '../services/doctor_service.dart';

class HomeProvider extends ChangeNotifier {
  final DioClient _dioClient = DioClient();
  final DoctorService _doctorService = DoctorService();

  List<DoctorModel> doctors = [];
  List<dynamic> specialties = [];
  List<ServiceModel> services = [];
  List<dynamic> quickActions = [];
  String? logoUrl;
  String? bannerUrl;
  
  bool isLoading = false;
  String? error;

  String fixImageUrl(String? url) {
    return ImageUtils.fixImageUrl(url);
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
        _dioClient.dio.get('/services'),
        _dioClient.dio.get('/static/quick-actions'),
        _dioClient.dio.get('/static/logo'),
        _dioClient.dio.get('/static/banner'),
      ]);

      specialties = responses[0] as List<dynamic>;
      doctors = (responses[1] as List<dynamic>)
              .map((json) => DoctorModel.fromJson(json))
              .toList();
      services = ((responses[2] as Response).data['data'] as List?)
              ?.map((json) => ServiceModel.fromJson(json))
              .toList() ?? [];
      quickActions = (responses[3] as Response).data['data'] ?? [];
      logoUrl = (responses[4] as Response).data['data']?['logoUrl'];
      bannerUrl = (responses[5] as Response).data['data']?['bannerUrl'];

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
