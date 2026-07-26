import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Future<void> pumpUntilFound(
  WidgetTester tester,
  Finder finder, {
  Duration timeout = const Duration(seconds: 15),
}) async {
  bool timerDone = false;
  final timer = Timer(timeout, () => timerDone = true);
  while (timerDone != true) {
    await tester.pump(const Duration(milliseconds: 200));
    final found = tester.any(finder);
    if (found) {
      timerDone = true;
    }
  }
  timer.cancel();
}

Future<void> ensureLoggedIn(WidgetTester tester) async {
  // Cố gắng đợi Splash screen biến mất
  await pumpUntilFound(
      tester, 
      find.byWidgetPredicate((w) => w is Text && (w.data == 'Chào mừng trở lại!' || w.data == 'Trang chủ')),
  );

  final textFields = find.byType(TextField);
  
  // Nếu có TextField, nghĩa là đang ở Login Screen
  if (textFields.evaluate().isNotEmpty) {
    // Nhập Email
    await tester.enterText(textFields.at(0), 'patient1@clinic.com');
    await tester.pumpAndSettle();

    // Nhập Mật khẩu
    await tester.enterText(textFields.at(1), '12345678');
    await tester.pumpAndSettle();

    // Bấm Đăng nhập
    final loginButton = find.text('Đăng nhập');
    await tester.tap(loginButton);
  }

  // Đợi MainScreen hiển thị
  await pumpUntilFound(tester, find.text('Trang chủ'), timeout: const Duration(seconds: 20));

  if (!tester.any(find.text('Trang chủ'))) {
    final allTextWidgets = tester.widgetList<Text>(find.byType(Text));
    final strings = allTextWidgets.map((t) => t.data).toList();
    fail('Không tìm thấy Trang chủ. Các text hiện có trên màn hình: $strings');
  }
}
