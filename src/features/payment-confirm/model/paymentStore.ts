import type { MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';
import { mealInfoApi } from '@/src/features/meal-info/api/mealInfoApi';
import { create } from 'zustand';
import { paymentApi } from '../api/paymentApi';

interface PaymentState {
  // 밥약 정보
  mealInfo: MealInfo | null;
  isMealInfoLoading: boolean;
  
  // 정산 정보
  roomId: string | null;
  amount: number | null;
  
  // API 호출 상태
  isProcessing: boolean;
  
  // 에러 상태
  error: string | null;
}

interface PaymentActions {
  // 밥약 정보 로드
  loadMealInfo: (roomId: string) => Promise<void>;
  
  // 정산 정보 설정
  setPaymentInfo: (roomId: string, amount: number) => void;
  
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
  roomId: null,
  amount: null,
  isProcessing: false,
  error: null,

  // 밥약 정보 로드
  loadMealInfo: async (roomId: string) => {
    set({ isMealInfoLoading: true, error: null });
    
    try {
      const response = await mealInfoApi.getMealAppointmentInfo(roomId);
      
      if (response.success && response.data) {
        // API 응답을 MealInfo 타입으로 변환
        const mealInfo: MealInfo = {
          hostName: response.data.host.name,
          hostDepartment: response.data.host.department,
          hostStudentId: response.data.host.studentId,
          hostAvatarId: response.data.host.profileUrl || 'avatar_01',
          mealTitle: response.data.title,
        };
        
        set({ 
          mealInfo,
          isMealInfoLoading: false 
        });
      } else {
        throw new Error(response.error || '밥약 정보를 불러오는데 실패했습니다');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '밥약 정보를 불러오는데 실패했습니다',
        isMealInfoLoading: false 
      });
    }
  },

  // 정산 정보 설정
  setPaymentInfo: (roomId: string, amount: number) => {
    set({ roomId, amount });
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
    const { roomId, amount } = get();
    
    if (!roomId || !amount) {
      set({ error: '정산 정보가 없습니다' });
      return false;
    }
    
    set({ isProcessing: true, error: null });
    
    try {
      const result = await paymentApi.participatePayment(roomId, {
        messageId
      });
      
      if (result.success) {
        set({ isProcessing: false });
        return true;
      } else {
        set({ 
          error: result.error || '정산 처리에 실패했습니다',
          isProcessing: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '정산 처리에 실패했습니다',
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
      roomId: null,
      amount: null,
      isProcessing: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));