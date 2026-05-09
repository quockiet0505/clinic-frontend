// --- lib/app_exports.dart ---

// Flutter Material & Google Fonts
export 'package:flutter/material.dart';
export 'package:google_fonts/google_fonts.dart';

// Core constants & Theme
export 'package:clinic_management_system/core/core.dart';

// Routes
export 'package:clinic_management_system/routes/app_routes.dart';

// Models
export 'package:clinic_management_system/models/user_model.dart';
export 'package:clinic_management_system/models/doctor_model.dart';

// Utils & Mock Data (FIXED: Added this line to resolve the MockData error)
export 'package:clinic_management_system/utils/mock_data.dart';

// Common Widgets
export 'package:clinic_management_system/widgets/common/custom_button.dart';
export 'package:clinic_management_system/widgets/common/custom_textfield.dart';
export 'package:clinic_management_system/widgets/common/social_button.dart';

// Main Screens (Auth & Home)
export 'package:clinic_management_system/screens/auth/login_screen.dart';
export 'package:clinic_management_system/screens/auth/register_screen.dart';
export 'package:clinic_management_system/screens/main_screen.dart';
export 'package:clinic_management_system/screens/home/home_screen.dart';

// Appointment Screens 
export 'package:clinic_management_system/screens/appointment/appointment_screen.dart';
export 'package:clinic_management_system/screens/appointment/select_doctor_screen.dart';
export 'package:clinic_management_system/screens/appointment/select_time_screen.dart';
export 'package:clinic_management_system/screens/appointment/confirm_booking_screen.dart'; 