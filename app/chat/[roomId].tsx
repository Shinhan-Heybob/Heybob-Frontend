import { SharedChatScreen } from '@/src/shared/ui/organisms/ChatScreen';
import type { CurrentUser } from '@/src/features/chat/model/types';
import { useLocalSearchParams } from 'expo-router';
import { useUserStore } from '@/src/entities/user/model/userStore';
import { useEffect, useState } from 'react';
import { apiClient } from '@/src/shared/api/client';

export default function ChatRoomPage() {
  const { roomId, chatType, title } = useLocalSearchParams<{ 
    roomId: string; 
    chatType?: string;
    title?: string;
  }>();
  const { userInfo } = useUserStore();
  const [roomInfo, setRoomInfo] = useState({
    roomId: roomId,
    title: title || '밥약 채팅방',
    participantCount: 4,
  });

  // 성공 예시와 동일한 사용자 정보 사용
  const tempCurrentUser: CurrentUser = {
    userId: '1234567',
    studentId: '1234567',
    userName: '김미림',
    profileImageUrl: 'http://profileImage/kim-mirim.jpg',
  };

  // 실제 사용자 정보 사용 (없으면 임시 정보)
  const currentUser: CurrentUser = userInfo ? {
    userId: userInfo.id.toString(),
    studentId: userInfo.studentId,
    userName: userInfo.name,
    profileImageUrl: userInfo.profileUrl || 'http://profileImage/kim-mirim.jpg',
  } : tempCurrentUser;

  // 채팅방 정보 가져오기 (title이 파라미터로 전달되지 않은 경우만)
  useEffect(() => {
    const fetchRoomInfo = async () => {
      // title이 이미 파라미터로 전달된 경우 API 호출 생략
      if (title) {
        console.log('채팅방 제목이 파라미터로 전달됨:', title);
        return;
      }

      try {
        const endpoint = chatType === 'meal' ? `/meals/${roomId}` : `/meal-appointments/${roomId}`;
        const response = await apiClient.get<{name: string; memberCount: number}>(endpoint);
        if (response.success && response.data) {
          setRoomInfo({
            roomId: roomId,
            title: response.data.name || '채팅방',
            participantCount: response.data.memberCount || 4,
          });
        }
      } catch (error) {
        console.log('채팅방 정보 로드 실패, 기본값 사용:', error);
      }
    };

    if (roomId) {
      fetchRoomInfo();
    }
  }, [roomId, title, chatType]);

  if (!roomId) {
    return null;
  }

  return (
    <SharedChatScreen
      roomId={roomId}
      currentUser={currentUser}
      roomInfo={roomInfo}
      chatType={chatType === 'group' ? 'group' : 'meal'}
    />
  );
}