import type { MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';
import { create } from 'zustand';

// 밥약 기본 정보
export interface MealDetailInfo {
  mealId: string;
  title: string;
  date: string;
  time: string;
  memo: string;
  host: {
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  };
}

// 정산 현황 정보
export interface SettlementInfo {
  totalAmount: number;
  requestDate: string;
  participants: Array<{
    userId: string;
    name: string;
    department: string;
    studentId: string;
    avatarId: string;
    isSettled: boolean;
  }>;
}

interface MealInfoDetailState {
  // 밥약 기본 정보
  mealInfo: MealDetailInfo | null;
  isMealInfoLoading: boolean;
  
  // 정산 현황 정보
  settlementInfo: SettlementInfo | null;
  isSettlementLoading: boolean;
  
  // 에러 상태
  error: string | null;
}

interface MealInfoDetailActions {
  // 밥약 기본 정보 로드
  loadMealInfo: (mealId: string) => Promise<void>;
  
  // 정산 현황 정보 로드
  loadSettlementInfo: (mealId: string) => Promise<void>;
  
  // 상태 초기화
  reset: () => void;
  clearError: () => void;
}

type MealInfoDetailStore = MealInfoDetailState & MealInfoDetailActions;

export const useMealInfoDetailStore = create<MealInfoDetailStore>((set, get) => ({
  // 초기 상태
  mealInfo: null,
  isMealInfoLoading: false,
  settlementInfo: null,
  isSettlementLoading: false,
  error: null,

  // 밥약 기본 정보 로드
  loadMealInfo: async (mealId: string) => {
    set({ isMealInfoLoading: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch(`${baseURL}/api/meals/${mealId}`);
      // const data = await response.json();
      
      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockMealInfo: MealDetailInfo = {
        mealId,
        title: '학식 먹으러 가는 팟',
        date: '2025-07-28',
        time: '13:55',
        memo: '맛있게 먹어요!',
        host: {
          name: '김지은',
          studentId: '1913998',
          department: '경영학과',
          profileUrl: 'avatar_01'
        },
      };
      
      set({ 
        mealInfo: mockMealInfo,
        isMealInfoLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '밥약 정보를 불러오는데 실패했습니다',
        isMealInfoLoading: false 
      });
    }
  },

  // 정산 현황 정보 로드
  loadSettlementInfo: async (mealId: string) => {
    set({ isSettlementLoading: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch(`${baseURL}/api/meals/${mealId}/settlement`);
      // const data = await response.json();
      
      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockSettlementInfo: SettlementInfo = {
        totalAmount: 26000,
        requestDate: '2025-07-28',
        participants: [
          {
            userId: 'user1',
            name: '이지민',
            department: '경영학과',
            studentId: '1326123',
            avatarId: 'avatar_02',
            isSettled: true,
          },
          {
            userId: 'user2',
            name: '김미림',
            department: '경영학과',
            studentId: '234123',
            avatarId: 'avatar_01',
            isSettled: false,
          },
          {
            userId: 'user3',
            name: '이예린',
            department: '경영학과',
            studentId: '1326123',
            avatarId: 'avatar_02',
            isSettled: true,
          },
        ],
      };
      
      set({ 
        settlementInfo: mockSettlementInfo,
        isSettlementLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '정산 현황을 불러오는데 실패했습니다',
        isSettlementLoading: false 
      });
    }
  },

  // 상태 초기화
  reset: () => {
    set({
      mealInfo: null,
      isMealInfoLoading: false,
      settlementInfo: null,
      isSettlementLoading: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));