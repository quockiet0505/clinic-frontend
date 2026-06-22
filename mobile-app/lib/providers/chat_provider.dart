import 'package:flutter/material.dart';
import '../models/chat_message_model.dart';
import '../services/ai_chat_service.dart';

class ChatProvider extends ChangeNotifier {
  final AiChatService _aiChatService = AiChatService();

  List<ChatMessageModel> messages = [
    ChatMessageModel(
      messageId: 0,
      sessionId: 0,
      senderType: 'BOT',
      messageContent: 'Xin chào! Tôi là trợ lý y tế ảo ClinicPro. Tôi có thể giúp gì cho bạn?',
      createdAt: DateTime.now().toIso8601String(),
    )
  ];

  bool isLoading = false;
  String? error;

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty || isLoading) return;

    messages.add(
      ChatMessageModel(
        messageId: messages.length + 1,
        sessionId: 0,
        senderType: 'USER',
        messageContent: text.trim(),
        createdAt: DateTime.now().toIso8601String(),
      ),
    );
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final reply = await _aiChatService.sendMessage(text.trim());
      messages.add(
        ChatMessageModel(
          messageId: messages.length + 1,
          sessionId: 0,
          senderType: 'BOT',
          messageContent: reply,
          createdAt: DateTime.now().toIso8601String(),
        ),
      );
    } catch (e) {
      error = e.toString();
      messages.add(
        ChatMessageModel(
          messageId: messages.length + 1,
          sessionId: 0,
          senderType: 'BOT',
          messageContent:
              'Không thể kết nối tới trợ lý AI. Vui lòng kiểm tra AI service (port 8000) và thử lại.',
          createdAt: DateTime.now().toIso8601String(),
        ),
      );
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void clearMessages() {
    messages = [
      ChatMessageModel(
        messageId: 0,
        sessionId: 0,
        senderType: 'BOT',
        messageContent: 'Xin chào! Tôi là trợ lý y tế ảo ClinicPro. Tôi có thể giúp gì cho bạn?',
        createdAt: DateTime.now().toIso8601String(),
      ),
    ];
    notifyListeners();
  }
}
