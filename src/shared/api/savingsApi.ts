import { apiClient } from './client';

// 적금 참가자 타입
export interface SavingsParticipant {
  userId: number;
  userName: string;
  amount: number;
  paid: boolean;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

// 적금 사이클 타입
export interface SavingsCycle {
  cycleNo: number;
  expectedAmount: number;
  actualAmount: number;
  participantsCount: number;
  paidCount: number;
  participants: SavingsParticipant[];
}

// 정기 모임 저금 페이지 타입
export interface SavingsPageResponse {
  mealAppointmentId: number;
  meetingName: string;
  appointmentDate: string;
  appointmentTime: string;
  creatorId: number;
  creatorName: string;
  savingsAccountId: number;
  accountNo: string;
  planId: number;
  perHeadBalance: number;
  currentCycle: number;
  totalCycles: number;
  planStatus: string;
  totalSavedAmount: number;
  participantsCount: number;
  cycles: SavingsCycle[];
}

// 정기 모임 저금 페이지 조회 API
export const savingsApi = {
  getSavingsPage: async (chatRoomId: string) => {
    const response = await apiClient.get<SavingsPageResponse>(`/savings/${chatRoomId}/page`);
    return response;
  }
};