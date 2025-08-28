// 사용자 정보 응답 타입
export interface UserInfo {
  id: number;
  name: string;
  studentId: string;
  profileUrl: string;
  university: string;
  department: string;
}

// 밥약 통계 응답 타입
export interface MealStatistics {
  userId: number;
  mealAppointmentCount: number;
  regularMeetingCount: number;
  totalCount: number;
}

// 계좌 잔고 응답 타입
export interface AccountBalance {
  balance: string;
}

// 메인페이지에서 사용할 통합 데이터 타입
export interface MainPageData {
  userInfo: UserInfo | null;
  mealStatistics: MealStatistics | null;
  accountBalance: AccountBalance | null;
}