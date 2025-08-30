import { create } from 'zustand';
import { settlementApi } from '@/src/shared/api/settlementApi';
import type { MealDetailInfo, SettlementInfo, SettlementPageResponse } from './types';

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

  // 밥약 기본 정보 로드 (정산 API에서 데이터 추출)
  loadMealInfo: async (chatRoomId: string) => {
    set({ isMealInfoLoading: true, error: null });
    
    try {
      // 정산 API 호출
      const response = await settlementApi.getSettlementPage(chatRoomId);
      
      if (response.success && response.data) {
        const data = response.data;
        
        // participants에서 방장 정보 찾기
        const host = data.participants.find(p => p.userId === data.initiatorId);
        
        const mealInfo: MealDetailInfo = {
          mealId: chatRoomId,
          title: data.mealName,
          date: data.appointmentDate,
          time: data.appointmentTime,
          memo: '', // API에 메모 필드가 없음
          host: {
            id: data.initiatorId,
            name: data.initiatorName,
            studentId: host?.studentId || '',
            department: host?.department || '',
            profileUrl: host?.profileUrl || 'avatar_01'
          },
        };
        
        set({ 
          mealInfo,
          isMealInfoLoading: false 
        });
      } else {
        throw new Error('밥약 정보를 불러올 수 없습니다');
      }
    } catch (error) {
      console.error('밥약 정보 로드 실패:', error);
      set({ 
        error: error instanceof Error ? error.message : '밥약 정보를 불러오는데 실패했습니다',
        isMealInfoLoading: false 
      });
    }
  },

  // 정산 현황 정보 로드
  loadSettlementInfo: async (chatRoomId: string) => {
    set({ isSettlementLoading: true, error: null });
    
    try {
      // 정산 API 호출
      const response = await settlementApi.getSettlementPage(chatRoomId);
      
      if (response.success && response.data) {
        const data = response.data;
        
        const settlementInfo: SettlementInfo = {
          settlementId: data.settlementId,
          status: data.status,
          totalAmount: data.totalAmount,
          perHeadAmount: data.perHeadAmount,
          requestDate: data.appointmentDate,
          paidCount: data.paidCount,
          participantsCount: data.participantsCount,
          participants: data.participants.map(p => ({
            userId: p.userId,
            userName: p.userName,
            amount: p.amount,
            isPaid: p.paid,
            status: p.status,
            department: p.department,
            studentId: p.studentId,
            avatarId: p.profileUrl || 'avatar_01',
            isHost: p.userId === data.initiatorId // 방장 여부 확인
          }))
        };
        
        set({ 
          settlementInfo,
          isSettlementLoading: false 
        });
      } else {
        throw new Error('정산 정보를 불러올 수 없습니다');
      }
    } catch (error) {
      console.error('정산 정보 로드 실패:', error);
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