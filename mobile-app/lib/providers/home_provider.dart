import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../core/network/dio_client.dart';
import 'package:dio/dio.dart';

class HomeProvider extends ChangeNotifier {
  final DioClient _dioClient = DioClient();

  List<dynamic> doctors = [];
  List<dynamic> specialties = [];
  List<dynamic> services = [];
  List<dynamic> quickActions = [];
  String? logoUrl;
  String? bannerUrl;
  
  bool isLoading = false;
  String? error;

  String fixImageUrl(String? url) {
    if (url == null || url.isEmpty) return 'https://via.placeholder.com/150';
    
    // If the URL is already absolute, return it (replace localhost if any)
    if (url.startsWith('http')) {
      if (url.contains('localhost')) {
        final baseUrl = dotenv.env['STATIC_BASE_URL'] ?? 'http://10.0.2.2:8080';
        final uri = Uri.parse(baseUrl);
        return url.replaceAll('localhost', uri.host);
      }
      return url;
    }
    
    // Prepend STATIC_BASE_URL
    final staticUrl = dotenv.env['STATIC_BASE_URL'] ?? 'http://10.0.2.2:8080';
    return '$staticUrl${url.startsWith('/') ? '' : '/'}$url';
  }

  Future<void> fetchHomeData() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final startTime = DateTime.now();

      final responses = await Future.wait<Response>([
        _dioClient.dio.get('/expertise'),
        _dioClient.dio.get('/staffs/doctors'),
        _dioClient.dio.get('/services'),
        _dioClient.dio.get('/static/quick-actions'),
        _dioClient.dio.get('/static/logo'),
        _dioClient.dio.get('/static/banner'),
      ]);

      specialties = responses[0].data['data'] ?? [];
      doctors = responses[1].data['data'] ?? [];
      services = responses[2].data['data'] ?? [];
      quickActions = responses[3].data['data'] ?? [];
      logoUrl = responses[4].data['data']?['logoUrl'];
      bannerUrl = responses[5].data['data']?['bannerUrl'];

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
