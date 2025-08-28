import type { UserInfo } from '@/src/features/main/types';
import { apiClient } from '@/src/shared/api/client';
import type { AccountNoResponse, DepositRequest, DepositResponse, UpdateProfileRequest } from '../model/types';

export const mypageApi = {
  // 사용자 정보 조회
  getUserInfo: async (userId: number) => {
    return apiClient.get<UserInfo>(`/user/${userId}`);
  },

  // 프로필 이미지 업데이트
  updateProfile: async (request: UpdateProfileRequest) => {
    return apiClient.put('/api/user/update-profile', request);
  },

  // 계좌번호 조회
  getAccountNo: async (): Promise<{ success: boolean, data?: AccountNoResponse; error?: string }> => {
    try {
      const res = await apiClient.get<AccountNoResponse>('/account/person/no');
      
      if (!res.data) {
        throw new Error(res.error || 'Failed to get user account');
      };
      
      return {
        success: res.success,
        data: res.data
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get user account"
      };
    }
  },

  // 입금 처리
  deposit: async (request: DepositRequest): Promise<{ success: boolean; data?: DepositResponse; error?: string }> => {
    try {
      const res = await apiClient.post<DepositResponse>('/account/deposit', request);

      if(!res.success || !res.data) {
        throw new Error(res.error || '입금 처리에 실패했습니다');
      }

      return {
        success: true,
        data: res.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message: '입금 처리에 실패했습니다'
      };
    }


    
  }
};