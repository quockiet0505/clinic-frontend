import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:clinic_management_system/app_exports.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:clinic_management_system/providers/home_provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/providers/auth_provider.dart';
import 'package:clinic_management_system/providers/record_provider.dart';
import 'package:clinic_management_system/providers/chat_provider.dart';
import 'package:clinic_management_system/services/notification_service.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();
  await dotenv.load(fileName: ".env");

  // Initialize Firebase
  await Firebase.initializeApp();

  await Hive.initFlutter();
  await Hive.openBox('appCache');

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('vi'), Locale('en')],
      path: 'assets/translations',
      fallbackLocale: const Locale('vi'),
      child: MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => HomeProvider()),
          ChangeNotifierProvider(create: (_) => AppointmentProvider()),
          ChangeNotifierProvider(create: (_) => AuthProvider()),
          ChangeNotifierProvider(create: (_) => RecordProvider()),
          ChangeNotifierProvider(create: (_) => ChatProvider()),
        ],
        child: const ClinicApp(),
      ),
    ),
  );
}

class ClinicApp extends StatelessWidget {
  const ClinicApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ClinicCare',
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      debugShowCheckedModeBanner: false,
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _isLoading = true;
  bool _isAuthenticated = false;

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: 'jwt_token');

    if (token != null && token.isNotEmpty) {
      if (mounted) {
        // Tải trước thông tin user & toàn bộ dữ liệu trang chủ trong lúc hiện Splash
        await Future.wait([
          context.read<AuthProvider>().fetchProfile(),
          context.read<HomeProvider>().fetchHomeData(),
        ]);

        // Tải trước ảnh (precache) vào RAM để khi vào app hiện ra ngay lập tức
        if (mounted) {
          await _precacheHomeImages();
        }

        // Xin quyền và setup cấu hình Push Notification
        try {
          await NotificationService().setupFCM();
        } catch (e) {
          debugPrint('Error setting up FCM: $e');
        }
      }
    }

    // Đảm bảo Splash Screen hiện đủ lâu (1.2s) để hoàn tất hiệu ứng nhảy mượt mà
    await Future.delayed(const Duration(milliseconds: 1200));

    if (mounted) {
      setState(() {
        _isAuthenticated = token != null && token.isNotEmpty;
        _isLoading = false;
      });
    }
  }

  Future<void> _precacheHomeImages() async {
    try {
      final provider = context.read<HomeProvider>();
      final List<String> urls = [];

      if (provider.logoUrl != null)
        urls.add(provider.fixImageUrl(provider.logoUrl));
      for (var action in provider.quickActions) {
        if (action['iconUrl'] != null)
          urls.add(provider.fixImageUrl(action['iconUrl']));
      }
      for (var doc in provider.doctors.take(3)) {
        if (doc.imageUrl != null) urls.add(provider.fixImageUrl(doc.imageUrl));
      }
      for (var srv in provider.featuredServices.take(3)) {
        if (srv.imageUrl != null) urls.add(provider.fixImageUrl(srv.imageUrl));
      }

      final futures = urls
          .map((url) => precacheImage(
                CachedNetworkImageProvider(url, maxWidth: 400),
                context,
              ))
          .toList();

      // Chỉ chờ tối đa 2 giây cho việc tải ảnh nền để tránh kẹt Splash quá lâu
      await Future.wait(futures)
          .timeout(const Duration(seconds: 2), onTimeout: () => []);
    } catch (e) {
      // Bỏ qua lỗi precache
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const _SplashScreen();
    }

    if (_isAuthenticated) {
      return const MainScreen();
    } else {
      return const LoginScreen();
    }
  }
}

class _SplashScreen extends StatefulWidget {
  const _SplashScreen();

  @override
  State<_SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<_SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late AnimationController _loadingController;
  late Animation<double> _fadeAnim;
  late Animation<double> _scaleAnim;
  late Animation<double> _slideAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _fadeAnim = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _scaleAnim = Tween<double>(begin: 0.75, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _slideAnim = Tween<double>(begin: 24.0, end: 0.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFDBEAFE), // Blue-100 – khớp hoàn toàn GradientAppBar
              Color(0xFFF8FAFF), // Near-white
              Color(0xFFFFFFFF),
            ],
            stops: [0.0, 0.55, 1.0],
          ),
        ),
        child: Center(
          child: FadeTransition(
            opacity: _fadeAnim,
            child: ScaleTransition(
              scale: _scaleAnim,
              child: Image.asset(
                'assets/images/logo.png',
                height: 120, // Logo to rõ ràng
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
