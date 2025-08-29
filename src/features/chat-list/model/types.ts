import type { MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';

export type ChatStatus = 'active' | 'inactive';
export type ChatType = 'all' | 'MEAL_APPOINTMENT' | 'REGULAR_MEETING';

// API 응답 타입 (서버에서 오는 형태)
export interface ChatListApiResponse {
  id: number;
  name: string;
  creatorName: string;
  creatorStudentId: string;
  creatorDepartment: string;
  chatRoomId: number;
  appointmentDate: string;
  appointmentTime: string;
  mealType: 'MEAL_APPOINTMENT' | 'REGULAR_MEETING';
  active: boolean; // Java의 isActive가 JSON에서 active로 변환됨
}

// 클라이언트에서 사용하는 타입
export interface ChatListItem {
  id: number;
  name: string;
  creatorName: string;
  creatorStudentId: string;
  creatorDepartment: string;
  chatRoomId: number;
  appointmentDate: string;
  appointmentTime: string;
  mealType: 'MEAL_APPOINTMENT' | 'REGULAR_MEETING';
  isActive: boolean;
}

export interface ChatListFilters {
  status: ChatStatus;
  type: ChatType;
}

export const STATUS_OPTIONS = [
  { label: '활성화', value: 'active' as ChatStatus },
  { label: '비활성화', value: 'inactive' as ChatStatus }
];

export const TYPE_OPTIONS = [
  { label: '전체', value: 'all' as ChatType },
  { label: '밥약 목록', value: 'MEAL_APPOINTMENT' as ChatType },
  { label: '모임 목록', value: 'REGULAR_MEETING' as ChatType }
];

// API 응답을 클라이언트 타입으로 변환하는 헬퍼 함수
export const convertApiResponseToItem = (apiResponse: ChatListApiResponse): ChatListItem => ({
  ...apiResponse,
  isActive: apiResponse.active // active를 isActive로 변환
});

// ChatListItem을 MealInfo로 변환하는 헬퍼 함수
export const convertToMealInfo = (item: ChatListItem): MealInfo => ({
  hostName: item.creatorName,
  hostDepartment: item.creatorDepartment,
  hostStudentId: item.creatorStudentId,
  hostAvatarId: 'avatar_01', // 기본값
  mealTitle: item.name
});