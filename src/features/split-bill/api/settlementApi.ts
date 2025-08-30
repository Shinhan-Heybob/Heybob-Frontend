import { apiClient } from '@/src/shared/api/client';

// 정산 요청 타입 (amountPerPerson 제거됨)
export interface CreateSettlementRequest {
  totalAmount: number;
  participantIds: string[];
  description?: string;
}

// 정산 응답 타입
export interface CreateSettlementResponse {
  settlementId: string;
  chatRoomId: string;
  totalAmount: number;
  participantCount: number;
  createdAt: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export const settlementApi = {
  // 정산 생성 요청
  createSettlement: async (
    chatRoomId: string, 
    request: CreateSettlementRequest
  ): Promise<{ success: boolean; data?: CreateSettlementResponse; error?: string }> => {
    try {
      const response = await apiClient.post<CreateSettlementResponse>(
        `/api/settle/${chatRoomId}/create`,
        request
      );
      
      // 빈 객체 응답도 성공으로 처리
      if (response.success) {
        return {
          success: true,
          data: response.data || {
            settlementId: `settlement_${Date.now()}`,
            chatRoomId: chatRoomId,
            totalAmount: request.totalAmount,
            participantCount: request.participantIds.length,
            createdAt: new Date().toISOString(),
            status: 'PENDING' as const
          }
        };
      } else {
        return {
          success: false,
          error: response.error || '정산 생성에 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Settlement API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '정산 생성 중 오류가 발생했습니다'
      };
    }
  },

  // 정산 취소 (필요시 사용)
  cancelSettlement: async (
    chatRoomId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post(`/api/settle/${chatRoomId}/cancel`);
      
      if (response.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || '정산 취소에 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Cancel Settlement API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '정산 취소 중 오류가 발생했습니다'
      };
    }
  }
};