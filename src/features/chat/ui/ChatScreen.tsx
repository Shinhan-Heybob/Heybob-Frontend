import React, { useEffect } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useChatStore } from '../model/chatStore';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from '@/src/shared/ui/molecules/MessageList';
import { MessageInput } from '@/src/shared/ui/atoms/MessageInput';
import type { ChatMessage, CurrentUser, ChatRoom } from '../model/types';
import { router } from 'expo-router';

interface ChatScreenProps {
  roomId: string;
  currentUser: CurrentUser;
  roomInfo?: ChatRoom;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  roomId,
  currentUser,
  roomInfo,
}) => {
  const {
    messages,
    isLoadingMessages,
    hasMoreMessages,
    connectionStatus,
    error,
    connect,
    disconnect,
    sendMessage,
    loadMessages,
    setCurrentUser,
    setCurrentRoom,
    clearError,
  } = useChatStore();

  // 채팅방 진입 시 초기화
  useEffect(() => {
    // 사용자 및 채팅방 정보 설정
    setCurrentUser(currentUser);
    
    if (roomInfo) {
      setCurrentRoom(roomInfo);
    } else {
      // 기본 채팅방 정보
      setCurrentRoom({
        roomId,
        title: '학식 먹으러 가는 팟',
        participantCount: 4,
      });
    }

    // 채팅 히스토리 로드
    loadMessages(roomId);

    // WebSocket 연결
    connect(currentUser, roomId);

    // cleanup
    return () => {
      disconnect();
    };
  }, [roomId, currentUser, roomInfo]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Alert.alert('오류', error.message, [
        { text: '확인', onPress: clearError }
      ]);
    }
  }, [error]);

  // 메시지 전송
  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  // 더 많은 메시지 로드 (위로 스크롤)
  const handleLoadMore = () => {
    if (messages.length > 0) {
      const oldestMessage = messages[0];
      loadMessages(roomId, oldestMessage.messageId);
    }
  };

  // 결제 버튼 클릭
  const handlePaymentPress = (message: ChatMessage) => {
    Alert.alert(
      '결제 확인',
      `${message.amount?.toLocaleString()}원을 송금하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '송금하기', 
          onPress: () => {
            // TODO: 실제 결제 API 호출
            console.log('결제 처리:', message.amount);
          }
        }
      ]
    );
  };

  // 뒤로가기
  const handleBackPress = () => {
    router.back();
  };

  // 밥약 정보 보기
  const handleMealInfoPress = () => {
    // TODO: 밥약 정보 페이지로 이동
    console.log('밥약 정보 보기');
  };

  const isConnected = connectionStatus === 'connected';
  const isInputDisabled = !isConnected || isLoadingMessages;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* 헤더 */}
      <ChatHeader
        roomTitle={roomInfo?.title || '학식 먹으러 가는 팟'}
        onBackPress={handleBackPress}
        onMealInfoPress={handleMealInfoPress}
      />

      {/* 메시지 리스트 */}
      <MessageList
        messages={messages}
        currentUserId={currentUser.userId}
        isLoading={isLoadingMessages}
        hasMore={hasMoreMessages}
        onLoadMore={handleLoadMore}
        onPaymentPress={handlePaymentPress}
      />

      {/* 메시지 입력창 */}
      <MessageInput
        onSendMessage={handleSendMessage}
        placeholder={isConnected ? '메시지 입력...' : '연결 중...'}
        disabled={isInputDisabled}
      />

      {/* 연결 상태 표시 */}
      {connectionStatus === 'connecting' && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>연결 중...</Text>
        </View>
      )}

      {connectionStatus === 'error' && (
        <View style={[styles.statusBar, styles.errorBar]}>
          <Text style={[styles.statusText, styles.errorText]}>연결 실패</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  errorBar: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    color: 'white',
  },
});