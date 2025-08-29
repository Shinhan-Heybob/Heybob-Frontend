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
    serverUrl?: string,
    profileImageUrl: string = ''
  ) {
    // 환경변수에서 WebSocket URL 구성
    const websocketBaseUrl = process.env.EXPO_PUBLIC_WEBSOCKET_URL || 'http://172.18.135.1:8081';
    const finalServerUrl = serverUrl || `${websocketBaseUrl}/ws`;
    const host = websocketBaseUrl.replace('http://', '').replace('https://', '').replace('ws://', '').replace('wss://', '').split(':')[0];
    
    console.log('🔍 ChatService connect 파라미터:', {
      userId,
      userName,
      studentId,
      roomId,
      serverUrl: finalServerUrl,
      profileImageUrl,
      websocketBaseUrl,
      host
    });
    
    // 사용자 정보 저장
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.currentStudentId = studentId;
    
    // STOMP 표준 연결 헤더
    const connectHeaders = {
      'accept-version': '1.0,1.1,1.2',
      'heart-beat': '10000,10000',
      'host': host,
      'X-User-Id': userId,
      'X-Student-Id': studentId,
      'X-User-Name': userName,
      ...(profileImageUrl && { 'X-Profile-Image': profileImageUrl })
    };
    
    console.log('🔍 ChatService 연결 URL:', finalServerUrl);
    console.log('🔍 ChatService 연결 헤더:', connectHeaders);
    
    // @stomp/stompjs Client 생성 (서버 호환성 최적화)
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(finalServerUrl),
      connectHeaders,
      debug: (str) => console.log('[ChatService]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectionTimeout: 60000, // 60초로 증가
      // 서버 호환성을 위한 추가 설정
      splitLargeFrames: false,
      forceBinaryWSFrames: false,
      appendMissingNULLonIncoming: false,
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
      if (this.onErrorReceived) {
        this.onErrorReceived({ message: frame.headers['message'], body: frame.body });
      }
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

    // 연결 시작
    this.stompClient.activate();
  }

  sendMessage(roomId: string, content: string, messageType: MessageType = MessageType.CHAT) {
    if (!this.connected || !this.stompClient) {
      console.error('[ChatService] Not connected to chat server');
      return false;
    }

    try {
      console.log('🔍 메시지 전송:', { roomId, content, messageType });
      
      // 사용자 정보 헤더 구성
      const headers: { [key: string]: string } = {
        'X-User-Id': this.currentUserId,
        'X-Student-Id': this.currentStudentId,
        'X-User-Name': this.currentUserName
      };

      this.stompClient.publish({
        destination: `/app/chat/${roomId}`,
        headers: headers,
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
      
      // 사용자 정보 헤더 구성
      const headers: { [key: string]: string } = {
        'X-User-Id': this.currentUserId,
        'X-Student-Id': this.currentStudentId,
        'X-User-Name': this.currentUserName
      };
      
      this.stompClient.publish({
        destination: `/app/chat/${roomId}`,
        headers: headers,
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
      console.log('🔍 채팅 히스토리 요청:', {
        roomId,
        userId,
        limit,
        url: `/chat/rooms/${roomId}/messages?limit=${limit}`,
        baseUrl: process.env.EXPO_PUBLIC_CHAT_API_URL
      });

      const response = await chatApiClient.get(`/chat/rooms/${roomId}/messages?limit=${limit}`, {
        headers: {
          'X-User-Id': userId
        }
      });

      console.log('🔍 채팅 히스토리 응답:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch chat history');
      }

      return response.data;
    } catch (error) {
      console.error('[ChatService] Error fetching chat history:', error);
      console.error('[ChatService] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
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