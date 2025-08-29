import { SharedChatScreen } from '@/src/shared/ui/organisms/ChatScreen';
import { useLocalSearchParams } from 'expo-router';
import { useUserStore } from '@/src/entities/user/model/userStore';
import { useEffect, useState } from 'react';
import { apiClient } from '@/src/shared/api/client';

// 실제 사용자 정보를 사용하되, 없으면 임시 정보 사용
const TEMP_CURRENT_USER = {
  userId: '1234567',
  name: '김미림',
  studentId: '1234567',
  department: '컴퓨터공학과',
  profileImageUrl: 'http://profileImage/kim-mirim.jpg',
};

export default function GroupChatPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { userInfo } = useUserStore();
  const [roomInfo, setRoomInfo] = useState({
    roomId: groupId,
    title: '모임 채팅방',
    participantCount: 4,
  });
  
  // 실제 사용자 정보 사용 (없으면 임시 정보)
  const currentUser = userInfo ? {
    userId: userInfo.id.toString(),
    name: userInfo.name,
    studentId: userInfo.studentId,
    department: userInfo.department,
    profileImageUrl: userInfo.profileUrl || 'http://profileImage/kim-mirim.jpg',
  } : TEMP_CURRENT_USER;
  
  // 그룹 정보 가져오기
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await apiClient.get(`/groups/${groupId}`);
        if (response.success && response.data) {
          setRoomInfo({
            roomId: groupId,
            title: response.data.name || '모임 채팅방',
            participantCount: response.data.memberCount || 4,
          });
        }
      } catch (error) {
        console.log('그룹 정보 로드 실패, 기본값 사용:', error);
      }
    };

    if (groupId) {
      fetchGroupInfo();
    }
  }, [groupId]);

  return (
    <SharedChatScreen 
      roomId={groupId}
      currentUser={currentUser}
      roomInfo={roomInfo}
      chatType="group"
    />
  );
}