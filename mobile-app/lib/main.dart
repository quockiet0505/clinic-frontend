// --- lib/main.dart ---
import 'package:clinic_management_system/app_exports.dart';

void main() {
  runApp(const ClinicApp());
}

class ClinicApp extends StatelessWidget {
  const ClinicApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ClinicCare',
      debugShowCheckedModeBanner: false,
      home: const LoginScreen(), 
    );
  }
}