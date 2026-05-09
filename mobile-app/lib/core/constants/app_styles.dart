// --- lib/core/constants/app_styles.dart ---
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppStyles {
  static final TextStyle _baseStyle = GoogleFonts.poppins();

  static final TextStyle heading1 = _baseStyle.copyWith(fontSize: 28, fontWeight: FontWeight.bold, height: 1.3);
  static final TextStyle heading2 = _baseStyle.copyWith(fontSize: 24, fontWeight: FontWeight.bold);
  static final TextStyle heading3 = _baseStyle.copyWith(fontSize: 18, fontWeight: FontWeight.w600);
  
  static final TextStyle bodyLarge = _baseStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w500);
  static final TextStyle bodyMedium = _baseStyle.copyWith(fontSize: 14, fontWeight: FontWeight.normal);
  static final TextStyle caption = _baseStyle.copyWith(fontSize: 12, fontWeight: FontWeight.normal);
  
  static final TextStyle buttonText = _baseStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white);
}