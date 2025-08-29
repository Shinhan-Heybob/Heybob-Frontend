import { create } from 'zustand';
import type {
  ChatError,
  ChatMessage,
  ChatRoom,
  ConnectionStatus,
  CurrentUser,
  SendMessageRequest
} from './types';
import ChatService, { MessageType, ChatMessageResponse } from '../services/ChatService';

// ChatMessageResponse를 ChatMessage로 변환하는 함수
const convertToChatMessage = (response: ChatMessageResponse): ChatMessage => {
  return {
    messageId: response.messageId,
    roomId: response.roomId,
    senderId: response.senderId,
    studentId: response.studentId,
    senderName: response.senderName,
    profileImageUrl: response.profileImageUrl,
    content: response.content,
    messageType: response.messageType as keyof typeof MessageType,
    timestamp: response.timestamp,
    paymentRequestData: response.paymentRequestData,
    paymentCompleteData: response.paymentCompleteData,
  };
};

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
  sendAiQuestion: (question: string) => void;
  addMessage: (message: ChatMessage) => void;
  loadMessages: (roomId: string, before?: string) => Promise<void>;
  
  // 상태 초기화
  clearMessages: () => void;
  clearError: () => void;
  resetChatState: () => void;
}

// 밥약 채팅 목 데이터
const getMockMealMessages = (roomId: string): ChatMessage[] => [
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

// 모임 채팅 목 데이터 
const getMockGroupMessages = (roomId: string): ChatMessage[] => [
  {
    messageId: 'group_msg1',
    roomId,
    senderId: 'user1',
    studentId: '1913998',
    senderName: '김지은',
    profileImageUrl: '',
    content: '이번 달 적금 모으기 시작해요!',
    messageType: 'CHAT',
    timestamp: new Date(Date.now() - 400000).toISOString(),
  },
  {
    messageId: 'group_msg2',
    roomId,
    senderId: 'user2',
    studentId: '1326123',
    senderName: '이지민',
    profileImageUrl: '',
    content: '좋아요! 얼마씩 모을까요?',
    messageType: 'CHAT',
    timestamp: new Date(Date.now() - 350000).toISOString(),
  },
  {
    messageId: 'group_msg3',
    roomId,
    senderId: 'system',
    studentId: '',
    senderName: '시스템',
    profileImageUrl: '',
    content: '김미림님이 입장했습니다',
    messageType: 'JOIN',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    messageId: 'group_msg4',
    roomId,
    senderId: 'user3',
    studentId: '234123',
    senderName: '김미림',
    profileImageUrl: '',
    content: '한 달에 26000원씩 어때요?',
    messageType: 'CHAT',
    timestamp: new Date(Date.now() - 250000).toISOString(),
  },
  {
    messageId: 'group_msg5',
    roomId,
    senderId: 'user4',
    studentId: '234123',
    senderName: '박재은',
    profileImageUrl: '',
    content: '좋네요! 동의합니다',
    messageType: 'CHAT',
    timestamp: new Date(Date.now() - 200000).toISOString(),
  },
  {
    messageId: 'group_msg6',
    roomId,
    senderId: 'user1',
    studentId: '1913998',
    senderName: '김지은',
    profileImageUrl: '',
    content: '김지은님이 1/N 모으기를 요청했습니다.',
    messageType: 'SAVINGS_REQUEST',
    timestamp: new Date(Date.now() - 150000).toISOString(),
    savingsRequestData: {
      savingsId: 'savings_' + Date.now(),
      roomId,
      requesterName: '김지은',
      requestAmount: 26000,
      savingsUrl: '/groups/savings/savings_' + Date.now()
    },
  },
  {
    messageId: 'group_msg7',
    roomId,
    senderId: 'user2',
    studentId: '1326123',
    senderName: '이지민',
    profileImageUrl: '',
    content: '이지민님이 적금을 완료했습니다.',
    messageType: 'SAVINGS_COMPLETE',
    timestamp: new Date(Date.now() - 100000).toISOString(),
    savingsCompleteData: {
      savingsId: 'savings_' + Date.now(),
      roomId,
      participantId: '1326123',
      participantName: '이지민',
      completedAmount: 26000
    },
  },
  {
    messageId: 'group_msg8',
    roomId,
    senderId: 'user3',
    studentId: '234123',
    senderName: '김미림',
    profileImageUrl: '',
    content: '저도 완료했어요!',
    messageType: 'CHAT',
    timestamp: new Date(Date.now() - 50000).toISOString(),
  },
  {
    messageId: 'group_msg9',
    roomId,
    senderId: 'user3',
    studentId: '234123',
    senderName: '김미림',
    profileImageUrl: '',
    content: '김미림님이 적금을 완료했습니다.',
    messageType: 'SAVINGS_COMPLETE',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    savingsCompleteData: {
      savingsId: 'savings_' + Date.now(),
      roomId,
      participantId: '234123',
      participantName: '김미림',
      completedAmount: 26000
    },
  },
];

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

    // ChatService 이벤트 핸들러 등록
    ChatService.setOnMessageReceived((message) => {
      const chatMessage = convertToChatMessage(message);
      get().addMessage(chatMessage);
    });

    ChatService.setOnErrorReceived((error) => {
      set({ 
        connectionStatus: 'error',
        error: {
          code: 'WEBSOCKET_ERROR',
          message: error.message || '연결 오류가 발생했습니다'
        }
      });
    });

    // 연결 시작 (개발 환경에서는 기본값 사용)
    try {
      console.log('🔍 ChatStore 연결 시 사용자 정보:', {
        userId: user.userId,
        userName: user.userName,
        studentId: user.studentId,
        roomId: roomId
      });
      
      ChatService.connect(
        user.userId,
        user.userName, 
        user.studentId,
        roomId,
        __DEV__ ? 'http://70.12.246.239:8081/ws' : 'http://localhost:8081/ws',
        user.profileImageUrl || ''
      );
      
      // 연결 상태 체크
      const checkConnection = setInterval(() => {
        if (ChatService.isConnected()) {
          set({ connectionStatus: 'connected' });
          clearInterval(checkConnection);
        }
      }, 500);
      
      // 타임아웃 설정 (10초)
      setTimeout(() => {
        if (!ChatService.isConnected()) {
          clearInterval(checkConnection);
          set({ 
            connectionStatus: 'error',
            error: {
              code: 'CONNECTION_TIMEOUT',
              message: '연결 시간이 초과되었습니다'
            }
          });
        }
      }, 10000);
      
    } catch (error: any) {
      set({ 
        connectionStatus: 'error',
        error: {
          code: 'CONNECTION_FAILED',
          message: error.message || '연결에 실패했습니다'
        }
      });
    }
  },

  // WebSocket 연결 해제
  disconnect: () => {
    ChatService.disconnect();
    set({ connectionStatus: 'disconnected' });
  },

  // 메시지 전송
  sendMessage: (content: string) => {
    const { currentRoom, currentUser, connectionStatus } = get();
    
    if (!currentRoom || !currentUser || connectionStatus !== 'connected') {
      console.error('Cannot send message: not ready');
      return;
    }

    // ChatService를 통해 메시지 전송
    const success = ChatService.sendMessage(currentRoom.roomId, content.trim(), MessageType.CHAT);
    
    if (!success) {
      set({ 
        error: {
          code: 'SEND_MESSAGE_ERROR',
          message: '메시지 전송에 실패했습니다'
        }
      });
    }
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

    // ChatService를 통해 학식 정보 요청
    const success = ChatService.getCafeteriaInfo(currentRoom.roomId);
    
    if (!success) {
      set({ 
        error: {
          code: 'CAFETERIA_REQUEST_ERROR',
          message: '학식 정보 요청에 실패했습니다'
        }
      });
    }
  },

  // AI 질문 전송
  sendAiQuestion: (question: string) => {
    const { currentRoom, currentUser, connectionStatus } = get();
    
    if (!currentRoom || !currentUser || connectionStatus !== 'connected') {
      console.error('Cannot send AI question: not ready');
      return;
    }

    // ChatService를 통해 AI 질문 전송
    const success = ChatService.sendAiQuestion(currentRoom.roomId, question);
    
    if (!success) {
      set({ 
        error: {
          code: 'AI_QUESTION_ERROR',
          message: 'AI 질문 전송에 실패했습니다'
        }
      });
    }
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

  // 채팅 히스토리 로드
  loadMessages: async (roomId: string, before?: string) => {
    set({ isLoadingMessages: true, error: null });

    try {
      const { currentUser } = get();
      
      if (!currentUser) {
        throw new Error('사용자 정보가 없습니다');
      }

      // ChatService를 통해 히스토리 로드
      let historyResponse;
      if (before) {
        historyResponse = await ChatService.fetchChatHistoryBefore(roomId, currentUser.userId, before);
      } else {
        historyResponse = await ChatService.fetchChatHistory(roomId, currentUser.userId);
      }

      // API 응답 구조: {messages: [], lastMessageId: string, hasMore: boolean, totalCount: number}
      const messages = historyResponse?.messages || [];
      const hasMore = historyResponse?.hasMore ?? false;
      const lastMessageId = historyResponse?.lastMessageId || null;
      const totalCount = historyResponse?.totalCount || messages.length;

      console.log('API 응답 처리:', { 
        messages: messages.length, 
        hasMore, 
        lastMessageId,
        totalCount 
      });

      // 기존 메시지에 추가 (중복 제거)
      set((state) => {
        const existingIds = new Set(state.messages.map(msg => msg.messageId));
        const newMessages = Array.isArray(messages) ? messages.filter((msg: ChatMessage) => !existingIds.has(msg.messageId)) : [];
        const allMessages = [...newMessages, ...state.messages].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return {
          messages: allMessages,
          isLoadingMessages: false,
          hasMoreMessages: hasMore,
        };
      });

    } catch (error: any) {
      // API 실패 시 목 데이터 사용
      console.log('API 로드 실패, 목 데이터 사용:', error.message);
      
      // roomId로 밥약/모임 채팅 구분
      const isGroupChat = roomId.startsWith('group_');
      
      // 임시 목 데이터
      const mockMessages: ChatMessage[] = isGroupChat 
        ? getMockGroupMessages(roomId)  // 모임 채팅 목 데이터
        : getMockMealMessages(roomId);  // 밥약 채팅 목 데이터

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
          hasMoreMessages: before ? false : true,
        };
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