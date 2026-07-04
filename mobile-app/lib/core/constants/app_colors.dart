// --- lib/core/constants/app_colors.dart ---
import 'package:flutter/material.dart';

class AppColors {
  // Global Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF0284C7), Color(0xFF38BDF8)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Primary & Accent Colors (Modern Medical Theme)
  static const Color primary = Color(0xFF2563EB); // Medical Blue
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color secondary = Color(0xFF0F766E); // Deep Teal
  static const Color accentMint = Color(0xFFD1FAE5); // Soft Mint
  static const Color accentBlue = Color(0xFFEFF6FF); // Soft Blue

  // Background Colors
  static const Color bgLight = Color(0xFFF8FAFC); // Slate Gray nhạt
  static const Color bgDark = Color(0xFF0F172A);
  static const Color cardLight = Color(0xFFFFFFFF); // Pure White
  static const Color cardDark = Color(0xFF1E293B);

  // Text Colors
  static const Color textMainLight = Color(0xFF0F172A); // Slate 900
  static const Color textSubLight = Color(0xFF64748B); // Slate 500
  static const Color textMainDark = Color(0xFFF8FAFC);
  static const Color textSubDark = Color(0xFF94A3B8);

  // Status Colors
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
}