import { ChatScreen } from '@/src/features/chat/ui/ChatScreen';
import type { CurrentUser } from '@/src/features/chat/model/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ChatRoomPage() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  // TODO: 실제 사용자 정보는 useAuthStore나 다른 곳에서 가져오기
  const mockCurrentUser: CurrentUser = {
    userId: 'currentUser',
    studentId: '2024001',
    userName: '나',
    profileImageUrl: '',
  };

  if (!roomId) {
    return null;
  }

  return (
    <ChatScreen
      roomId={roomId}
      currentUser={mockCurrentUser}
    />
  );
}