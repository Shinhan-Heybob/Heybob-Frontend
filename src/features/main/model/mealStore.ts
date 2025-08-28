import { create } from 'zustand';
import { mainApi } from '../api/mainApi';
import type { MealStatistics } from '../types';

export interface MealSummaryData {
  participationCount: number;  // 밥약 만들기 참여 횟수
  groupParticipationCount: number; // 그룹 만들기 참여 횟수
  accountBalance: number;       // 내 계좌 잔액 (기존 호환성용)
}

interface MealState {
  summaryData: MealSummaryData | null;
  mealStatistics: MealStatistics | null;
  isLoading: boolean;
  error: string | null;
}

interface MealActions {
  fetchMealStatistics: () => Promise<void>;
  fetchMealSummary: () => Promise<void>; // 기존 호환성용
  setMealSummary: (data: MealSummaryData) => void;
  clearError: () => void;
}

type MealStore = MealState & MealActions;

export const useMealStore = create<MealStore>((set, get) => ({
  // 상태
  summaryData: null,
  mealStatistics: null,
  isLoading: false,
  error: null,

  // 밥약 통계 가져오기
  fetchMealStatistics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await mainApi.getMealStatistics();
      
      if (response.success && response.data) {
        // MealSummaryData 형태로도 변환 (기존 호환성)
        const summaryData: MealSummaryData = {
          participationCount: response.data.mealAppointmentCount,
          groupParticipationCount: response.data.regularMeetingCount,
          accountBalance: 0, // 이제 accountStore에서 관리
        };

        set({ 
          mealStatistics: response.data,
          summaryData,
          isLoading: false 
        });
      } else {
        set({ 
          error: response.error || '밥약 통계를 불러올 수 없습니다.',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('밥약 통계 로드 실패:', error);
      set({ 
        error: error instanceof Error ? error.message : '밥약 통계를 불러오는데 실패했습니다',
        isLoading: false 
      });
    }
  },

  // 밥약 요약 데이터 가져오기 (기존 호환성을 위해 유지)
  fetchMealSummary: async () => {
    await get().fetchMealStatistics();
  },

  // 밥약 요약 데이터 직접 설정
  setMealSummary: (data: MealSummaryData) => {
    set({ summaryData: data, error: null });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));