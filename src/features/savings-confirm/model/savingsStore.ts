
import type { MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';
import { create } from 'zustand';
import { savingsApi } from '../api/savingsApi';

interface SavingsState {
  // 모임 정보 (MealInfoCard 재활용)
  groupInfo: MealInfo | null;
  isGroupInfoLoading: boolean;
  
  // 적금 정보
  roomId: string | null;
  
  // API 호출 상태
  isProcessing: boolean;
  
  // 에러 상태
  error: string | null;
}

interface SavingsActions {
  // 모임 정보 로드
  loadGroupInfo: (roomId: string) => Promise<void>;
  
  // 적금 정보 설정
  setSavingsInfo: (roomId: string) => void;
  
  // 적금 취소
  cancelSavings: (messageId: string) => Promise<boolean>;
  
  // 적금 확정
  confirmSavings: (messageId: string) => Promise<boolean>;
  
  // 상태 초기화
  reset: () => void;
  clearError: () => void;
}

type SavingsStore = SavingsState & SavingsActions;

export const useSavingsStore = create<SavingsStore>((set, get) => ({
  // 초기 상태
  groupInfo: null,
  isGroupInfoLoading: false,
  roomId: null,
  isProcessing: false,
  error: null,

  // 모임 정보 로드
  loadGroupInfo: async (roomId: string) => {
    set({ isGroupInfoLoading: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch(`${baseURL}/api/groups/${roomId}/info`);
      // const data = await response.json();
      
      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockGroupInfo: MealInfo = {
        hostName: '김지은',
        hostDepartment: '경영학과',
        hostStudentId: '1913998',
        hostAvatarId: 'avatar_01',
        mealTitle: '공통주택 모임', // 모임 제목으로 변경
      };
      
      set({ 
        groupInfo: mockGroupInfo,
        isGroupInfoLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '모임 정보를 불러오는데 실패했습니다',
        isGroupInfoLoading: false 
      });
    }
  },

  // 적금 정보 설정
  setSavingsInfo: (roomId: string) => {
    set({ roomId });
  },

  // 적금 취소
  cancelSavings: async (messageId: string) => {
    set({ isProcessing: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch(`${baseURL}/api/savings/${messageId}/cancel`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // if (!response.ok) {
      //   throw new Error('적금 취소에 실패했습니다');
      // }
      
      // 임시 성공 처리
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ isProcessing: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '적금 취소에 실패했습니다',
        isProcessing: false 
      });
      return false;
    }
  },

  // 적금 확정
  confirmSavings: async (messageId: string) => {
    const { roomId } = get();
    
    if (!roomId) {
      set({ error: '적금 정보가 없습니다' });
      return false;
    }
    
    set({ isProcessing: true, error: null });
    
    try {
      const result = await savingsApi.participateSavings(roomId, {
        messageId
      });
      
      if (result.success) {
        set({ isProcessing: false });
        return true;
      } else {
        set({ 
          error: result.error || '적금 처리에 실패했습니다',
          isProcessing: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '적금 처리에 실패했습니다',
        isProcessing: false 
      });
      return false;
    }
  },

  // 상태 초기화
  reset: () => {
    set({
      groupInfo: null,
      isGroupInfoLoading: false,
      roomId: null,
      isProcessing: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));