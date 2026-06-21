class ImageUtils {
  static String fixImageUrl(String? url) {
    if (url == null || url.isEmpty) return 'https://ui-avatars.com/api/?name=N/A&background=random&format=png';
    if (url.startsWith('http')) {
      if (url.contains('ui-avatars.com') && !url.contains('format=png')) {
        return '$url&format=png';
      }
      // Replace localhost with 10.0.2.2 for Android emulator
      if (url.contains('localhost')) {
        return url.replaceAll('localhost', '10.0.2.2');
      }
      return url;
    }
    // In emulator, localhost is 10.0.2.2
    return 'http://10.0.2.2:8080$url';
  }
}
