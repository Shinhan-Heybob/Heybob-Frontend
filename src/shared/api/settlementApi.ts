import { apiClient } from './client';

// 밥약 정산 페이지 타입
export interface SettlementParticipant {
  userId: number;
  userName: string;
  amount: number;
  paid: boolean;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface SettlementPageResponse {
  settlementId: number | null;
  status: string | null;
  initiatorId: number | null;
  initiatorName: string | null;
  mealAppointmentId: number;
  mealName: string;
  appointmentDate: string;
  appointmentTime: string;
  totalAmount: number;
  perHeadAmount: number;
  participantsCount: number;
  paidCount: number;
  participants: SettlementParticipant[];
}

// 밥약 정산 페이지 조회 API
export const settlementApi = {
  getSettlementPage: async (chatRoomId: string) => {
    const response = await apiClient.get<SettlementPageResponse>(`/settle/${chatRoomId}/page`);
    return response;
  }
};