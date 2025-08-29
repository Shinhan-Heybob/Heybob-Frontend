import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatApiClient } from '../../../shared/api/client';

export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  PAYMENT_REQUEST = 'PAYMENT_REQUEST',
  PAYMENT_COMPLETE = 'PAYMENT_COMPLETE',
  SAVINGS_REQUEST = 'SAVINGS_REQUEST',
  SAVINGS_COMPLETE = 'SAVINGS_COMPLETE',
  CAFETERIA_INFO = 'CAFETERIA_INFO',
  AI_BOT_REQUEST = 'AI_BOT_REQUEST',
  AI_BOT_RESPONSE = 'AI_BOT_RESPONSE'
}

export interface ChatMessageRequest {
  content: string;
  messageType: MessageType;
}

export interface PaymentRequestData {
  settlementId: string;
  roomId: string;
  requesterId?: number;
  requesterName: string;
  requesterStudentId?: string;
  requesterProfileImg?: string;
  requestAmount: number;
  settlementUrl: string;
}

export interface PaymentCompleteData {
  settlementId: string;
  roomId: string;
  recipientId: string;
  recipientName: string;
  completedAmount: number;
}

export interface ChatMessageResponse {
  messageId: string;
  roomId: string;
  senderId: string;
  studentId: string;
  senderName: string;
  profileImageUrl?: string;
  content: string;
  messageType: string;
  timestamp: string;
  paymentRequestData?: PaymentRequestData;
  paymentCompleteData?: PaymentCompleteData;
}

class ChatService {
  private stompClient: Client | null = null;
  private connected = false;
  private onMessageReceived: ((message: ChatMessageResponse) => void) | null = null;
  private onErrorReceived: ((error: any) => void) | null = null;
  
  // 현재 사용자 정보 저장
  private currentUserId: string = '';
  private currentUserName: string = '';
  private currentStudentId: string = '';

  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(
    userId: string,
    userName: string,
    studentId: string,
    roomId: string,
    serverUrl: string = __DEV__ ? 'http://70.12.246.239:8081/ws' : 'http://localhost:8081/ws',
    profileImageUrl: string = ''
  ) {
    console.log('🔍 ChatService connect 파라미터:', {
      userId,
      userName,
      studentId,
      roomId,
      serverUrl,
      profileImageUrl
    });
    
    // 사용자 정보 저장
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.currentStudentId = studentId;
    
    // 연결 헤더에 사용자 정보 포함 (선택사항)
    const connectHeaders = {
      'X-User-Id': userId,
      'X-Student-Id': studentId,
      'X-User-Name': userName,
      ...(profileImageUrl && { 'X-Profile-Image': profileImageUrl })
    };
    
    console.log('🔍 ChatService 연결 URL:', serverUrl);
    console.log('🔍 ChatService 연결 헤더:', connectHeaders);
    
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(serverUrl),
      connectHeaders,
      debug: (str) => console.log('[ChatService]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 10000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('[ChatService] ✅ STOMP Connected successfully:', frame);
      this.connected = true;

      // 채팅방 구독
      this.stompClient?.subscribe(`/topic/room/${roomId}`, (message) => {
        try {
          const chatMessage = JSON.parse(message.body) as ChatMessageResponse;
          console.log('[ChatService] Message received:', chatMessage);
          if (this.onMessageReceived) {
            this.onMessageReceived(chatMessage);
          }
        } catch (error) {
          console.error('[ChatService] Message parsing error:', error);
        }
      });

      // 에러 큐 구독
      this.stompClient?.subscribe('/queue/errors', (error) => {
        try {
          const errorMessage = JSON.parse(error.body);
          console.log('[ChatService] Error received:', errorMessage);
          if (this.onErrorReceived) {
            this.onErrorReceived(errorMessage);
          }
        } catch (err) {
          console.error('[ChatService] Error parsing error message:', err);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('[ChatService] STOMP Error - Header:', frame.headers['message']);
      console.error('[ChatService] STOMP Error - Body:', frame.body);
      console.error('[ChatService] STOMP Error - Full frame:', frame);
      this.connected = false;
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('[ChatService] Disconnected from chat server:', frame);
      this.connected = false;
    };

    this.stompClient.onWebSocketClose = (event) => {
      console.log('[ChatService] WebSocket closed:', event);
      if (event.code !== 1000) {
        console.error('[ChatService] 비정상적 연결 종료 - Code:', event.code, 'Reason:', event.reason);
      }
      this.connected = false;
    };

    this.stompClient.onWebSocketError = (event) => {
      console.error('[ChatService] WebSocket error:', event);
      this.connected = false;
    };

    // 연결 상태 변화 로깅 추가
    this.stompClient.beforeConnect = () => {
      console.log('[ChatService] 🔄 Attempting STOMP connection...');
    };

    this.stompClient.activate();
  }

  sendMessage(roomId: string, content: string, messageType: MessageType = MessageType.CHAT) {
    if (!this.connected || !this.stompClient) {
      console.error('[ChatService] Not connected to chat server');
      return false;
    }

    try {
      console.log('🔍 메시지 전송:', { roomId, content, messageType });
      
      this.stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          roomId: roomId,
          content: content,
          messageType: messageType
        })
      });
      return true;
    } catch (error) {
      console.error('[ChatService] Error sending message:', error);
      return false;
    }
  }

  getCafeteriaInfo(roomId: string) {
    if (!this.connected || !this.stompClient) {
      console.error('[ChatService] Not connected to chat server');
      return false;
    }

    try {
      this.stompClient.publish({
        destination: `/app/chat/${roomId}/cafeteria`
      });
      return true;
    } catch (error) {
      console.error('[ChatService] Error requesting cafeteria info:', error);
      return false;
    }
  }

  sendAiQuestion(roomId: string, question: string) {
    if (!this.connected || !this.stompClient) {
      console.error('[ChatService] Not connected to chat server');
      return false;
    }

    try {
      console.log('🤖 AI 질문 전송:', { roomId, question });
      
      this.stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          roomId: roomId,
          content: question,
          messageType: MessageType.AI_BOT_REQUEST
        })
      });
      return true;
    } catch (error) {
      console.error('[ChatService] Error sending AI question:', error);
      return false;
    }
  }

  disconnect() {
    if (this.stompClient) {
      console.log('[ChatService] Disconnecting from chat server');
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  setOnMessageReceived(callback: (message: ChatMessageResponse) => void) {
    this.onMessageReceived = callback;
  }

  setOnErrorReceived(callback: (error: any) => void) {
    this.onErrorReceived = callback;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async fetchChatHistory(roomId: string, userId: string, limit: number = 50) {
    try {
      const response = await chatApiClient.get(`/chat/rooms/${roomId}/messages?limit=${limit}`, {
        headers: {
          'X-User-Id': userId
        }
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch chat history');
      }

      return response.data;
    } catch (error) {
      console.error('[ChatService] Error fetching chat history:', error);
      throw error;
    }
  }

  async fetchChatHistoryBefore(
    roomId: string, 
    userId: string, 
    beforeMessageId: string, 
    limit: number = 50
  ) {
    try {
      const response = await chatApiClient.get(
        `/chat/rooms/${roomId}/messages?before=${beforeMessageId}&limit=${limit}`,
        {
          headers: {
            'X-User-Id': userId
          }
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch chat history before');
      }

      return response.data;
    } catch (error) {
      console.error('[ChatService] Error fetching chat history before:', error);
      throw error;
    }
  }

  async fetchRoomInfo(roomId: string, userId: string) {
    try {
      const response = await chatApiClient.get(`/rooms/${roomId}`, {
        headers: {
          'X-User-Id': userId
        }
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch room info');
      }

      return response.data;
    } catch (error) {
      console.error('[ChatService] Error fetching room info:', error);
      throw error;
    }
  }
}

export const ERROR_CODES = {
  ROOM_NOT_FOUND: '채팅방을 찾을 수 없습니다',
  MESSAGE_NOT_FOUND: '메시지를 찾을 수 없습니다',
  UNAUTHORIZED: '권한이 없습니다',
  MESSAGE_SAVE_FAILED: '메시지 저장에 실패했습니다',
  INVALID_REQUEST: '잘못된 요청입니다',
  INTERNAL_SERVER_ERROR: '서버 오류가 발생했습니다'
};

export default new ChatService();