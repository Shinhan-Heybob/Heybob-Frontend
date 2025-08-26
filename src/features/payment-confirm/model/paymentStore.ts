import type { MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';
import { create } from 'zustand';

interface PaymentState {
  // 밥약 정보
  mealInfo: MealInfo | null;
  isMealInfoLoading: boolean;
  
  // API 호출 상태
  isProcessing: boolean;
  
  // 에러 상태
  error: string | null;
}

interface PaymentActions {
  // 밥약 정보 로드
  loadMealInfo: (roomId: string) => Promise<void>;
  
  // 결제 취소
  cancelPayment: (messageId: string) => Promise<boolean>;
  
  // 결제 확정
  confirmPayment: (messageId: string) => Promise<boolean>;
  
  // 상태 초기화
  reset: () => void;
  clearError: () => void;
}

type PaymentStore = PaymentState & PaymentActions;

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  // 초기 상태
  mealInfo: null,
  isMealInfoLoading: false,
  isProcessing: false,
  error: null,

  // 밥약 정보 로드
  loadMealInfo: async (roomId: string) => {
    set({ isMealInfoLoading: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch(`${baseURL}/api/meals/${roomId}/info`);
      // const data = await response.json();
      
      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockMealInfo: MealInfo = {
        hostName: '김지은',
        hostDepartment: '경영학과',
        hostStudentId: '1913998',
        hostAvatarId: 'avatar_01',
        mealTitle: '학식 먹으러 가는 팟',
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

  // 결제 취소
  cancelPayment: async (messageId: string) => {
    set({ isProcessing: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch(`${baseURL}/api/payments/${messageId}/cancel`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // if (!response.ok) {
      //   throw new Error('결제 취소에 실패했습니다');
      // }
      
      // 임시 성공 처리
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ isProcessing: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '결제 취소에 실패했습니다',
        isProcessing: false 
      });
      return false;
    }
  },

  // 결제 확정
  confirmPayment: async (messageId: string) => {
    set({ isProcessing: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch(`${baseURL}/api/payments/${messageId}/confirm`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // if (!response.ok) {
      //   throw new Error('결제 처리에 실패했습니다');
      // }
      
      // 임시 성공 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ isProcessing: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '결제 처리에 실패했습니다',
        isProcessing: false 
      });
      return false;
    }
  },

  // 상태 초기화
  reset: () => {
    set({
      mealInfo: null,
      isMealInfoLoading: false,
      isProcessing: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));