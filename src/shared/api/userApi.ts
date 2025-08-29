import { apiClient } from './client';

export interface User {
  id: number;
  name: string;
  studentId: string;
  profileUrl: string;
  university: string;
  department: string;
}

export interface SearchUsersParams {
  keyword: string;
}

export interface GetFriendsParams {
  userIds: number[];
}

/**
 * 사용자 검색 API
 * @param keyword 검색 키워드 (이름, 학번, 학과)
 * @returns 검색된 사용자 목록
 */
export async function searchUsers(keyword: string) {
  if (!keyword || keyword.trim() === '') {
    return {
      success: false,
      error: '검색 키워드를 입력해주세요'
    };
  }

  const response = await apiClient.get<User[]>(
    `/user/search?keyword=${encodeURIComponent(keyword)}`
  );

  return response;
}

/**
 * 친구 목록 조회 API
 * @param userIds 조회할 사용자 ID 리스트
 * @returns 친구 정보 목록
 */
export async function getFriends(userIds: number[]) {
  if (!userIds || userIds.length === 0) {
    return {
      success: false,
      error: '조회할 사용자 ID가 없습니다'
    };
  }

  const response = await apiClient.post<User[]>(
    '/user/get-friends',
    { userIds }
  );

  return response;
}

/**
 * 내 정보 조회 API
 * @returns 현재 로그인한 사용자 정보
 */
export async function getMyInfo() {
  const response = await apiClient.get<User>('/user/my');
  return response;
}

/**
 * Mock 데이터 - 개발 중 사용
 */
export const mockUsers: User[] = [
  {
    id: 1,
    name: '김철수',
    studentId: '20210001',
    profileUrl: 'https://example.com/profile1.jpg',
    university: 'SSAFY대학교',
    department: '컴퓨터공학과'
  },
  {
    id: 2,
    name: '이영희',
    studentId: '20210002',
    profileUrl: 'https://example.com/profile2.jpg',
    university: 'SSAFY대학교',
    department: '전자공학과'
  },
  {
    id: 3,
    name: '박민수',
    studentId: '20210003',
    profileUrl: 'https://example.com/profile3.jpg',
    university: 'SSAFY대학교',
    department: '컴퓨터공학과'
  },
  {
    id: 4,
    name: '정지은',
    studentId: '20210004',
    profileUrl: 'https://example.com/profile4.jpg',
    university: 'SSAFY대학교',
    department: '산업공학과'
  },
  {
    id: 5,
    name: '최준호',
    studentId: '20210005',
    profileUrl: 'https://example.com/profile5.jpg',
    university: 'SSAFY대학교',
    department: '컴퓨터공학과'
  }
];