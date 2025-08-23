import { create } from 'zustand';

export interface MealSummaryData {
  participationCount: number;  // 밥약 참여 횟수
  savingsAmount: number;       // 모임 적금 금액
}

interface MealState {
  summaryData: MealSummaryData | null;
  isLoading: boolean;
  error: string | null;
}

interface MealActions {
  fetchMealSummary: () => Promise<void>;
  setMealSummary: (data: MealSummaryData) => void;
  clearError: () => void;
}

type MealStore = MealState & MealActions;

export const useMealStore = create<MealStore>((set, get) => ({
  // 상태
  summaryData: null,
  isLoading: false,
  error: null,

  // 밥약 요약 데이터 가져오기
  fetchMealSummary: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch('/api/meals/summary');
      // const data = await response.json();
      
      // 임시 더미 데이터 (API 연동 전까지 사용)
      await new Promise(resolve => setTimeout(resolve, 1000)); // API 호출 시뮬레이션
      
      const dummyData: MealSummaryData = {
        participationCount: 12,
        savingsAmount: 47500,
      };
      
      set({ 
        summaryData: dummyData, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다',
        isLoading: false 
      });
    }
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