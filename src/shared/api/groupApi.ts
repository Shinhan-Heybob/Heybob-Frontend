import { apiClient, type ApiResponse } from './client';
import type { GroupInfo, SavingsHistoryItem } from '@/src/features/group-info/model/types';

// 정기 모임 생성 요청 타입
export interface CreateRegularMeetingRequest {
  name: string;
  memo?: string;
  appointmentDate: string;
  appointmentTime: string;
  participantIds: number[];
  mealType: 'REGULAR_MEETING';
}

// 정기 모임 생성 응답 타입
export interface CreateRegularMeetingResponse {
  id: number;
}

// 적금 계좌 생성 요청 타입
export interface CreateSavingsAccountRequest {
  perHeadBalance: number;
  totalAmount: number;
}

// 모임 상세 조회 응답 타입
export interface MeetingDetailResponse {
  id: number;
  name: string;
  memo: string;
  appointmentDate: string;
  appointmentTime: string;
  chatRoomId: string;
  creator: {
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
}

class GroupApiService {
  async getGroupInfo(groupId: string): Promise<GroupInfo> {
    // TODO: 백엔드 준비되면 실제 API 호출로 교체
    // const response = await apiClient.get<GroupInfo>(`/groups/${groupId}/info`);
    // 
    // if (!response.success || !response.data) {
    //   throw new Error(response.error || '모임 정보를 불러올 수 없습니다');
    // }
    // 
    // return response.data;

    // 현재: 목 데이터 반환 (개발용)
    await new Promise(resolve => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

    const mockGroupInfo: GroupInfo = {
      groupId,
      title: '공통주택 모임',
      date: '2025-07-28',
      memo: '우리 모두 함께 모아요!',
      host: {
        name: '김지은',
        studentId: '1913998',
        department: '경영학과',
        profileUrl: 'avatar_01'
      },
      participants: [
        {
          name: '이지민',
          studentId: '1326123',
          department: '경영학과',
          profileUrl: 'avatar_02'
        },
        {
          name: '김미림',
          studentId: '234123',
          department: '경영학과',
          profileUrl: 'avatar_01'
        },
        {
          name: '이예린',
          studentId: '1326123',
          department: '경영학과',
          profileUrl: 'avatar_02'
        },
        {
          name: '박재은',
          studentId: '234123',
          department: '경영학과',
          profileUrl: 'avatar_01'
        }
      ],
      chatRoomId: 'group_456',
      savingsHistory: [
        // 최신 회차가 맨 위로 (5회차)
        {
          savingsId: 'savings_5',
          round: 5,
          date: '2025-07-25',
          amount: 26000,
          participants: [
            {
              name: '김지은',
              studentId: '1913998',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '이지민',
              studentId: '1326123',
              department: '경영학과',
              profileUrl: 'avatar_02',
              isCompleted: true
            },
            {
              name: '김미림',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: false
            },
            {
              name: '박재은',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            }
          ]
        },
        // 나머지는 오름차순 (1,2,3,4회차)
        {
          savingsId: 'savings_1',
          round: 1,
          date: '2025-06-25',
          amount: 26000,
          participants: [
            {
              name: '김지은',
              studentId: '1913998',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '이지민',
              studentId: '1326123',
              department: '경영학과',
              profileUrl: 'avatar_02',
              isCompleted: true
            },
            {
              name: '김미림',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '박재은',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            }
          ]
        },
        {
          savingsId: 'savings_2',
          round: 2,
          date: '2025-06-28',
          amount: 26000,
          participants: [
            {
              name: '김지은',
              studentId: '1913998',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '이지민',
              studentId: '1326123',
              department: '경영학과',
              profileUrl: 'avatar_02',
              isCompleted: true
            },
            {
              name: '김미림',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '박재은',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: false
            }
          ]
        },
        {
          savingsId: 'savings_3',
          round: 3,
          date: '2025-07-05',
          amount: 26000,
          participants: [
            {
              name: '김지은',
              studentId: '1913998',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '이지민',
              studentId: '1326123',
              department: '경영학과',
              profileUrl: 'avatar_02',
              isCompleted: true
            },
            {
              name: '김미림',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '박재은',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            }
          ]
        },
        {
          savingsId: 'savings_4',
          round: 4,
          date: '2025-07-15',
          amount: 26000,
          participants: [
            {
              name: '김지은',
              studentId: '1913998',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            },
            {
              name: '이지민',
              studentId: '1326123',
              department: '경영학과',
              profileUrl: 'avatar_02',
              isCompleted: true
            },
            {
              name: '김미림',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: false
            },
            {
              name: '박재은',
              studentId: '234123',
              department: '경영학과',
              profileUrl: 'avatar_01',
              isCompleted: true
            }
          ]
        }
      ]
    };

    return mockGroupInfo;
  }

  async updateGroupInfo(groupId: string, data: Partial<GroupInfo>): Promise<void> {
    // TODO: 백엔드 준비되면 실제 API 호출로 교체
    // const response = await apiClient.put(`/groups/${groupId}/info`, data);
    // 
    // if (!response.success) {
    //   throw new Error(response.error || '모임 정보 업데이트에 실패했습니다');
    // }

    // 현재: 목 구현 (개발용)
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Group ${groupId} updated:`, data);
  }

  async getSavingsHistory(groupId: string): Promise<SavingsHistoryItem[]> {
    // TODO: 백엔드 준비되면 실제 API 호출로 교체
    // const response = await apiClient.get<SavingsHistoryItem[]>(`/groups/${groupId}/savings-history`);
    // 
    // if (!response.success || !response.data) {
    //   throw new Error(response.error || '적금 히스토리를 불러올 수 없습니다');
    // }
    // 
    // return response.data;

    // 현재: 목 구현 (개발용)
    await new Promise(resolve => setTimeout(resolve, 300));
    const groupInfo = await this.getGroupInfo(groupId);
    return groupInfo.savingsHistory;
  }

  // 정기 모임 생성
  async createRegularMeeting(
    request: CreateRegularMeetingRequest
  ): Promise<{ success: boolean; data?: CreateRegularMeetingResponse; error?: string }> {
    try {
      const response = await apiClient.post<CreateRegularMeetingResponse>(
        '/meal-appointments',
        request
      );
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || '정기 모임 생성에 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Regular Meeting Create API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '정기 모임 생성 중 오류가 발생했습니다'
      };
    }
  }

  // 적금 계좌 생성
  async createSavingsAccount(
    chatId: string,
    request: CreateSavingsAccountRequest
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post(
        `/savings/${chatId}/create`,
        request
      );
      
      if (response.success) {
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: response.error || '적금 계좌 생성에 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Savings Account Create API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '적금 계좌 생성 중 오류가 발생했습니다'
      };
    }
  }

  // 모임 상세 조회 (chatRoomId 획득용)
  async getMeetingDetail(
    meetingId: number
  ): Promise<{ success: boolean; data?: MeetingDetailResponse; error?: string }> {
    try {
      const response = await apiClient.get<MeetingDetailResponse>(
        `/meal-appointments/${meetingId}`
      );
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || '모임 정보를 불러오는데 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Meeting Detail API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '모임 정보를 불러오는 중 오류가 발생했습니다'
      };
    }
  }
}

export const groupApi = new GroupApiService();