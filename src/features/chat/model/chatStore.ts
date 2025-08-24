import { create } from 'zustand';
import type { 
  ChatMessage, 
  CurrentUser, 
  ConnectionStatus, 
  ChatRoom,
  SendMessageRequest,
  ChatError 
} from './types';
import { chatWebSocketService } from './websocket';

interface ChatState {
  // 채팅방 정보
  currentRoom: ChatRoom | null;
  currentUser: CurrentUser | null;
  
  // 메시지 관련
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  hasMoreMessages: boolean;
  
  // WebSocket 연결
  connectionStatus: ConnectionStatus;
  
  // 에러 상태
  error: ChatError | null;
  
  // 액션들
  setCurrentUser: (user: CurrentUser) => void;
  setCurrentRoom: (room: ChatRoom) => void;
  
  // WebSocket 연결/해제
  connect: (user: CurrentUser, roomId: string) => void;
  disconnect: () => void;
  
  // 메시지 관련
  sendMessage: (content: string) => void;
  addMessage: (message: ChatMessage) => void;
  loadMessages: (roomId: string, before?: string) => Promise<void>;
  
  // 상태 초기화
  clearMessages: () => void;
  clearError: () => void;
  resetChatState: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // 초기 상태
  currentRoom: null,
  currentUser: null,
  messages: [],
  isLoadingMessages: false,
  hasMoreMessages: true,
  connectionStatus: 'disconnected',
  error: null,

  // 현재 사용자 설정
  setCurrentUser: (user: CurrentUser) => {
    set({ currentUser: user });
  },

  // 현재 채팅방 설정  
  setCurrentRoom: (room: ChatRoom) => {
    set({ currentRoom: room });
  },

  // WebSocket 연결
  connect: (user: CurrentUser, roomId: string) => {
    const state = get();
    
    // 이미 연결된 경우 스킵
    if (state.connectionStatus === 'connected' || state.connectionStatus === 'connecting') {
      return;
    }

    set({ 
      currentUser: user,
      connectionStatus: 'connecting',
      error: null 
    });

    // WebSocket 이벤트 핸들러 등록
    chatWebSocketService.onConnectionStatus((status) => {
      set({ connectionStatus: status });
    });

    chatWebSocketService.onMessage((message) => {
      get().addMessage(message);
    });

    // 연결 시작
    chatWebSocketService.connect(user, roomId);
  },

  // WebSocket 연결 해제
  disconnect: () => {
    chatWebSocketService.disconnect();
    set({ connectionStatus: 'disconnected' });
  },

  // 메시지 전송
  sendMessage: (content: string) => {
    const { currentRoom, currentUser, connectionStatus } = get();
    
    if (!currentRoom || !currentUser || connectionStatus !== 'connected') {
      console.error('Cannot send message: not ready');
      return;
    }

    const messageData: SendMessageRequest = {
      roomId: currentRoom.roomId,
      content: content.trim(),
      messageType: 'CHAT',
    };

    chatWebSocketService.sendMessage(messageData);
  },

  // 메시지 추가 (실시간 수신)
  addMessage: (message: ChatMessage) => {
    set((state) => {
      // 중복 메시지 방지
      const exists = state.messages.some(msg => msg.messageId === message.messageId);
      if (exists) return state;

      // 시간순 정렬로 삽입
      const newMessages = [...state.messages, message].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return { messages: newMessages };
    });
  },

  // 채팅 히스토리 로드 (임시 구현 - 나중에 API 연결)
  loadMessages: async (roomId: string, before?: string) => {
    set({ isLoadingMessages: true, error: null });

    try {
      // TODO: 실제 API 호출로 교체
      // const response = await chatApi.getMessages({ roomId, before, limit: 20 });
      
      // 임시 목 데이터
      const mockMessages: ChatMessage[] = [
        {
          messageId: 'msg1',
          roomId,
          senderId: 'user1',
          studentId: '1346671',
          senderName: '이지민',
          profileImageUrl: '',
          content: '우리 오늘 학식 ㄱㄱ?',
          messageType: 'CHAT',
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          messageId: 'msg2',
          roomId,
          senderId: 'user2',
          studentId: '2345671',
          senderName: '이예린',
          profileImageUrl: '',
          content: '오늘 중식 볶고기겠나?',
          messageType: 'CHAT',
          timestamp: new Date(Date.now() - 240000).toISOString(),
        },
        {
          messageId: 'msg3',
          roomId,
          senderId: 'system',
          studentId: '',
          senderName: '시스템',
          profileImageUrl: '',
          content: '박재은님이 입장했습니다',
          messageType: 'SYSTEM',
          timestamp: new Date(Date.now() - 180000).toISOString(),
        },
        {
          messageId: 'msg4',
          roomId,
          senderId: 'user1',
          studentId: '1346671',
          senderName: '이지민',
          profileImageUrl: '',
          content: '이지민님이 정산하기를 요청했습니다!',
          messageType: 'PAYMENT_REQUEST',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          amount: 12200,
        },
      ];

      // 기존 메시지에 추가 (중복 제거)
      set((state) => {
        const existingIds = new Set(state.messages.map(msg => msg.messageId));
        const newMessages = mockMessages.filter(msg => !existingIds.has(msg.messageId));
        const allMessages = [...newMessages, ...state.messages].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return {
          messages: allMessages,
          isLoadingMessages: false,
          hasMoreMessages: before ? false : true, // 첫 로드가 아니면 더 이상 없음
        };
      });

    } catch (error: any) {
      set({
        error: {
          code: 'LOAD_MESSAGES_ERROR',
          message: error.message || '메시지를 불러오는데 실패했습니다',
        },
        isLoadingMessages: false,
      });
    }
  },

  // 메시지 목록 초기화
  clearMessages: () => {
    set({ messages: [], hasMoreMessages: true });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },

  // 전체 채팅 상태 초기화
  resetChatState: () => {
    get().disconnect();
    set({
      currentRoom: null,
      currentUser: null,
      messages: [],
      isLoadingMessages: false,
      hasMoreMessages: true,
      connectionStatus: 'disconnected',
      error: null,
    });
  },
}));