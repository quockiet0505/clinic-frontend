import 'package:intl/intl.dart';

class DateFormatter {
  static String formatDate(dynamic dateString) {
    if (dateString == null) return '';
    try {
      DateTime date;
      if (dateString is DateTime) {
        date = dateString;
      } else {
        date = DateTime.parse(dateString.toString());
      }
      return DateFormat('dd/MM/yyyy').format(date);
    } catch (e) {
      return dateString.toString();
    }
  }

  static String formatDateTime(dynamic dateString) {
    if (dateString == null) return '';
    try {
      DateTime date;
      if (dateString is DateTime) {
        date = dateString;
      } else {
        date = DateTime.parse(dateString.toString());
      }
      return DateFormat('HH:mm - dd/MM/yyyy').format(date);
    } catch (e) {
      return dateString.toString();
    }
  }

  static String formatTime(dynamic timeString) {
    if (timeString == null) return '';
    try {
      // Handles HH:mm:ss or similar formats
      if (timeString is String && timeString.length >= 5) {
        return timeString.substring(0, 5);
      }
      return timeString.toString();
    } catch (e) {
      return timeString.toString();
    }
  }
}
