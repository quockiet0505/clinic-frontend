export interface AppNotification {
     notificationId: number;
     accountId?: number;
     accountName?: string; // Joined từ account/patient
     type: 'EMAIL' | 'SYSTEM';
     content: string;
     sentAt: string;
   }
   
   export interface Feedback {
     feedbackId: number;
     recordId: number;
     patientName: string; // Joined
     doctorName: string;  // Joined
     rating: number; // 1 to 5
     comment: string;
     createdAt: string;
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
     patientName?: string; // Joined, có thể là 'Guest' nếu patientId NULL
     startedAt: string;
     endedAt?: string;
     messageCount?: number;
     messages?: ChatMessage[];
   }