import { create } from 'zustand';
import { compareTimetables } from '../../../shared/api/timetableCompareApi';

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
      // 실제 API 호출
      const userIdList = selectedFriends.map(f => parseInt(f.id));
      
      console.log('📋 선택된 친구들:', selectedFriends);
      console.log('📋 친구들의 ID:', selectedFriends.map(f => f.id));
      console.log('📋 변환된 userIdList:', userIdList);
      console.log('📋 API 요청 데이터:', { userIdList, day: selectedDate.date });
      
      const response = await compareTimetables({
        userIdList,
        day: selectedDate.date
      });
      
      if (response.success && response.data) {
        console.log('📋 Store에서 받은 API 데이터:', response.data);
        console.log('📋 타임슬롯 개수:', response.data.timeslots.length);
        console.log('📋 첫 번째 타임슬롯:', response.data.timeslots[0]);
        
        // API 응답을 UI에 맞는 형태로 변환
        const timeSlots: TimeSlotData[] = response.data.timeslots.map((slot, index) => {
          console.log(`📋 슬롯 ${index}: `, slot);
          console.log(`📋 슬롯 ${index} availablePeopleName:`, slot.availablePeopleName);
          console.log(`📋 슬롯 ${index} availablePeopleName 타입:`, typeof slot.availablePeopleName);
          
          // 선택된 친구 전원이 공강인지 확인
          const isAllAvailable = slot.availablePeopleName.length === selectedFriends.length;
          
          return {
            time: slot.startTime.substring(0, 5), // "09:00:00" -> "09:00"
            availableFriends: slot.availablePeopleName,
            isAllAvailable
          };
        });
        
        console.log('📋 변환된 timeSlots:', timeSlots);
        
        // 공강인 친구가 있는 시간대만 필터링 (적어도 1명 이상)
        const availableTimeSlots = timeSlots.filter(slot => 
          slot.availableFriends.length > 0
        );
        
        console.log('📋 필터링된 availableTimeSlots:', availableTimeSlots);
        
        set({ 
          availableTimeSlots,
          isLoadingTimeSlots: false 
        });
      } else {
        throw new Error(response.error || '시간표 비교 실패');
      }
    } catch (error) {
      console.error('시간표 대조 오류:', error);
      
      // 에러 발생시 기존 더미 데이터로 폴백
      const selectedFriendNames = selectedFriends.map(f => f.name);
      
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
      
      const relevantTimeSlots = allTimeSlots
        .filter(slot => 
          slot.availableFriends.some(friendName => selectedFriendNames.includes(friendName))
        )
        .map(slot => {
          const availableFriends = slot.availableFriends.filter(friendName => 
            selectedFriendNames.includes(friendName)
          );
          
          const isAllAvailable = availableFriends.length === selectedFriends.length;
          
          return {
            time: slot.time,
            availableFriends,
            isAllAvailable
          };
        });
      
      set({ 
        availableTimeSlots: relevantTimeSlots,
        isLoadingTimeSlots: false,
        error: error instanceof Error ? error.message : '시간표를 불러오는데 실패했습니다'
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