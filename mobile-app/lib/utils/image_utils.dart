class ImageUtils {
  static String fixImageUrl(String? url) {
    if (url == null || url.isEmpty) return 'https://via.placeholder.com/150';
    if (url.startsWith('http')) return url;
    // In emulator, localhost is 10.0.2.2
    return 'http://10.0.2.2:8080$url';
  }
}
