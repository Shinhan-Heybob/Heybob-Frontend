import { apiClient } from './client';
import type { ChatListItem, ChatListApiResponse, ChatStatus, ChatType } from '@/src/features/chat-list/model/types';
import { convertApiResponseToItem } from '@/src/features/chat-list/model/types';

export const chatListApi = {
  // 실제 API 호출
  getChatList: async (userId: number, status: ChatStatus, type: ChatType) => {
    const queryParams = new URLSearchParams();
    
    // status는 항상 파라미터로 추가 (active 또는 inactive)
    queryParams.append('status', status);
    
    // type이 'all'이 아닌 경우만 파라미터로 추가  
    if (type !== 'all') {
      queryParams.append('type', type);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/meal-appointments/list?${queryString}` : '/meal-appointments/list';
    
    const response = await apiClient.get<ChatListApiResponse[]>(endpoint);
    
    // API 응답을 클라이언트 타입으로 변환
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(convertApiResponseToItem)
      };
    }
    
    return response as any;
  },

  // 개발용 Mock API
  getMockChatList: async (userId: number, status: ChatStatus, type: ChatType): Promise<{ success: boolean; data: ChatListItem[]; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const mockData: ChatListItem[] = [
        {
          id: 1,
          name: '🍱 학식 같이 먹어요!',
          creatorName: '김민수',
          creatorStudentId: '20201234',
          creatorDepartment: '컴퓨터공학과',
          chatRoomId: 100,
          appointmentDate: '2024-12-27',
          appointmentTime: '12:00:00',
          mealType: 'MEAL_APPOINTMENT',
          isActive: true
        },
        {
          id: 2,
          name: '🍕 피자 먹으러 가실 분~',
          creatorName: '이지은',
          creatorStudentId: '20195678',
          creatorDepartment: '경영학과',
          chatRoomId: 101,
          appointmentDate: '2024-12-27',
          appointmentTime: '18:30:00',
          mealType: 'MEAL_APPOINTMENT',
          isActive: true
        },
        {
          id: 3,
          name: '🍜 라면 끓여먹을 사람!',
          creatorName: '박서준',
          creatorStudentId: '20219999',
          creatorDepartment: '기계공학과',
          chatRoomId: 102,
          appointmentDate: '2024-12-28',
          appointmentTime: '21:00:00',
          mealType: 'MEAL_APPOINTMENT',
          isActive: true
        },
        {
          id: 4,
          name: '🥗 샐러드 같이 드실분',
          creatorName: '최유진',
          creatorStudentId: '20207777',
          creatorDepartment: '생명과학과',
          chatRoomId: 103,
          appointmentDate: '2024-12-26',
          appointmentTime: '12:30:00',
          mealType: 'MEAL_APPOINTMENT',
          isActive: false
        },
        {
          id: 5,
          name: '🍗 치킨 파티 하실분!!',
          creatorName: '장동건',
          creatorStudentId: '20183333',
          creatorDepartment: '전자공학과',
          chatRoomId: 104,
          appointmentDate: '2024-12-25',
          appointmentTime: '19:30:00',
          mealType: 'MEAL_APPOINTMENT',
          isActive: false
        },
        {
          id: 6,
          name: '📚 스터디 모임',
          creatorName: '김하늘',
          creatorStudentId: '20202222',
          creatorDepartment: '수학과',
          chatRoomId: 105,
          appointmentDate: '2024-12-29',
          appointmentTime: '14:00:00',
          mealType: 'REGULAR_MEETING',
          isActive: true
        },
        {
          id: 7,
          name: '⚽ 축구 동아리',
          creatorName: '이승우',
          creatorStudentId: '20216666',
          creatorDepartment: '체육학과',
          chatRoomId: 106,
          appointmentDate: '2024-12-30',
          appointmentTime: '16:00:00',
          mealType: 'REGULAR_MEETING',
          isActive: true
        },
        {
          id: 8,
          name: '🎵 밴드 연습',
          creatorName: '박지민',
          creatorStudentId: '20194444',
          creatorDepartment: '음악학과',
          chatRoomId: 107,
          appointmentDate: '2024-12-24',
          appointmentTime: '20:00:00',
          mealType: 'REGULAR_MEETING',
          isActive: false
        },
        {
          id: 9,
          name: '🍱 기숙사 같이 밥먹기',
          creatorName: '정수아',
          creatorStudentId: '20225555',
          creatorDepartment: '화학과',
          chatRoomId: 108,
          appointmentDate: '2024-12-27',
          appointmentTime: '11:30:00',
          mealType: 'MEAL_APPOINTMENT',
          isActive: true
        },
        {
          id: 10,
          name: '☕ 카페 스터디',
          creatorName: '윤도현',
          creatorStudentId: '20188888',
          creatorDepartment: '국어국문학과',
          chatRoomId: 109,
          appointmentDate: '2024-12-31',
          appointmentTime: '15:30:00',
          mealType: 'REGULAR_MEETING',
          isActive: true
        }
      ];

      // 필터 적용
      let filteredData = mockData;

      // status 필터 적용 (이제 'all'은 없음)
      filteredData = filteredData.filter(item => 
        status === 'active' ? item.isActive : !item.isActive
      );

      if (type !== 'all') {
        filteredData = filteredData.filter(item => item.mealType === type);
      }

      return {
        success: true,
        data: filteredData
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다'
      };
    }
  }
};