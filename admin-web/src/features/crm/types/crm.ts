export interface AppNotification {
     notification_id: number;
     account_id?: number;
     account_name?: string; // Joined từ account/patient
     type: 'EMAIL' | 'SYSTEM';
     content: string;
     sent_at: string;
   }
   
   export interface Feedback {
     feedback_id: number;
     record_id: number;
     patient_name: string; // Joined
     doctor_name: string;  // Joined
     rating: number; // 1 to 5
     comment: string;
     created_at: string;
   }
   
   export interface ChatMessage {
     message_id: number;
     session_id: number;
     sender_type: 'USER' | 'BOT';
     message_content: string;
     created_at: string;
   }
   
   export interface ChatSession {
     session_id: number;
     patient_id?: number;
     patient_name?: string; // Joined, có thể là 'Guest' nếu patient_id NULL
     started_at: string;
     ended_at?: string;
     message_count?: number;
     messages?: ChatMessage[];
   }