import { apiClient } from '@/src/shared/api/client';
import type { MealStatistics, AccountBalance } from '../types';

export const mainApi = {
  // 밥약 통계 조회
  getMealStatistics: async () => {
    return apiClient.get<MealStatistics>('/meal-appointments/statistics');
  },

  // 계좌 잔고 조회
  getAccountBalance: async () => {
    return apiClient.get<AccountBalance>('/account/personal/balance');
  }
};