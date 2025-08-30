import { apiClient } from '@/src/shared/api/client';

// 적금 참여 요청 타입
export interface SavingsParticipateRequest {
  messageId: string;
}

// 적금 참여 응답 타입 (빈 객체 대응)
export interface SavingsParticipateResponse {
  success?: boolean;
  message?: string;
  timestamp?: string;
}

export const savingsApi = {
  // 적금 참여 (입금)
  participateSavings: async (
    chatRoomId: string, 
    request: SavingsParticipateRequest
  ): Promise<{ success: boolean; data?: SavingsParticipateResponse; error?: string }> => {
    try {
      const response = await apiClient.post<SavingsParticipateResponse>(
        `/savings/${chatRoomId}/pay`,
        request
      );
      
      // 빈 객체 응답도 성공으로 처리
      if (response.success) {
        return {
          success: true,
          data: response.data || {
            success: true,
            message: '적금 참여가 완료되었습니다',
            timestamp: new Date().toISOString()
          }
        };
      } else {
        return {
          success: false,
          error: response.error || '적금 참여에 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Savings Participate API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '적금 참여 중 오류가 발생했습니다'
      };
    }
  }
};