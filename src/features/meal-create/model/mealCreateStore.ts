import { create } from 'zustand';

// 친구 정보 타입
export interface Friend {
  id: string;
  name: string;
  studentId: string;
  department: string;
  avatarId: string;
}

// 시간대 정보 타입 (백엔드 데이터 구조)
export interface TimeSlotData {
  time: string;                    // "11:30"
  availableFriends: string[];      // ["이예린(23)", "헤이영(25)"]
  isAllAvailable: boolean;         // 전원 공강 여부
}

// 선택된 시간대 타입
export interface SelectedTimeSlot {
  time: string;
  dayOfWeek: string;
}

// 선택된 날짜 타입
export interface SelectedDate {
  date: string;        // "2024-03-25"
  dayOfWeek: string;   // "월요일"
}

interface MealCreateState {
  // 선택된 날짜
  selectedDate: SelectedDate | null;
  
  // 선택된 친구들
  selectedFriends: Friend[];
  
  // 공강 시간대 목록
  availableTimeSlots: TimeSlotData[];
  
  // 선택된 시간대
  selectedTimeSlot: SelectedTimeSlot | null;
  
  // 로딩 상태
  isLoadingTimeSlots: boolean;
  
  // 에러 상태
  error: string | null;
}

interface MealCreateActions {
  // 날짜 선택
  setSelectedDate: (date: SelectedDate) => void;
  
  // 친구 추가/제거
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  clearFriends: () => void;
  
  // 시간표 대조 (디바운싱 포함)
  fetchAvailableTimeSlots: () => Promise<void>;
  
  // 시간대 선택
  setSelectedTimeSlot: (timeSlot: SelectedTimeSlot) => void;
  
  // 초기화
  resetMealCreate: () => void;
  
  // 에러 처리
  clearError: () => void;
}

type MealCreateStore = MealCreateState & MealCreateActions;

// 디바운싱을 위한 타이머 저장
let debounceTimer: number | null = null;

export const useMealCreateStore = create<MealCreateStore>((set, get) => ({
  // 초기 상태
  selectedDate: null,
  selectedFriends: [],
  availableTimeSlots: [],
  selectedTimeSlot: null,
  isLoadingTimeSlots: false,
  error: null,

  // 날짜 선택
  setSelectedDate: (date: SelectedDate) => {
    set({ selectedDate: date });
    
    // 날짜 변경시 시간표 다시 계산
    const { selectedFriends, fetchAvailableTimeSlots } = get();
    if (selectedFriends.length > 0) {
      fetchAvailableTimeSlots();
    }
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
    
    // 디바운싱된 시간표 계산
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
      get().fetchAvailableTimeSlots();
    }, 500);
  },

  // 친구 제거
  removeFriend: (friendId: string) => {
    const { selectedFriends } = get();
    const newFriends = selectedFriends.filter(f => f.id !== friendId);
    set({ selectedFriends: newFriends, selectedTimeSlot: null });
    
    // 친구가 없으면 시간표 초기화
    if (newFriends.length === 0) {
      set({ availableTimeSlots: [] });
      return;
    }
    
    // 디바운싱된 시간표 계산
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
      get().fetchAvailableTimeSlots();
    }, 500);
  },

  // 친구 목록 초기화
  clearFriends: () => {
    set({ 
      selectedFriends: [], 
      availableTimeSlots: [], 
      selectedTimeSlot: null 
    });
  },

  // 시간표 대조 API
  fetchAvailableTimeSlots: async () => {
    const { selectedDate, selectedFriends } = get();
    
    if (!selectedDate || selectedFriends.length === 0) {
      set({ availableTimeSlots: [] });
      return;
    }
    
    set({ isLoadingTimeSlots: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // const response = await fetch('/api/schedules/available-times', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     date: selectedDate.date,
      //     friendIds: selectedFriends.map(f => f.id)
      //   })
      // });
      // const data = await response.json();
      
      // 임시 더미 데이터 (API 연동 전까지 사용)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 선택된 친구 이름 목록
      const selectedFriendNames = selectedFriends.map(f => f.name);
      
      // 더미 시간표 데이터 (실제로는 API에서 받아올 데이터)
      const allTimeSlots = [
        { time: '11:30', availableFriends: ['지예은', '박재준'] },
        { time: '12:00', availableFriends: ['지예은', '박재준', '김민수'] },
        { time: '12:30', availableFriends: ['지예은', '박재준'] },
        { time: '13:00', availableFriends: ['김민수'] },
        { time: '13:30', availableFriends: ['이수현'] },
        { time: '14:00', availableFriends: ['지예은', '박재준', '김민수'] },
        { time: '14:30', availableFriends: ['지예은', '박재준', '김민수'] },
        { time: '15:00', availableFriends: ['지예은', '이수현'] },
      ];
      
      // 선택된 친구 중 적어도 한 명이 공강인 시간대만 필터링
      const relevantTimeSlots = allTimeSlots
        .filter(slot => 
          slot.availableFriends.some(friendName => selectedFriendNames.includes(friendName))
        )
        .map(slot => {
          // 실제로 선택된 친구 중 공강인 친구들만 표시
          const availableFriends = slot.availableFriends.filter(friendName => 
            selectedFriendNames.includes(friendName)
          );
          
          // 선택된 친구 전원이 공강인지 확인
          const isAllAvailable = availableFriends.length === selectedFriends.length;
          
          return {
            time: slot.time,
            availableFriends,
            isAllAvailable
          };
        });
      
      const dummyTimeSlots: TimeSlotData[] = relevantTimeSlots;
      
      set({ 
        availableTimeSlots: dummyTimeSlots,
        isLoadingTimeSlots: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '시간표를 불러오는데 실패했습니다',
        isLoadingTimeSlots: false 
      });
    }
  },

  // 시간대 선택
  setSelectedTimeSlot: (timeSlot: SelectedTimeSlot) => {
    set({ selectedTimeSlot: timeSlot });
  },

  // 전체 초기화
  resetMealCreate: () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    set({
      selectedDate: null,
      selectedFriends: [],
      availableTimeSlots: [],
      selectedTimeSlot: null,
      isLoadingTimeSlots: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));