import { create } from 'zustand';
import { getRandomAvatarId, getAvatarById } from '@/src/shared/data/avatars';
import type { UserProfile } from './types';

interface UserState {
  // 사용자 정보
  profile: UserProfile | null;
  
  // 상태
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  // 프로필 설정
  setProfile: (profile: UserProfile) => void;
  
  // 아바타 랜덤 변경
  changeAvatarRandomly: () => Promise<void>;
  
  // 프로필 업데이트
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // 유틸리티
  reset: () => void;
  clearError: () => void;
}

type UserStore = UserState & UserActions;

// Mock 프로필 데이터 (로그인 후 실제 데이터로 교체)
const getMockProfile = (): UserProfile => ({
  id: 'user_001',
  name: '해이영',
  studentId: '25139998',
  profileImage: 'avatar_01', // 기본 아바타
});

export const useUserStore = create<UserStore>((set, get) => ({
  // 초기 상태
  profile: getMockProfile(),
  isLoading: false,
  error: null,

  // 프로필 설정
  setProfile: (profile: UserProfile) => {
    set({ profile });
  },

  // 아바타 랜덤 변경
  changeAvatarRandomly: async () => {
    const { profile } = get();
    if (!profile) return;

    set({ isLoading: true, error: null });

    try {
      // 랜덤 아바타 ID 생성
      const newAvatarId = getRandomAvatarId();
      
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: 실제 API 호출
      // await mypageApi.updateProfile({ profileImage: newAvatarId });
      
      // 프로필 업데이트
      set({
        profile: {
          ...profile,
          profileImage: newAvatarId
        },
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '아바타 변경에 실패했습니다',
        isLoading: false
      });
    }
  },

  // 프로필 업데이트
  updateProfile: (updates: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) return;

    set({
      profile: {
        ...profile,
        ...updates
      }
    });
  },

  // 상태 초기화
  reset: () => {
    set({
      profile: null,
      isLoading: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));