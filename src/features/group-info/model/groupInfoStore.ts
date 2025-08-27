import { create } from 'zustand';
import { groupApi } from '@/src/shared/api/groupApi';
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

      // API 서비스 사용
      const groupInfo = await groupApi.getGroupInfo(groupId);

      // 캐시에 저장
      set(state => ({
        groupInfos: new Map(state.groupInfos).set(groupId, groupInfo),
        loadingStates: new Map(state.loadingStates).set(groupId, false)
      }));

      return groupInfo;

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