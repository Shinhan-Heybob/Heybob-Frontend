import { apiClient } from '@/src/shared/api/client';

/** ==== DTO (서버와 1:1 매칭) ==== */
export interface SettlementRequestDto {
  totalAmount: number;
  participantsUserIds: number[];
}

export interface SettlementCreateResponseDto {
  settlementId: number;
  perHead: number | null; // 서버가 null 줄 수도 있으니 런타임 방어만
}

export interface SettlementResponseDto {
  settlementId: number;
  initiatorId: number;
  initiatorName: string;
  perHeadAmount: number;
  totalAmount: number;
  participantsCount: number;
  isInitiator: boolean;
  isParticipant: boolean;
  myPaid: boolean | null;
}

export type SettlementStatus = 'PENDING' | 'COMPLETED' | 'CANCELED' | string; // enum 문자열로 수신

export interface SettlementParticipantItemDto {
  userId: number;
  userName: string;
  amount: number;
  paid: boolean;
  status: string; // "PENDING" | "SUCCESS" | "FAILED" | "CANCELED"
}

export interface SettlementPageResponseDto {
  settlementId: number;
  status: SettlementStatus;

  // 헤더
  initiatorId: number;
  initiatorName: string;

  // 모임(밥약) 정보
  mealAppointmentId: number;
  mealName: string;
  appointmentDate: string; // LocalDate → ISO 문자열로 온다고 가정
  appointmentTime: string; // LocalTime → "HH:mm:ss" 등 문자열

  // 금액/집계
  totalAmount: number;
  perHeadAmount: number;
  participantsCount: number;
  paidCount: number;

  // 참가자 목록
  participants: SettlementParticipantItemDto[];
}

/** ==== API - 모든 요청이 8080 포트로 ==== */
export const splitBillApi = {
  // POST /settle/{chatRoomId}/create - 8080 포트 (정산 생성)
  async createSettlement(chatRoomId: string | number, body: SettlementRequestDto) {
    console.log('🚀 [API] 정산 생성 요청 → 8080 포트');
    const res = await apiClient.post<SettlementCreateResponseDto>(`/settle/${chatRoomId}/create`, body);
    // res: ApiResponse<SettlementCreateResponseDto>
    if (!res.success || !res.data) throw new Error(res.error || 'CREATE_FAILED');
    return res.data; // <-- 언래핑된 DTO 반환
  },

  // PATCH /settle/{chatRoomId}/update - 8080 포트 (정산 수정)
   async updateSettlement(chatRoomId: string | number, body: SettlementRequestDto) {
    console.log('📝 [API] 정산 수정 요청 → 8080 포트');
    const res = await apiClient.patch<void>(`/settle/${chatRoomId}/update`, body);
    if (!res.success) throw new Error(res.error || 'UPDATE_FAILED');
    return true;
  },

  // GET /settle/{chatRoomId}/info - 8080 포트 (정산 정보 조회)
  async getSettlementInfo(chatRoomId: string | number) {
    console.log('📊 [API] 정산 정보 조회 → 8080 포트');
    const res = await apiClient.get<SettlementResponseDto>(`/settle/${chatRoomId}/info`);
    if (!res.success || !res.data) throw new Error(res.error || 'INFO_FAILED');
    return res.data; // <-- 언래핑
  },

  // POST /settle/{chatRoomId}/pay - 8080 포트 (내 분담금 결제)
  async paySettlement(chatRoomId: string | number) {
    console.log('💳 [API] 분담금 결제 요청 → 8080 포트');
    // ⚠️ 중요: 이 API는 body가 필요하지 않음 (PathVariable만 사용)
    const res = await apiClient.post<void>(`/settle/${chatRoomId}/pay`);
    if (!res.success) throw new Error(res.error || 'PAY_FAILED');
    return true;
  },

  // GET /settle/{chatRoomId}/page - 8080 포트 (페이지 데이터 조회)
   async getSettlementPage(chatRoomId: string | number) {
    console.log('📄 [API] 페이지 데이터 조회 → 8080 포트');
    const res = await apiClient.get<SettlementPageResponseDto>(`/settle/${chatRoomId}/page`);
    if (!res.success || !res.data) throw new Error(res.error || 'PAGE_FAILED');
    return res.data; // <-- 언래핑
  },
};