import { MessageInput } from '@/src/shared/ui/atoms/MessageInput';
import { MessageList } from '@/src/shared/ui/molecules/MessageList';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChatStore } from '../model/chatStore';
import type { ChatMessage, ChatRoom, CurrentUser } from '../model/types';
import { ChatHeader } from './components/ChatHeader';

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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasInteractedWithKeyboard, setHasInteractedWithKeyboard] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messageListRef = useRef<FlatList>(null);
  
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
    addMessage,
  } = useChatStore();

  // 키보드 이벤트 리스너
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setHasInteractedWithKeyboard(true);
        setTimeout(() => scrollToBottom(), 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

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
    setTimeout(() => scrollToBottom(), 100);
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
    if (message.messageType === 'PAYMENT_REQUEST' && message.paymentRequestData) {
      router.push({
        pathname: '/payment-confirm/[roomId]',
        params: {
          roomId: roomId,
          amount: message.paymentRequestData.requestAmount.toString(),
          messageId: message.messageId
        }
      });
    }
  };

  // 뒤로가기
  const handleBackPress = () => {
    router.replace('/(main)');
  };

  // 밥약 정보 보기
  const handleMealInfoPress = () => {
    // TODO: 밥약 정보 페이지로 이동
    console.log('밥약 정보 보기');
  };

  const isConnected = connectionStatus === 'connected';
  const isInputDisabled = !isConnected || isLoadingMessages;

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    if (messageListRef.current && messages.length > 0) {
      messageListRef.current.scrollToEnd({ animated: true });
    }
  };

  const getInputPadding = () => {
    if (!hasInteractedWithKeyboard) {
      return 30; // 처음 입장: 탭바 위 고정
    }
    return keyboardVisible ? 0 : 0; // 키보드 사용 경험 후: 항상 0
  };

  // 개발용 테스트 함수들
  const addTestMessage = () => {
    const testMessage: ChatMessage = {
      messageId: 'test_' + Date.now(),
      roomId: roomId,
      senderId: 'other_user',
      studentId: '9999999',
      senderName: '테스트유저',
      profileImageUrl: '',
      content: '테스트 메시지입니다 ' + new Date().getSeconds() + '초',
      messageType: 'CHAT',
      timestamp: new Date().toISOString(),
    };
    addMessage(testMessage);
  };

  const loadHistoryTest = () => {
    if (messages.length > 0) {
      loadMessages(roomId, messages[0]?.messageId);
    }
  };

  // 새 메시지 보기 버튼 클릭
  const handleNewMessageButtonPress = () => {
    setHasNewMessage(false);
    messageListRef.current?.scrollToEnd({ animated: true });
  };

  // + 버튼 클릭 (1/N 요청하기)
  const handlePlusButtonPress = () => {
    router.push({
      pathname: '/split-bill/[roomId]',
      params: { roomId }
    });
  };

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
        ref={messageListRef}
        messages={messages}
        currentUserId={currentUser.userId}
        isLoading={isLoadingMessages}
        hasMore={hasMoreMessages}
        onLoadMore={handleLoadMore}
        onPaymentPress={handlePaymentPress}
        onNewMessageReceived={() => setHasNewMessage(true)}
        onScrollNearBottom={() => setHasNewMessage(false)}
      />

      {/* 새 메시지 보기 버튼 */}
      {hasNewMessage && (
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={handleNewMessageButtonPress}
        >
          <Text style={styles.newMessageButtonText}>새 메시지 보기</Text>
        </TouchableOpacity>
      )}

      {/* 메시지 입력창 */}
      <View style={[styles.inputWrapper, { paddingBottom: getInputPadding() }]}>
        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder={isConnected ? '메시지 입력...' : '연결 중...'}
          disabled={isInputDisabled}
          onPlusButtonPress={handlePlusButtonPress}
        />
      </View>

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

      {/* 개발용 테스트 버튼들 */}
      {__DEV__ && (
        <>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={addTestMessage}
          >
            <Text style={styles.testButtonText}>새 메시지</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.testButton, { right: 120 }]}
            onPress={loadHistoryTest}
          >
            <Text style={styles.testButtonText}>히스토리</Text>
          </TouchableOpacity>
        </>
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
  inputWrapper: {
    // paddingBottom은 동적으로 적용됨
  },
  testButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  newMessageButton: {
    position: 'absolute',
    bottom: 100, // 인풋창 위에 위치
    alignSelf: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 999,
  },
  newMessageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});