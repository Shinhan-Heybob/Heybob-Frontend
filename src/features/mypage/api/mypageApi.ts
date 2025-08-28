import { apiClient } from '@/src/shared/api/client';
import type { UpdateProfileRequest, AccountNoResponse, DepositRequest, DepositResponse } from '../model/types';
import type { UserInfo } from '@/src/features/main/types';

export const mypageApi = {
  // 사용자 정보 조회
  getUserInfo: async (userId: number) => {
    return apiClient.get<UserInfo>(`/user/my`);
  },

  // 프로필 이미지 업데이트
  updateProfile: async (request: UpdateProfileRequest) => {
    return apiClient.put('/api/user/update-profile', request);
  },

  // 계좌번호 조회
  getAccountNo: async (): Promise<{ success: boolean; data: AccountNoResponse; error?: string }> => {
    try {
      const response = await apiClient.get<AccountNoResponse>('/account/personal/no');
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data as AccountNoResponse
        };
      } else {
        return {
          success: false,
          data: { accountNo: '' },
          error: response.error || '계좌번호를 불러오는데 실패했습니다'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: { accountNo: '' },
        error: error instanceof Error ? error.message : '계좌번호를 불러오는데 실패했습니다'
      };
    }
  },

  // 입금 처리
  deposit: async (request: DepositRequest): Promise<{ success: boolean; data: DepositResponse; error?: string }> => {
    try {
      if (request.amount <= 0) {
        return {
          success: false,
          data: { success: false, message: '' },
          error: '입금액은 0보다 커야 합니다'
        };
      }

      const response = await apiClient.post('/account/deposit', request);
      
      // 빈 객체 응답도 성공으로 처리
      if (response.success) {
        return {
          success: true,
          data: {
            success: true,
            message: `${request.amount.toLocaleString()}원이 입금되었습니다`
          }
        };
      } else {
        return {
          success: false,
          data: { success: false, message: '' },
          error: response.error || '입금 처리에 실패했습니다'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: { success: false, message: '' },
        error: error instanceof Error ? error.message : '입금 처리에 실패했습니다'
      };
    }
  }
};