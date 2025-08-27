import { SharedChatScreen } from '@/src/shared/ui/organisms/ChatScreen';
import { useLocalSearchParams } from 'expo-router';

// 임시 사용자 정보 (실제로는 전역 상태나 props로 받아야 함)
const TEMP_CURRENT_USER = {
  userId: 'user1',
  name: '김철수',
  studentId: '2021001',
  department: '컴퓨터공학과',
  profileImageUrl: '',
};

export default function GroupChatPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  
  // 실제로는 groupId를 통해 채팅방 정보를 가져와야 함
  const roomId = `group_${groupId}`;
  const roomInfo = {
    roomId: roomId,
    title: '모임 채팅방',
    participantCount: 4,
  };

  return (
    <SharedChatScreen 
      roomId={roomId}
      currentUser={TEMP_CURRENT_USER}
      roomInfo={roomInfo}
      chatType="group"
    />
  );
}