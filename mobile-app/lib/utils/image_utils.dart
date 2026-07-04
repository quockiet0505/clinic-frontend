import 'package:flutter_dotenv/flutter_dotenv.dart';

class ImageUtils {
  static String fixImageUrl(String? url) {
    if (url == null || url.isEmpty) return 'https://ui-avatars.com/api/?name=N/A&background=random&format=png';
    if (url.startsWith('http')) {
      if (url.contains('ui-avatars.com') && !url.contains('format=png')) {
        return '$url&format=png';
      }
      return url;
    }
    
    final isLocal = dotenv.env['USE_LOCAL_API'] == 'true';
    final baseUrl = isLocal 
        ? (dotenv.env['LOCAL_STATIC_BASE_URL'] ?? 'http://10.0.2.2:8080')
        : (dotenv.env['PROD_STATIC_BASE_URL'] ?? 'http://api.duongquockiet.id.vn');
        
    return '$baseUrl$url';
  }
}
