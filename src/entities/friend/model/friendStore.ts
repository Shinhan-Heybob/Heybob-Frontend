import { create } from 'zustand';
import { searchUsers, getFriends, User } from '@/src/shared/api/userApi';

interface FriendState {
  // 검색 상태
  searchResults: User[];
  isSearching: boolean;
  searchError: string | null;
  
  // 친구 목록 상태
  friends: User[];
  isLoadingFriends: boolean;
  friendsError: string | null;
}

interface FriendActions {
  // 검색 관련
  searchFriends: (keyword: string) => Promise<void>;
  clearSearchResults: () => void;
  clearSearchError: () => void;
  
  // 친구 목록 관련
  loadFriends: (userIds: number[]) => Promise<void>;
  clearFriends: () => void;
  clearFriendsError: () => void;
  
  // 전체 상태 초기화
  resetFriendStore: () => void;
}

type FriendStore = FriendState & FriendActions;

export const useFriendStore = create<FriendStore>((set, get) => ({
  // 초기 상태
  searchResults: [],
  isSearching: false,
  searchError: null,
  friends: [],
  isLoadingFriends: false,
  friendsError: null,

  // 친구 검색
  searchFriends: async (keyword: string) => {
    if (!keyword || keyword.trim() === '') {
      set({ searchResults: [], searchError: null });
      return;
    }

    set({ isSearching: true, searchError: null });

    try {
      const response = await searchUsers(keyword);

      if (response.success && response.data) {
        set({
          searchResults: response.data,
          isSearching: false,
          searchError: null
        });
      } else {
        set({
          searchResults: [],
          isSearching: false,
          searchError: response.error || '검색에 실패했습니다'
        });
      }
    } catch (error) {
      console.error('친구 검색 오류:', error);
      set({
        searchResults: [],
        isSearching: false,
        searchError: error instanceof Error ? error.message : '검색 중 오류가 발생했습니다'
      });
    }
  },

  // 친구 목록 로드
  loadFriends: async (userIds: number[]) => {
    if (!userIds || userIds.length === 0) {
      set({ friends: [], friendsError: null });
      return;
    }

    set({ isLoadingFriends: true, friendsError: null });

    try {
      const response = await getFriends(userIds);

      if (response.success && response.data) {
        set({
          friends: response.data,
          isLoadingFriends: false,
          friendsError: null
        });
      } else {
        set({
          friends: [],
          isLoadingFriends: false,
          friendsError: response.error || '친구 목록을 불러오는데 실패했습니다'
        });
      }
    } catch (error) {
      console.error('친구 목록 로드 오류:', error);
      set({
        friends: [],
        isLoadingFriends: false,
        friendsError: error instanceof Error ? error.message : '친구 목록 로드 중 오류가 발생했습니다'
      });
    }
  },

  // 검색 결과 초기화
  clearSearchResults: () => {
    set({ searchResults: [], searchError: null });
  },

  // 검색 에러 초기화
  clearSearchError: () => {
    set({ searchError: null });
  },

  // 친구 목록 초기화
  clearFriends: () => {
    set({ friends: [], friendsError: null });
  },

  // 친구 에러 초기화
  clearFriendsError: () => {
    set({ friendsError: null });
  },

  // 전체 상태 초기화
  resetFriendStore: () => {
    set({
      searchResults: [],
      isSearching: false,
      searchError: null,
      friends: [],
      isLoadingFriends: false,
      friendsError: null,
    });
  },
}));