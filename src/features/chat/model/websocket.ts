import { Client } from '@stomp/stompjs';
import type { ChatMessage, ConnectionStatus, CurrentUser, SendMessageRequest } from './types';

export class ChatWebSocketService {
  private client: Client | null = null;
  private currentRoomId: string | null = null;
  private currentUser: CurrentUser | null = null;
  private onMessageReceived: ((message: ChatMessage) => void) | null = null;
  private onConnectionStatusChanged: ((status: ConnectionStatus) => void) | null = null;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new (require('sockjs-client'))(__DEV__ ? 'http://70.12.246.239:8081/ws' : 'http://localhost:8081/ws'),
      connectHeaders: {},
      debug: (str) => {
        console.log('[STOMP Debug]:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 연결 성공
    this.client.onConnect = () => {
      console.log('[STOMP] Connected');
      this.onConnectionStatusChanged?.('connected');
      
      // 채팅방 구독
      if (this.currentRoomId) {
        this.subscribeToRoom(this.currentRoomId);
      }
    };

    // 연결 실패
    this.client.onStompError = (frame) => {
      console.error('[STOMP] Error:', frame.headers['message'], frame.body);
      this.onConnectionStatusChanged?.('error');
    };

    // 연결 종료
    this.client.onDisconnect = () => {
      console.log('[STOMP] Disconnected');
      this.onConnectionStatusChanged?.('disconnected');
    };
  }

  // 연결 시작
  connect(user: CurrentUser, roomId: string): void {
    this.currentUser = user;
    this.currentRoomId = roomId;
    
    if (!this.client) return;

    // 사용자 정보를 헤더에 추가
    this.client.connectHeaders = {
      'X-User-Id': user.userId,
      'X-Student-Id': user.studentId,
      'X-User-Name': user.userName,
      'X-Profile-Image': user.profileImageUrl || '',
    };

    this.onConnectionStatusChanged?.('connecting');
    this.client.activate();
  }

  // 연결 종료
  disconnect(): void {
    if (this.client?.active) {
      this.client.deactivate();
    }
    this.currentRoomId = null;
    this.currentUser = null;
  }

  // 채팅방 구독
  private subscribeToRoom(roomId: string): void {
    if (!this.client?.connected) return;

    this.client.subscribe(`/topic/room/${roomId}`, (message) => {
      try {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        console.log('[STOMP] Received message:', chatMessage);
        this.onMessageReceived?.(chatMessage);
      } catch (error) {
        console.error('[STOMP] Failed to parse message:', error);
      }
    });

    console.log(`[STOMP] Subscribed to room: ${roomId}`);
  }

  // 메시지 전송
  sendMessage(messageData: SendMessageRequest): void {
    if (!this.client?.connected || !this.currentUser) {
      console.error('[STOMP] Cannot send message: not connected');
      return;
    }

    this.client.publish({
      destination: `/app/chat/${messageData.roomId}`,
      body: JSON.stringify(messageData),
      headers: {
        'X-User-Id': this.currentUser.userId,
        'X-Student-Id': this.currentUser.studentId,
        'X-User-Name': this.currentUser.userName,
        'X-Profile-Image': this.currentUser.profileImageUrl || '',
      },
    });

    console.log('[STOMP] Message sent:', messageData);
  }

  // 메시지 수신 핸들러 등록
  onMessage(callback: (message: ChatMessage) => void): void {
    this.onMessageReceived = callback;
  }

  // 연결 상태 변경 핸들러 등록
  onConnectionStatus(callback: (status: ConnectionStatus) => void): void {
    this.onConnectionStatusChanged = callback;
  }

  // 현재 연결 상태
  get connectionStatus(): ConnectionStatus {
    if (!this.client) return 'disconnected';
    if (this.client.connected) return 'connected';
    if (this.client.active) return 'connecting';
    return 'disconnected';
  }
}

// 싱글톤 인스턴스
export const chatWebSocketService = new ChatWebSocketService();