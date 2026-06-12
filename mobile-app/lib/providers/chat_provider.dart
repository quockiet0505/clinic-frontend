import 'package:flutter/material.dart';
import '../models/chat_message_model.dart';
import '../core/network/dio_client.dart';
import 'package:dio/dio.dart';

class ChatProvider extends ChangeNotifier {
  final DioClient _dioClient = DioClient();

  List<ChatMessageModel> messages = [
    ChatMessageModel(
      messageId: 0,
      sessionId: 0,
      senderType: 'BOT',
      messageContent: 'Xin chào! Tôi là trợ lý y tế ảo. Tôi có thể giúp gì cho bạn?',
      createdAt: DateTime.now().toIso8601String(),
    )
  ];
  
  bool isLoading = false;
  String? error;

  void sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    // Add user message
    messages.add(
      ChatMessageModel(
        messageId: messages.length + 1,
        sessionId: 0,
        senderType: 'USER',
        messageContent: text.trim(),
        createdAt: DateTime.now().toIso8601String(),
      )
    );
    notifyListeners();

    // Mock AI response for now
    await Future.delayed(const Duration(seconds: 1));
    
    messages.add(
      ChatMessageModel(
        messageId: messages.length + 1,
        sessionId: 0,
        senderType: 'BOT',
        messageContent: 'Đây là tính năng AI đang trong giai đoạn phát triển. Cảm ơn bạn đã phản hồi!',
        createdAt: DateTime.now().toIso8601String(),
      )
    );
    notifyListeners();
  }

  void clearMessages() {
    messages = [];
    notifyListeners();
  }
}
