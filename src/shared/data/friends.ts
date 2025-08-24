import { getAvailableAvatarIds } from './avatars';

export interface FriendData {
  id: string;
  name: string;
  studentId: string;
  school: string;
  department: string;
  avatarId: string;
}

// 더미 친구 데이터
export const DUMMY_FRIENDS: FriendData[] = [
  {
    id: 'friend_01',
    name: '지예은',
    studentId: '13261123',
    school: '한빛대학교',
    department: '경영학과',
    avatarId: 'avatar_01',
  },
  {
    id: 'friend_02',
    name: '박재준',
    studentId: '13261124',
    school: '한빛대학교',
    department: '국제경영학과',
    avatarId: 'avatar_02',
  },
  {
    id: 'friend_03',
    name: '김민수',
    studentId: '13261125',
    school: '한빛대학교',
    department: '한국지리학과',
    avatarId: 'avatar_01',
  },
  {
    id: 'friend_04',
    name: '이수현',
    studentId: '13261126',
    school: '한빛대학교',
    department: '컴퓨터공학과',
    avatarId: 'avatar_02',
  },
  {
    id: 'friend_05',
    name: '정하늘',
    studentId: '13261127',
    school: '참나무대학교',
    department: '영어영문학과',
    avatarId: 'avatar_01',
  },
  {
    id: 'friend_06',
    name: '최민호',
    studentId: '13261128',
    school: '새싹대학교',
    department: '기계공학과',
    avatarId: 'avatar_02',
  },
];

// 친구 검색 함수
export const searchFriends = (
  query: string, 
  searchType: 'name' | 'department' | 'studentId'
): FriendData[] => {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return DUMMY_FRIENDS.filter((friend) => {
    switch (searchType) {
      case 'name':
        return friend.name.toLowerCase().includes(normalizedQuery);
      case 'department':
        return friend.department.toLowerCase().includes(normalizedQuery);
      case 'studentId':
        return friend.studentId.includes(normalizedQuery);
      default:
        return false;
    }
  });
};