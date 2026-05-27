import type { ChatMessage } from '../types/chatbot';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const chatbotApi = {
  sendMessage: async (message: string): Promise<ChatMessage> => {
    // Delay rất ngắn để tạo cảm giác tự nhiên như đang chat
    await new Promise(resolve => setTimeout(resolve, 600));

    const lowerMsg = message.toLowerCase();
    let replyText = "Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể nói rõ hơn về triệu chứng hoặc dịch vụ bạn đang tìm kiếm không?";

    if (lowerMsg.includes('đau đầu') || lowerMsg.includes('chóng mặt')) {
      replyText = "Triệu chứng đau đầu và chóng mặt có thể liên quan đến khoa Nội Thần Kinh hoặc Tim Mạch. Bạn có muốn tôi hướng dẫn đặt lịch khám với BS. Trần Thị Mây không?";
    } else if (lowerMsg.includes('giá') || lowerMsg.includes('chi phí')) {
      replyText = "Chi phí khám dịch vụ thường tại ClinicPro là 200.000đ, và khám chuyên gia VIP là 500.000đ ạ. Chi phí xét nghiệm sẽ được báo chi tiết khi bác sĩ chỉ định.";
    } else if (lowerMsg.includes('xin chào') || lowerMsg.includes('hi')) {
      replyText = "Chào bạn! Tôi là Trợ lý AI của ClinicPro. Tôi có thể giúp bạn tra cứu chuyên khoa, tìm bác sĩ hoặc hướng dẫn đặt lịch khám.";
    }

    return {
      id: generateId(),
      text: replyText,
      sender: 'AI',
      timestamp: new Date()
    };
  }
};