// API 응답 타입
export interface SavingsPageResponse {
  savingsId: number;
  status: string;
  initiatorId: number;
  initiatorName: string;
  groupId: number;
  groupName: string;
  groupDescription: string;
  meetingDate: string;
  meetingTime: string;
  targetAmount: number;
  currentAmount: number;
  perHeadAmount: number;
  participantsCount: number;
  paidCount: number;
  savingsRound: number;
  participants: Array<{
    userId: number;
    userName: string;
    studentId: string;
    department: string;
    profileUrl: string;
    monthlyAmount: number;
    totalPaidAmount: number;
    isPaidThisMonth: boolean;
    status: string;
  }>;
  savingsHistory: Array<{
    round: number;
    date: string;
    totalAmount: number;
    paidCount: number;
    totalCount: number;
    participants: Array<{
      userId: number;
      userName: string;
      studentId: string;
      department: string;
      profileUrl: string;
      amount: number;
      isPaid: boolean;
      paidDate: string | null;
    }>;
  }>;
}

export interface SavingsHistoryItem {
  savingsId: string;
  round: number;
  date: string;
  amount: number;
  participants: Array<{
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
    isCompleted: boolean;
  }>;
}

export interface GroupInfo {
  groupId: string;
  title: string;
  date: string;
  memo: string;
  host: {
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  };
  participants: Array<{
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  }>;
  chatRoomId: string;
  savingsHistory: SavingsHistoryItem[];
}

export interface GroupInfoState {
  // 캐시된 그룹 정보들
  groupInfos: Map<string, GroupInfo>;
  
  // 로딩 상태들
  loadingStates: Map<string, boolean>;
  
  // 액션들
  loadGroupInfo: (groupId: string, useSavingsApi?: boolean) => Promise<GroupInfo | null>;
  getGroupInfo: (groupId: string) => GroupInfo | null;
  isLoading: (groupId: string) => boolean;
  clearGroupInfo: (groupId: string) => void;
  clearAllGroupInfos: () => void;
}