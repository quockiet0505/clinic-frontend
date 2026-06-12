import 'package:intl/intl.dart';

class CurrencyFormatter {
  static String formatVND(double amount) {
    final format = NumberFormat.currency(locale: 'vi_VN', symbol: 'VND');
    return format.format(amount);
  }
}
