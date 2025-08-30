// API 응답 타입
export interface SettlementPageResponse {
  settlementId: number;
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED';
  initiatorId: number;
  initiatorName: string;
  mealAppointmentId: number;
  mealName: string;
  appointmentDate: string;
  appointmentTime: string;
  totalAmount: number;
  perHeadAmount: number;
  participantsCount: number;
  paidCount: number;
  participants: Array<{
    userId: number;
    userName: string;
    studentId: string;
    department: string;
    profileUrl: string;
    amount: number;
    paid: boolean;
    status: 'PENDING' | 'PAID' | 'FAILED';
  }>;
}

// Store에서 사용할 타입
export interface MealDetailInfo {
  mealId: string;
  title: string;
  date: string;
  time: string;
  memo?: string;
  host: {
    id: number;
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  };
}

export interface SettlementInfo {
  settlementId: number;
  status: string;
  totalAmount: number;
  perHeadAmount: number;
  requestDate: string;
  paidCount: number;
  participantsCount: number;
  participants: Array<{
    userId: number;
    userName: string;
    amount: number;
    isPaid: boolean;
    status: string;
    department: string;
    studentId: string;
    avatarId: string;
    isHost: boolean; // 방장 여부
  }>;
}