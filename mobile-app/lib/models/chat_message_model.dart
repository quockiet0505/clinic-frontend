class ChatMessageModel {
  final int messageId;
  final int sessionId;
  final String senderType; // 'USER' or 'BOT'
  final String messageContent;
  final String createdAt;

  ChatMessageModel({
    required this.messageId,
    required this.sessionId,
    required this.senderType,
    required this.messageContent,
    required this.createdAt,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      messageId: json['messageId'] ?? 0,
      sessionId: json['sessionId'] ?? 0,
      senderType: json['senderType'] ?? (json['isUser'] == true ? 'USER' : 'BOT'),
      messageContent: json['messageContent'] ?? json['text'] ?? '',
      createdAt: json['createdAt'] ?? json['time'] ?? '',
    );
  }
  
  bool get isUser => senderType == 'USER';
}
