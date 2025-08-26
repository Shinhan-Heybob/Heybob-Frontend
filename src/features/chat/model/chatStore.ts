import { create } from 'zustand';
import type {
  ChatError,
  ChatMessage,
  ChatRoom,
  ConnectionStatus,
  CurrentUser,
  SendMessageRequest
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
  sendTypedMessage: (messageData: SendMessageRequest) => void;
  sendCafeteriaInfoRequest: () => void;
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

  // WebSocket 연결 (임시 비활성화 - 목 데이터 테스트용)
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

    // 임시: WebSocket 연결 대신 바로 connected 상태로 설정
    setTimeout(() => {
      set({ connectionStatus: 'connected' });
    }, 1000);

    // TODO: 백엔드 준비되면 WebSocket 연결 활성화
    /*
    // WebSocket 이벤트 핸들러 등록
    chatWebSocketService.onConnectionStatus((status) => {
      set({ connectionStatus: status });
    });

    chatWebSocketService.onMessage((message) => {
      get().addMessage(message);
    });

    // 연결 시작
    chatWebSocketService.connect(user, roomId);
    */
  },

  // WebSocket 연결 해제
  disconnect: () => {
    chatWebSocketService.disconnect();
    set({ connectionStatus: 'disconnected' });
  },

  // 메시지 전송 (임시 목 데이터 추가)
  sendMessage: (content: string) => {
    const { currentRoom, currentUser, connectionStatus } = get();
    
    if (!currentRoom || !currentUser || connectionStatus !== 'connected') {
      console.error('Cannot send message: not ready');
      return;
    }

    // 임시: 로컬에서 메시지 바로 추가
    const newMessage: ChatMessage = {
      messageId: 'msg_' + Date.now(),
      roomId: currentRoom.roomId,
      senderId: currentUser.userId,
      studentId: currentUser.studentId,
      senderName: currentUser.userName,
      profileImageUrl: currentUser.profileImageUrl || '',
      content: content.trim(),
      messageType: 'CHAT',
      timestamp: new Date().toISOString(),
    };

    get().addMessage(newMessage);

    // TODO: 백엔드 준비되면 WebSocket으로 전송
    /*
    const messageData: SendMessageRequest = {
      content: content.trim(),
      messageType: 'CHAT',
    };

    chatWebSocketService.sendMessage(messageData, currentRoom.roomId);
    */
  },

  // 타입별 메시지 전송
  sendTypedMessage: (messageData: SendMessageRequest) => {
    const { currentRoom, currentUser, connectionStatus } = get();
    
    if (!currentRoom || !currentUser || connectionStatus !== 'connected') {
      console.error('Cannot send message: not ready');
      return;
    }

    // TODO: 백엔드 준비되면 WebSocket으로 전송
    console.log('Sending typed message:', messageData);
    /*
    chatWebSocketService.sendMessage(messageData, currentRoom.roomId);
    */
  },

  // 학식 정보 요청
  sendCafeteriaInfoRequest: () => {
    const { currentRoom, currentUser, connectionStatus } = get();
    
    if (!currentRoom || !currentUser || connectionStatus !== 'connected') {
      console.error('Cannot send cafeteria info request: not ready');
      return;
    }

    // 목 데이터로 학식 정보 메시지 생성
    const cafeteriaInfoMessage: ChatMessage = {
      messageId: 'cafeteria_' + Date.now(),
      roomId: currentRoom.roomId,
      senderId: 'system_cafeteria_bot',
      studentId: '',
      senderName: '학식 정보 봇',
      profileImageUrl: '',
      content: `📍 오늘의 학식 정보
      
🍽️ 중식 (11:30-14:00)
• 돈까스 정식 - 4,500원
• 김치찌개 정식 - 4,000원  
• 불고기 덮밥 - 4,800원

🍜 석식 (17:30-19:30)
• 치킨마요 덮밥 - 5,000원
• 된장찌개 정식 - 3,800원
• 제육볶음 정식 - 4,500원

📞 문의: 학생식당 02-123-4567`,
      messageType: 'CAFETERIA_INFO',
      timestamp: new Date().toISOString(),
    };

    // 메시지 추가
    get().addMessage(cafeteriaInfoMessage);

    // TODO: 백엔드 준비되면 전용 엔드포인트로 요청
    // chatWebSocketService.sendCafeteriaInfoRequest(currentRoom.roomId);
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
          content: '오늘 중식 불고기랬나?',
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
          messageType: 'JOIN',
          timestamp: new Date(Date.now() - 180000).toISOString(),
        },
        {
          messageId: 'msg4',
          roomId,
          senderId: 'user3',
          studentId: '1346671',
          senderName: '이지민',
          profileImageUrl: '',
          content: '오늘 나 육회비빔밥도 좀 땡기는데',
          messageType: 'CHAT',
          timestamp: new Date(Date.now() - 150000).toISOString(),
        },
        {
          messageId: 'msg5',
          roomId,
          senderId: 'currentUser',
          studentId: '1346671',
          senderName: '나',
          profileImageUrl: '',
          content: '그러면 육회고고 좋아',
          messageType: 'CHAT',
          timestamp: new Date(Date.now() - 120000).toISOString(),
        },
        {
          messageId: 'msg6',
          roomId,
          senderId: 'user1',
          studentId: '1346671',
          senderName: '이지민',
          profileImageUrl: '',
          content: '이지민님이 정산하기를 요청했습니다.',
          messageType: 'PAYMENT_REQUEST',
          timestamp: new Date(Date.now() - 90000).toISOString(),
          paymentRequestData: {
            settlementId: '66c5f1a2-b8d4-4e5f-a7b8-c9d0e1f2a3b4',
            roomId,
            requesterName: '이지민',
            requestAmount: 12200,
            settlementUrl: '/main/settlement/66c5f1a2-b8d4-4e5f-a7b8-c9d0e1f2a3b4'
          },
        },
        {
          messageId: 'msg7',
          roomId,
          senderId: 'user2',
          studentId: '2345671',
          senderName: '김철수',
          profileImageUrl: '',
          content: '김철수님이 정산을 완료했습니다.',
          messageType: 'PAYMENT_COMPLETE',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          paymentCompleteData: {
            settlementId: '66c5f1a2-b8d4-4e5f-a7b8-c9d0e1f2a3b4',
            roomId,
            recipientId: '20000623',
            recipientName: '김철수',
            completedAmount: 12200
          },
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