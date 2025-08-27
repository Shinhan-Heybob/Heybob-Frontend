// 사용자 프로필 타입
export interface UserProfile {
  id: string;
  name: string;
  studentId: string;
  profileImage: string; // 아바타 이미지 경로
}

// 계좌 정보 타입
export interface AccountInfo {
  accountNo: string;
}

// 계좌번호 조회 API 응답 타입
export interface AccountNoResponse {
  accountNo: string;
}

// 프로필 업데이트 API 요청 타입
export interface UpdateProfileRequest {
  profileImage: string;
}

// 입금 API 요청 타입
export interface DepositRequest {
  amount: number;
}

// 입금 API 응답 타입
export interface DepositResponse {
  success: boolean;
  message: string;
}