import { apiClient } from '@/src/shared/api/client';
import type { UpdateProfileRequest, AccountNoResponse, DepositRequest, DepositResponse } from '../model/types';

export const mypageApi = {
  // 프로필 이미지 업데이트
  updateProfile: async (request: UpdateProfileRequest) => {
    return apiClient.put('/api/user/update-profile', request);
  },

  // 계좌번호 조회
  getAccountNo: async (): Promise<{ success: boolean; data: AccountNoResponse; error?: string }> => {
    // Mock API - 실제 구현시 아래 주석 해제
    // return apiClient.get<AccountNoResponse>('/api/account/person/no');
    
    // 개발용 Mock API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const mockData: AccountNoResponse = {
        accountNo: '0883812793854573'
      };

      return {
        success: true,
        data: mockData
      };
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
    // Mock API - 실제 구현시 실제 엔드포인트로 변경
    // return apiClient.post<DepositResponse>('/api/account/deposit', request);
    
    // 개발용 Mock API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (request.amount <= 0) {
        throw new Error('입금액은 0보다 커야 합니다');
      }

      const mockResponse: DepositResponse = {
        success: true,
        message: `${request.amount.toLocaleString()}원이 입금되었습니다`
      };

      return {
        success: true,
        data: mockResponse
      };
    } catch (error) {
      return {
        success: false,
        data: { success: false, message: '' },
        error: error instanceof Error ? error.message : '입금 처리에 실패했습니다'
      };
    }
  }
};