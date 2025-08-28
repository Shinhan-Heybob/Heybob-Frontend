import { create } from 'zustand';
import { mypageApi } from '@/src/features/mypage/api/mypageApi';
import { storage } from '@/src/shared/lib/storage';
import type { UserInfo } from '@/src/features/main/types';

interface UserState {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUserInfo: () => Promise<void>;
  setUserInfo: (userInfo: UserInfo) => void;
  clearError: () => void;
  clearUserInfo: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  // 상태
  userInfo: null,
  isLoading: false,
  error: null,

  // 사용자 정보 가져오기
  fetchUserInfo: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = await storage.getUserId();
      console.log('🔍 userStore - storage.getUserId():', userId);
      if (!userId) {
        throw new Error('사용자 정보가 없습니다. 다시 로그인해주세요.');
      }

      const response = await mypageApi.getUserInfo(userId);
      
      if (response.success && response.data) {
        set({ 
          userInfo: response.data, 
          isLoading: false,
          error: null 
        });
      } else {
        set({ 
          error: response.error || '사용자 정보를 불러올 수 없습니다.',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      set({ 
        error: error instanceof Error ? error.message : '사용자 정보를 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 사용자 정보 직접 설정
  setUserInfo: (userInfo: UserInfo) => {
    set({ userInfo, error: null });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },

  // 사용자 정보 초기화 (로그아웃시)
  clearUserInfo: () => {
    set({ userInfo: null, error: null });
  },
}));