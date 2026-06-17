export interface Feedback {
  feedbackId: number;
  recordId: number;
  patientName: string;
  doctorName?: string; // chỉ có ở doctor_review
  rating: number;
  comment: string;
  createdAt: string;
  type: 'CLINIC' | 'DOCTOR';
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
}

export interface AppNotification {
  notificationId: number;
  accountId?: number;
  accountName?: string;
  type: 'EMAIL' | 'SYSTEM';
  content: string;
  sentAt: string;
}

export interface ChatMessage {
  messageId: number;
  sessionId: number;
  senderType: 'USER' | 'BOT';
  messageContent: string;
  createdAt: string;
}

export interface ChatSession {
  sessionId: number;
  patientId?: number;
  patientName?: string;
  startedAt: string;
  endedAt?: string;
  messageCount?: number;
  messages?: ChatMessage[];
}