import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:clinic_management_system/main.dart' as app;
import '../utils/test_utils.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Group 1: Auth Tests', () {
    testWidgets('Smoke Test: Đăng nhập thành công', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle(const Duration(seconds: 3));
      
      await ensureLoggedIn(tester);
      expect(find.text('Trang chủ'), findsWidgets);
    });
  });
}
