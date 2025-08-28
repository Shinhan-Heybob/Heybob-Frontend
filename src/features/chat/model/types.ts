// 메시지 타입
export type MessageType = 
  | 'CHAT'              // 일반 채팅
  | 'JOIN'              // 입장 
  | 'LEAVE'             // 퇴장
  | 'PAYMENT_REQUEST'   // 결제 요청
  | 'PAYMENT_COMPLETE' // 결제 완료
  | 'SAVINGS_REQUEST'  // 적금 요청
  | 'SAVINGS_COMPLETE' // 적금 완료
  | 'CAFETERIA_INFO'   // 학식 정보
  | 'AI_BOT_REQUEST'   // AI 챗봇 질문
  | 'AI_BOT_RESPONSE'  // AI 챗봇 응답

// 결제 요청 데이터
export interface PaymentRequestData {
  settlementId: string;
  roomId: string;
  requesterName: string;
  requestAmount: number;
  settlementUrl: string;
}

// 결제 완료 데이터
export interface PaymentCompleteData {
  settlementId: string;
  roomId: string;
  recipientId: string;
  recipientName: string;
  completedAmount: number;
}

// 적금 요청 데이터
export interface SavingsRequestData {
  savingsId: string;
  roomId: string;
  requesterName: string;
  requestAmount: number;
  savingsUrl: string;
}

// 적금 완료 데이터
export interface SavingsCompleteData {
  savingsId: string;
  roomId: string;
  participantId: string;
  participantName: string;
  completedAmount: number;
}

// 메시지 인터페이스 (백엔드 응답)
export interface ChatMessage {
  messageId: string;
  roomId: string;
  senderId: string;
  studentId: string;
  senderName: string;
  profileImageUrl?: string;
  content: string;
  messageType: MessageType;
  timestamp: string;
  
  // 타입별 데이터
  paymentRequestData?: PaymentRequestData;
  paymentCompleteData?: PaymentCompleteData;
  savingsRequestData?: SavingsRequestData;
  savingsCompleteData?: SavingsCompleteData;
}

// 메시지 전송 요청 (백엔드로 보내는 데이터)
export interface SendMessageRequest {
  content?: string;
  messageType: MessageType;
  
  // 타입별 데이터 (공통 인터페이스 재사용)
  paymentRequestData?: PaymentRequestData;
  paymentCompleteData?: PaymentCompleteData;
  savingsRequestData?: SavingsRequestData;
  savingsCompleteData?: SavingsCompleteData;
}

// 메시지 전송 헤더 (WebSocket)
export interface MessageHeaders {
  'X-User-Id': string;
  'X-Student-Id': string;
  'X-User-Name': string;
  'X-Profile-Image'?: string;
}

// 채팅 히스토리 API 요청
export interface GetMessagesRequest {
  roomId: string;
  before?: string;  // 메시지 ID (키셋 커서)
  limit?: number;   // 기본값 20
}

// 채팅 히스토리 API 응답
export interface GetMessagesResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string;
}

// 현재 사용자 정보
export interface CurrentUser {
  userId: string;
  studentId: string;
  userName: string;
  profileImageUrl?: string;
}

// 채팅방 정보
export interface ChatRoom {
  roomId: string;
  title: string;
  participantCount: number;
  mealInfo?: {
    mealId: string;
    date: string;
    time: string;
    location: string;
  };
}

// WebSocket 연결 상태
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// 에러 타입
export interface ChatError {
  code: string;
  message: string;
}