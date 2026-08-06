class Validators {
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Vui lòng nhập email';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Email không hợp lệ';
    }
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Vui lòng nhập mật khẩu';
    }
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
  }

  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Vui lòng nhập số điện thoại';
    }
    if (value.length < 10 || value.length > 11) {
      return 'Số điện thoại không hợp lệ';
    }
    return null;
  }

  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return 'Vui lòng nhập $fieldName';
    }
    return null;
  }

  static String? validateHeight(String? value) {
    if (value == null || value.isEmpty) return null;
    final height = double.tryParse(value);
    if (height == null || height <= 0 || height > 300) {
      return 'Chiều cao không hợp lệ';
    }
    return null;
  }

  static String? validateWeight(String? value) {
    if (value == null || value.isEmpty) return null;
    final weight = double.tryParse(value);
    if (weight == null || weight <= 0 || weight > 500) {
      return 'Cân nặng không hợp lệ';
    }
    return null;
  }

  static String? validatePulse(String? value) {
    if (value == null || value.isEmpty) return null;
    final pulse = int.tryParse(value);
    if (pulse == null || pulse <= 0) {
      return 'Nhịp tim không hợp lệ';
    }
    return null;
  }

  static String? validateBloodPressure(String? value) {
    if (value == null || value.trim().isEmpty) return null;
    final bpRegex = RegExp(r'^\d{2,3}\/\d{2,3}$');
    if (!bpRegex.hasMatch(value.trim())) {
      return 'Huyết áp không hợp lệ (VD: 120/80)';
    }
    return null;
  }

  static String? validateDate(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Vui lòng nhập ngày';
    }
    try {
      final date = DateTime.parse(value);
      if (date.isAfter(DateTime.now())) {
        return 'Ngày không được ở tương lai';
      }
    } catch (e) {
      return 'Định dạng ngày không hợp lệ (YYYY-MM-DD)';
    }
    return null;
  }
}
