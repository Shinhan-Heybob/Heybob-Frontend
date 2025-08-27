import { create } from 'zustand';
import type { GroupInfo, GroupInfoState, SavingsHistoryItem } from './types';

export const useGroupInfoStore = create<GroupInfoState>((set, get) => ({
  // 초기 상태
  groupInfos: new Map<string, GroupInfo>(),
  loadingStates: new Map<string, boolean>(),

  // 그룹 정보 로드 (캐시 포함)
  loadGroupInfo: async (groupId: string): Promise<GroupInfo | null> => {
    try {
      // 이미 캐시된 데이터가 있는지 확인
      const existing = get().groupInfos.get(groupId);
      if (existing) {
        return existing;
      }

      // 로딩 상태 설정
      set(state => ({
        loadingStates: new Map(state.loadingStates).set(groupId, true)
      }));

      // TODO: 실제 API 호출로 교체
      // const response = await groupApi.getGroupInfo(groupId);
      
      // 임시 목 데이터
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

      // 500ms 지연 (네트워크 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 500));

      // 캐시에 저장
      set(state => ({
        groupInfos: new Map(state.groupInfos).set(groupId, mockGroupInfo),
        loadingStates: new Map(state.loadingStates).set(groupId, false)
      }));

      return mockGroupInfo;

    } catch (error) {
      console.error('Failed to load group info:', error);
      
      // 로딩 상태 해제
      set(state => ({
        loadingStates: new Map(state.loadingStates).set(groupId, false)
      }));
      
      return null;
    }
  },

  // 캐시된 그룹 정보 조회
  getGroupInfo: (groupId: string): GroupInfo | null => {
    return get().groupInfos.get(groupId) || null;
  },

  // 특정 그룹 정보 캐시 삭제
  clearGroupInfo: (groupId: string) => {
    set(state => {
      const newGroupInfos = new Map(state.groupInfos);
      const newLoadingStates = new Map(state.loadingStates);
      newGroupInfos.delete(groupId);
      newLoadingStates.delete(groupId);
      
      return {
        groupInfos: newGroupInfos,
        loadingStates: newLoadingStates
      };
    });
  },

  // 모든 캐시 삭제
  clearAllGroupInfos: () => {
    set({
      groupInfos: new Map(),
      loadingStates: new Map()
    });
  },

  // 로딩 상태 조회 헬퍼
  isLoading: (groupId: string): boolean => {
    return get().loadingStates.get(groupId) || false;
  }
}));