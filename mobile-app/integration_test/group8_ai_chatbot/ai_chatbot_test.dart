import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:clinic_management_system/main.dart' as app;
import '../utils/test_utils.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Group 8: AI Chatbot Tests', () {
    testWidgets('Smoke Test: Mở màn hình AI Chatbot', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle(const Duration(seconds: 3));
      
      await ensureLoggedIn(tester);
      
      await tester.tap(find.text('AI Chat').last);
      await tester.pumpAndSettle();
      
      expect(find.text('AI Chat'), findsWidgets);
    });
  });
}
