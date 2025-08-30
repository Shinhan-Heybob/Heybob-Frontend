import { apiClient } from './client';
import type { SettlementPageResponse } from '@/src/features/meal-info-detail/model/types';

// 타입은 meal-info-detail/model/types.ts에서 import

// 밥약 정산 페이지 조회 API
export const settlementApi = {
  getSettlementPage: async (chatRoomId: string) => {
    const response = await apiClient.get<SettlementPageResponse>(`/settle/${chatRoomId}/page`);
    return response;
  }
};