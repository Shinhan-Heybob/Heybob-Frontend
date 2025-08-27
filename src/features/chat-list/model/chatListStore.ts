import { chatListApi } from '@/src/shared/api/chatListApi';
import { create } from 'zustand';
import type { ChatListFilters, ChatListItem, ChatStatus, ChatType } from './types';

interface ChatListState {
  // 데이터
  chatList: ChatListItem[];
  filters: ChatListFilters;
  
  // 상태
  isLoading: boolean;
  error: string | null;
  
  // 사용자 정보
  currentUserId: number | null;
}

interface ChatListActions {
  // 필터 변경
  setFilters: (filters: Partial<ChatListFilters>) => void;
  setTypeFilter: (type: ChatType) => void;
  setStatusFilter: (status: ChatStatus) => void;
  
  // 데이터 로드
  loadChatList: () => Promise<void>;
  
  // 사용자 설정
  setCurrentUserId: (userId: number) => void;
  
  // 유틸리티
  reset: () => void;
  clearError: () => void;
}

type ChatListStore = ChatListState & ChatListActions;

export const useChatListStore = create<ChatListStore>((set, get) => ({
  // 초기 상태
  chatList: [],
  filters: {
    status: 'active',
    type: 'all'
  },
  isLoading: false,
  error: null,
  currentUserId: null,

  // 필터 변경
  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    set({ filters: updatedFilters });
    
    // 필터 변경 후 자동으로 데이터 다시 로드
    get().loadChatList();
  },

  setTypeFilter: (type) => {
    get().setFilters({ type });
  },

  setStatusFilter: (status) => {
    get().setFilters({ status });
  },

  // 채팅 목록 로드
  loadChatList: async () => {
    const { currentUserId, filters } = get();
    
    if (!currentUserId) {
      set({ error: '사용자 정보가 없습니다' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 개발 중에는 Mock API 사용
      const response = await chatListApi.getMockChatList(
        currentUserId,
        filters.status,
        filters.type
      );

      if (response.success && response.data) {
        set({ 
          chatList: response.data,
          isLoading: false 
        });
      } else {
        throw new Error(response.error || '데이터를 불러오는데 실패했습니다');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다',
        isLoading: false
      });
    }
  },

  // 사용자 ID 설정
  setCurrentUserId: (userId) => {
    set({ currentUserId: userId });
  },

  // 상태 초기화
  reset: () => {
    set({
      chatList: [],
      filters: { status: 'active', type: 'all' },
      isLoading: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));