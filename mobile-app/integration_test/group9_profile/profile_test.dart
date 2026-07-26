import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:clinic_management_system/main.dart' as app;
import '../utils/test_utils.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Group 9: Profile Tests', () {
    testWidgets('Smoke Test: Mở màn hình Cá nhân / Cài đặt', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle(const Duration(seconds: 3));
      
      await ensureLoggedIn(tester);
      
      await tester.tap(find.text('Cá nhân').last);
      await tester.pumpAndSettle();
      
      expect(find.text('Cá nhân'), findsWidgets);
    });
  });
}
