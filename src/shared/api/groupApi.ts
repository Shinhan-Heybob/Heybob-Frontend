import { apiClient, type ApiResponse } from './client';
import type { GroupInfo, SavingsHistoryItem, SavingsPageResponse } from '@/src/features/group-info/model/types';

class GroupApiService {
  // 데이터 변환 함수
  private transformSavingsData(apiData: SavingsPageResponse): GroupInfo {
    // 방장 정보 찾기
    const initiator = apiData.participants.find(p => p.userId === apiData.initiatorId);
    
    return {
      groupId: apiData.savingsId.toString(),
      title: apiData.groupName,
      date: apiData.meetingDate, // 날짜만 사용, 시간은 무시
      memo: apiData.groupDescription,
      host: {
        name: apiData.initiatorName,
        studentId: initiator?.studentId || '',
        department: initiator?.department || '',
        profileUrl: initiator?.profileUrl || ''
      },
      participants: apiData.participants.map(p => ({
        name: p.userName, // userName → name
        studentId: p.studentId,
        department: p.department,
        profileUrl: p.profileUrl
      })),
      chatRoomId: apiData.groupId.toString(), // groupId를 chatRoomId로 사용
      savingsHistory: apiData.savingsHistory.map(history => ({
        savingsId: `savings_${history.round}`,
        round: history.round,
        date: history.date,
        amount: history.totalAmount, // totalAmount → amount
        participants: history.participants.map(p => ({
          name: p.userName, // userName → name
          studentId: p.studentId,
          department: p.department,
          profileUrl: p.profileUrl,
          isCompleted: p.isPaid // isPaid → isCompleted
        }))
      }))
    };
  }

  // 채팅방 ID로 적금/모임 정보 조회
  async getSavingsInfo(chatRoomId: string): Promise<GroupInfo> {
    try {
      const response = await apiClient.get<SavingsPageResponse>(`/savings/${chatRoomId}/page`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || '모임 정보를 불러올 수 없습니다');
      }
      
      // API 응답 데이터를 화면용 데이터로 변환
      return this.transformSavingsData(response.data);
    } catch (error) {
      console.error('Failed to get savings info:', error);
      throw error;
    }
  }

  async getGroupInfo(groupId: string): Promise<GroupInfo> {
    // 기존 Mock 데이터는 유지 (필요시 getSavingsInfo 사용)
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
}

export const groupApi = new GroupApiService();