import { create } from 'zustand';

// 친구 정보 타입 (meal store와 동일)
export interface Friend {
  id: string;
  name: string;
  studentId: string;
  department: string;
  avatarId: string;
}

// 선택된 날짜 타입
export interface SelectedDate {
  date: string;        // "2024-03-25"
  dayOfWeek: string;   // "월요일"
}

// 모임 기본 정보 타입
export interface GroupBasicInfo {
  title: string;        // 모임 제목
  description: string;  // 모임 설명
}

// 적금 정보 타입
export interface SavingsInfo {
  amountPerPerson: number;    // 1인당 금액
  totalAmount: number;        // 총 목표 금액
  startDate: string;          // 적금 시작일
  endDate: string;            // 적금 만료일
  interestRate: string;       // 이자율
  paymentCycle: string;       // 납부 주기
}

interface GroupCreateState {
  // 선택된 날짜
  selectedDate: SelectedDate | null;
  
  // 선택된 친구들
  selectedFriends: Friend[];
  
  // 모임 기본 정보
  basicInfo: GroupBasicInfo | null;
  
  // 적금 정보
  savingsInfo: SavingsInfo | null;
  
  // 에러 상태
  error: string | null;
}

interface GroupCreateActions {
  // 날짜 선택
  setSelectedDate: (date: SelectedDate) => void;
  
  // 친구 추가/제거
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  clearFriends: () => void;
  
  // 모임 기본 정보 설정
  setBasicInfo: (info: GroupBasicInfo) => void;
  
  // 적금 정보 설정
  setSavingsInfo: (info: SavingsInfo) => void;
  
  // 1인당 금액 설정 (총 금액 자동 계산)
  setAmountPerPerson: (amount: number) => void;
  
  // 초기화
  resetGroupCreate: () => void;
  
  // 에러 처리
  clearError: () => void;
}

type GroupCreateStore = GroupCreateState & GroupCreateActions;

export const useGroupCreateStore = create<GroupCreateStore>((set, get) => ({
  // 초기 상태
  selectedDate: null,
  selectedFriends: [],
  basicInfo: null,
  savingsInfo: null,
  error: null,

  // 날짜 선택
  setSelectedDate: (date: SelectedDate) => {
    set({ selectedDate: date });
  },

  // 친구 추가
  addFriend: (friend: Friend) => {
    const { selectedFriends } = get();
    
    // 중복 체크
    if (selectedFriends.find(f => f.id === friend.id)) {
      return;
    }
    
    const newFriends = [...selectedFriends, friend];
    set({ selectedFriends: newFriends });
    
    // 1인당 금액이 설정되어 있으면 총 금액 다시 계산
    const { savingsInfo } = get();
    if (savingsInfo && savingsInfo.amountPerPerson > 0) {
      const totalAmount = savingsInfo.amountPerPerson * (newFriends.length + 1);
      set({
        savingsInfo: {
          ...savingsInfo,
          totalAmount
        }
      });
    }
  },

  // 친구 제거
  removeFriend: (friendId: string) => {
    const { selectedFriends } = get();
    const newFriends = selectedFriends.filter(f => f.id !== friendId);
    set({ selectedFriends: newFriends });
    
    // 1인당 금액이 설정되어 있으면 총 금액 다시 계산
    const { savingsInfo } = get();
    if (savingsInfo && savingsInfo.amountPerPerson > 0) {
      const totalAmount = savingsInfo.amountPerPerson * (newFriends.length + 1);
      set({
        savingsInfo: {
          ...savingsInfo,
          totalAmount
        }
      });
    }
  },

  // 친구 목록 초기화
  clearFriends: () => {
    set({ selectedFriends: [] });
    
    // 총 금액도 다시 계산
    const { savingsInfo } = get();
    if (savingsInfo && savingsInfo.amountPerPerson > 0) {
      set({
        savingsInfo: {
          ...savingsInfo,
          totalAmount: savingsInfo.amountPerPerson // 본인만 남음
        }
      });
    }
  },

  // 모임 기본 정보 설정
  setBasicInfo: (info: GroupBasicInfo) => {
    set({ basicInfo: info });
  },

  // 적금 정보 설정
  setSavingsInfo: (info: SavingsInfo) => {
    set({ savingsInfo: info });
  },

  // 1인당 금액 설정 (적금 이자 계산 포함)
  setAmountPerPerson: (amount: number) => {
    const { selectedFriends } = get();
    const totalMembers = selectedFriends.length + 1; // 선택된 친구 수 + 본인
    
    // 적금 조건
    const weeklyPayment = amount; // 1인당 주간 납부액
    const weeks = 12; // 3개월 = 12주
    const annualRate = 0.05; // 연이율 5%
    const weeklyRate = annualRate / 52; // 주간 이율
    
    // 적금 복리 계산 (1인 기준)
    // 적금 공식: P * [((1+r)^n - 1) / r] * (1+r)
    // P: 주간 납부액, r: 주간 이율, n: 납부 횟수
    const futureValuePerPerson = weeklyPayment * 
      (((Math.pow(1 + weeklyRate, weeks) - 1) / weeklyRate) * (1 + weeklyRate));
    
    // 전체 인원의 총 수령액
    const totalAmount = Math.floor(futureValuePerPerson * totalMembers);
    
    // 오늘 날짜 계산
    const today = new Date();
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // 3개월 후 날짜 계산
    const getDateAfterMonths = (months: number) => {
      const futureDate = new Date(today);
      futureDate.setMonth(futureDate.getMonth() + months);
      return futureDate;
    };

    const newSavingsInfo: SavingsInfo = {
      amountPerPerson: amount,
      totalAmount: totalAmount,
      startDate: formatDate(today),
      endDate: formatDate(getDateAfterMonths(3)),
      interestRate: '5%',
      paymentCycle: '일주일'
    };

    set({ savingsInfo: newSavingsInfo });
  },

  // 전체 초기화
  resetGroupCreate: () => {
    set({
      selectedDate: null,
      selectedFriends: [],
      basicInfo: null,
      savingsInfo: null,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));