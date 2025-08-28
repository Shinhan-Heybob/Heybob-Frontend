import { create } from 'zustand';
import { mainApi } from '../../main/api/mainApi';
import type { AccountBalance } from '../../main/types';

interface AccountState {
  balance: AccountBalance | null;
  isLoading: boolean;
  error: string | null;
}

interface AccountActions {
  fetchBalance: () => Promise<void>;
  setBalance: (balance: AccountBalance) => void;
  clearError: () => void;
  clearBalance: () => void;
}

type AccountStore = AccountState & AccountActions;

export const useAccountStore = create<AccountStore>((set, get) => ({
  // 상태
  balance: null,
  isLoading: false,
  error: null,

  // 계좌 잔고 가져오기
  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await mainApi.getAccountBalance();
      
      if (response.success && response.data) {
        set({ 
          balance: response.data, 
          isLoading: false,
          error: null 
        });
      } else {
        set({ 
          error: response.error || '계좌 잔고를 불러올 수 없습니다.',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('계좌 잔고 로드 실패:', error);
      set({ 
        error: error instanceof Error ? error.message : '계좌 잔고를 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 잔고 직접 설정
  setBalance: (balance: AccountBalance) => {
    set({ balance, error: null });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },

  // 잔고 정보 초기화
  clearBalance: () => {
    set({ balance: null, error: null });
  },
}));