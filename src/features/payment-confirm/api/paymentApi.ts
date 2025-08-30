import { apiClient } from '@/src/shared/api/client';

// 정산 참여 요청 타입
export interface PaymentParticipateRequest {
  messageId: string;
}

// 정산 참여 응답 타입 (빈 객체 대응)
export interface PaymentParticipateResponse {
  success?: boolean;
  message?: string;
  timestamp?: string;
}

export const paymentApi = {
  // 정산 참여 (결제)
  participatePayment: async (
    chatRoomId: string, 
    request: PaymentParticipateRequest
  ): Promise<{ success: boolean; data?: PaymentParticipateResponse; error?: string }> => {
    try {
      const response = await apiClient.post<PaymentParticipateResponse>(
        `/api/settle/${chatRoomId}/pay`,
        request
      );
      
      // 빈 객체 응답도 성공으로 처리
      if (response.success) {
        return {
          success: true,
          data: response.data || {
            success: true,
            message: '정산이 완료되었습니다',
            timestamp: new Date().toISOString()
          }
        };
      } else {
        return {
          success: false,
          error: response.error || '정산 참여에 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Payment Participate API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '정산 참여 중 오류가 발생했습니다'
      };
    }
  }
};