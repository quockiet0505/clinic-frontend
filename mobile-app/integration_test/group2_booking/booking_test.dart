import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:clinic_management_system/main.dart' as app;
import '../utils/test_utils.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Group 2: Booking Tests', () {
    testWidgets('Smoke Test: Tab Lịch khám', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle(const Duration(seconds: 3));
      
      await ensureLoggedIn(tester);
      
      await tester.tap(find.text('Lịch khám').last);
      await pumpUntilFound(tester, find.text('Lịch hẹn sắp tới'));
      
      expect(find.text('Lịch khám'), findsWidgets);
    });
  });
}
