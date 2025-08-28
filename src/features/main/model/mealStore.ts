import { storage } from '@/src/shared/lib/storage';
import { create } from 'zustand';
import { mypageApi } from '../../mypage/api/mypageApi';
import { mainApi } from '../api/mainApi';
import type { MainPageData } from '../types';

export interface MealSummaryData {
  participationCount: number;  // 밥약 만들기 참여 횟수
  groupParticipationCount: number; // 그룹 만들기 참여 횟수
  accountBalance: number;       // 내 계좌 잔액
}

interface MealState {
  summaryData: MealSummaryData | null;
  mainPageData: MainPageData;
  isLoading: boolean;
  error: string | null;
}

interface MealActions {
  fetchMealSummary: () => Promise<void>;
  fetchMainPageData: () => Promise<void>;
  setMealSummary: (data: MealSummaryData) => void;
  clearError: () => void;
}

type MealStore = MealState & MealActions;

export const useMealStore = create<MealStore>((set, get) => ({
  // 상태
  summaryData: null,
  mainPageData: {
    userInfo: null,
    mealStatistics: null,
    accountBalance: null,
  },
  isLoading: false,
  error: null,

  // 메인페이지 데이터 가져오기 (3개 API 동시 호출)
  fetchMainPageData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = await storage.getUserId();
      if (!userId) {
        throw new Error('사용자 정보가 없습니다. 다시 로그인해주세요.');
      }

      // 3개 API 동시 호출
      const [userInfoResponse, mealStatsResponse, balanceResponse] = await Promise.allSettled([
        mypageApi.getUserInfo(userId),
        mainApi.getMealStatistics(),
        mainApi.getAccountBalance()
      ]);

      // 각 결과 처리
      const userInfo = userInfoResponse.status === 'fulfilled' && userInfoResponse.value.success 
        ? userInfoResponse.value.data : null;
      
      const mealStatistics = mealStatsResponse.status === 'fulfilled' && mealStatsResponse.value.success
        ? mealStatsResponse.value.data : null;
        
      const accountBalance = balanceResponse.status === 'fulfilled' && balanceResponse.value.success
        ? balanceResponse.value.data : null;

      // 기존 MealSummaryData 형태로도 변환
      const summaryData: MealSummaryData = {
        participationCount: mealStatistics?.mealAppointmentCount || 0,
        groupParticipationCount: mealStatistics?.regularMeetingCount || 0,
        accountBalance: parseInt(accountBalance?.balance || '0')
      };

      set({ 
        mainPageData: {
          userInfo: userInfo || null,
          mealStatistics: mealStatistics || null,
          accountBalance: accountBalance || null
        },
        summaryData,
        isLoading: false 
      });
    } catch (error) {
      console.error('메인페이지 데이터 로드 실패:', error);
      set({ 
        error: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다',
        isLoading: false 
      });
    }
  },

  // 밥약 요약 데이터 가져오기 (기존 호환성을 위해 유지)
  fetchMealSummary: async () => {
    await get().fetchMainPageData();
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