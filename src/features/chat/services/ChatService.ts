import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatApiClient } from '../../../shared/api/client';

interface ChatHistoryResponse {
  messages: ChatMessageResponse[];
  lastMessageId: string | null;
  hasMore: boolean;
  totalCount: number;
}

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
  messageType: MessageType;
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
  
  // 현재 구독 정보 저장
  private currentRoomId: string = '';
  private currentSubscriptions: any[] = [];

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
    // 이미 연결되어 있고 같은 채팅방이면 무시
    if (this.connected && this.currentRoomId === roomId) {
      console.log(`[ChatService] ⚠️ 이미 채팅방(${roomId})에 연결되어 있습니다.`);
      return;
    }
    
    // 다른 채팅방에 연결되어 있으면 먼저 해제
    if (this.connected && this.currentRoomId !== roomId) {
      console.log(`[ChatService] 🔄 채팅방 전환: ${this.currentRoomId} → ${roomId}`);
      this.disconnect();
      // 상태 초기화 후 바로 새 연결 진행 (재귀 호출 제거)
    }
    
    // STOMP 클라이언트가 남아있으면 정리
    if (this.stompClient && !this.connected) {
      console.log(`[ChatService] 🧹 기존 STOMP 클라이언트 정리`);
      this.stompClient = null;
    }
    
    // 환경변수에서 WebSocket URL 구성
    const websocketBaseUrl = process.env.EXPO_PUBLIC_WEBSOCKET_URL || 'http://43.203.55.49:8081';
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
    
    // 사용자 정보 및 현재 roomId 저장
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.currentStudentId = studentId;
    this.currentRoomId = roomId;
    
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
      
      // 채팅방 구독 (새 연결이므로 구독 해제 불필요)
      const subscriptionPath = `/topic/room/${roomId}`;
      console.log(`[ChatService] 🔔 채팅방 구독 시작 - roomId: ${roomId}, path: ${subscriptionPath}`);
      
      const roomSubscription = this.stompClient?.subscribe(subscriptionPath, (message) => {
        try {
          const chatMessage = JSON.parse(message.body) as ChatMessageResponse;
          console.log(`[ChatService] 📨 RAW 메시지 수신:`, {
            구독경로: subscriptionPath,
            현재연결룸: this.currentRoomId,
            메시지룸: chatMessage.roomId,
            발신자: chatMessage.senderName,
            내용: chatMessage.content,
            타입: chatMessage.messageType,
            일치여부: chatMessage.roomId === this.currentRoomId
          });
          
          // 현재 roomId와 메시지의 roomId가 일치하는 경우에만 처리
          if (chatMessage.roomId === this.currentRoomId && this.onMessageReceived) {
            console.log(`[ChatService] ✅ 메시지 처리 - roomId: ${this.currentRoomId}`);
            this.onMessageReceived(chatMessage);
          } else {
            console.log(`[ChatService] ⚠️ 다른 채팅방 메시지 무시 - 현재: ${this.currentRoomId}, 받은 메시지: ${chatMessage.roomId}`);
          }
        } catch (error) {
          console.error('[ChatService] Message parsing error:', error);
        }
      });
      
      if (roomSubscription) {
        this.currentSubscriptions.push(roomSubscription);
      }

      // 에러 큐 구독
      const errorSubscription = this.stompClient?.subscribe('/queue/errors', (error) => {
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
      
      if (errorSubscription) {
        this.currentSubscriptions.push(errorSubscription);
      }
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

    // 현재 연결된 채팅방과 일치하는지 확인
    if (this.currentRoomId !== roomId) {
      console.error(`[ChatService] ⚠️ 메시지 전송 거부 - 현재 채팅방: ${this.currentRoomId}, 요청 채팅방: ${roomId}`);
      return false;
    }

    try {
      const destination = `/app/chat/${roomId}`;
      const messageBody = {
        roomId: roomId,
        content: content,
        messageType: messageType
      };
      
      console.log('🔍 메시지 전송 상세:', {
        현재연결룸: this.currentRoomId, 
        전송대상룸: roomId, 
        전송경로: destination,
        메시지내용: content, 
        메시지타입: messageType,
        발신자: this.currentUserName,
        메시지바디: messageBody
      });
      
      // 사용자 정보 헤더 구성
      const headers: { [key: string]: string } = {
        'X-User-Id': this.currentUserId,
        'X-Student-Id': this.currentStudentId,
        'X-User-Name': this.currentUserName
      };

      this.stompClient.publish({
        destination: destination,
        headers: headers,
        body: JSON.stringify(messageBody)
      });
      console.log(`[ChatService] ✅ 메시지 전송 완료 - destination: ${destination}`);
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

    // 현재 연결된 채팅방과 일치하는지 확인
    if (this.currentRoomId !== roomId) {
      console.error(`[ChatService] ⚠️ 카페테리아 정보 요청 거부 - 현재 채팅방: ${this.currentRoomId}, 요청 채팅방: ${roomId}`);
      return false;
    }

    try {
      console.log(`[ChatService] 🍽️ 카페테리아 정보 요청 - ${roomId}`);
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

    // 현재 연결된 채팅방과 일치하는지 확인
    if (this.currentRoomId !== roomId) {
      console.error(`[ChatService] ⚠️ AI 질문 전송 거부 - 현재 채팅방: ${this.currentRoomId}, 요청 채팅방: ${roomId}`);
      return false;
    }

    try {
      console.log('🤖 AI 질문 전송:', { 
        currentRoom: this.currentRoomId,
        targetRoom: roomId, 
        question 
      });
      
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
      console.log(`[ChatService] ✅ AI 질문 전송 완료 - ${roomId}`);
      return true;
    } catch (error) {
      console.error('[ChatService] Error sending AI question:', error);
      return false;
    }
  }

  // 모든 구독 해제
  private unsubscribeAll() {
    if (this.currentSubscriptions.length > 0) {
      console.log(`[ChatService] 🔌 구독 해제 시작:`, {
        구독개수: this.currentSubscriptions.length,
        현재룸: this.currentRoomId,
        구독목록: this.currentSubscriptions.map((sub, index) => `구독${index + 1}`)
      });
      
      this.currentSubscriptions.forEach((subscription, index) => {
        if (subscription && subscription.unsubscribe) {
          try {
            subscription.unsubscribe();
            console.log(`[ChatService] ✅ 구독${index + 1} 해제 완료`);
          } catch (error) {
            console.error(`[ChatService] ❌ 구독${index + 1} 해제 실패:`, error);
          }
        }
      });
      this.currentSubscriptions = [];
      console.log(`[ChatService] ✅ 모든 구독 해제 완료`);
    } else {
      console.log(`[ChatService] 🔍 해제할 구독 없음`);
    }
  }


  disconnect() {
    if (!this.connected && !this.stompClient) {
      console.log('[ChatService] 🔍 이미 연결 해제 상태');
      return;
    }

    console.log('[ChatService] 🔌 연결 해제 시작');
    
    // 구독 해제
    this.unsubscribeAll();
    
    // STOMP 클라이언트 비활성화
    if (this.stompClient) {
      try {
        if (this.stompClient.active) {
          this.stompClient.deactivate();
          console.log('[ChatService] ✅ STOMP 클라이언트 비활성화 완료');
        } else {
          console.log('[ChatService] 🔍 STOMP 클라이언트 이미 비활성화됨');
        }
      } catch (error) {
        console.error('[ChatService] STOMP 클라이언트 비활성화 오류:', error);
      }
      this.stompClient = null;
    }
    
    // 상태 초기화 (콜백은 유지)
    this.connected = false;
    this.currentRoomId = '';
    
    console.log('[ChatService] ✅ 연결 해제 완료');
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

  async fetchChatHistory(roomId: string, userId: string, limit: number = 50): Promise<ChatHistoryResponse | null> {
    try {
      console.log('🔍 채팅 히스토리 요청:', {
        roomId,
        userId,
        limit,
        url: `/chat/rooms/${roomId}/messages?limit=${limit}`,
        baseUrl: process.env.EXPO_PUBLIC_CHAT_API_URL
      });

      const response = await chatApiClient.get<ChatHistoryResponse>(`/chat/rooms/${roomId}/messages?limit=${limit}`, {
        headers: {
          'X-User-Id': userId
        }
      });

      console.log(`🔍 채팅 히스토리 응답 - roomId: ${roomId}, 메시지 개수: ${response.data?.messages?.length || 0}`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch chat history');
      }

      return response.data || null;
    } catch (error) {
      console.error('[ChatService] Error fetching chat history:', error);
      if (error instanceof Error) {
        console.error('[ChatService] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  async fetchChatHistoryBefore(
    roomId: string, 
    userId: string, 
    beforeMessageId: string, 
    limit: number = 50
  ): Promise<ChatHistoryResponse | null> {
    try {
      const response = await chatApiClient.get<ChatHistoryResponse>(
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

      return response.data || null;
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