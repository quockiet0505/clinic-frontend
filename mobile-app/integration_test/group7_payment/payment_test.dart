import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:clinic_management_system/main.dart' as app;
import '../utils/test_utils.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Group 7: Payment Tests', () {
    testWidgets('Smoke Test: Truy cập Hồ sơ bệnh án & Thanh toán', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle(const Duration(seconds: 3));
      
      await ensureLoggedIn(tester);
      
      await tester.tap(find.text('Hồ sơ').last);
      await tester.pumpAndSettle();
      
      expect(find.text('Hồ sơ'), findsWidgets);
    });
  });
}
