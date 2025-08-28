import { useChatStore } from '@/src/features/chat/model/chatStore';
import type { ChatMessage, ChatRoom, CurrentUser } from '@/src/features/chat/model/types';
import { ChatHeader } from '@/src/features/chat/ui/components/ChatHeader';
import { AiChatbot } from '@/src/features/chat/ui/components/AiChatbot';
import { MessageInput } from '@/src/shared/ui/atoms/MessageInput';
import { MessageList } from '@/src/shared/ui/molecules/MessageList';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ChatType = 'meal' | 'group';

interface SharedChatScreenProps {
  roomId: string;
  currentUser: CurrentUser;
  roomInfo?: ChatRoom;
  chatType: ChatType;
}

export const SharedChatScreen: React.FC<SharedChatScreenProps> = ({
  roomId,
  currentUser,
  roomInfo,
  chatType,
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasInteractedWithKeyboard, setHasInteractedWithKeyboard] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showAiChatbot, setShowAiChatbot] = useState(false);
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
    sendTypedMessage,
    sendCafeteriaInfoRequest,
    sendAiQuestion,
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
      const defaultTitle = chatType === 'meal' ? '학식 먹으러 가는 팟' : '모임 채팅방';
      setCurrentRoom({
        roomId,
        title: defaultTitle,
        participantCount: 4,
      });
    }

    // 채팅 히스토리 로드
    loadMessages(roomId);

    // WebSocket 연결
    console.log('🔍 ChatScreen에서 connect 호출:', {
      currentUser,
      roomId,
      hasCurrentUser: !!currentUser
    });
    connect(currentUser, roomId);

    // cleanup
    return () => {
      disconnect();
    };
  }, [roomId, currentUser, roomInfo, chatType]);

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

  // 결제 버튼 클릭 (밥약용)
  const handlePaymentPress = (message: ChatMessage) => {
    if (message.messageType === 'PAYMENT_REQUEST') {
      // 실시간 메시지는 paymentData, 목 데이터는 paymentRequestData
      const paymentData = (message as any).paymentData || message.paymentRequestData;
      
      if (paymentData) {
        router.push({
          pathname: '/payment-confirm/[roomId]',
          params: {
            roomId: roomId,
            amount: paymentData.requestAmount.toString(),
            messageId: message.messageId
          }
        });
      }
    }
  };

  // 적금 버튼 클릭 (모임용)
  const handleSavingsPress = (message: ChatMessage) => {
    if (message.messageType === 'SAVINGS_REQUEST') {
      // 실시간 메시지는 paymentRequestData, 목 데이터는 savingsRequestData
      const savingsData = (message as any).paymentRequestData || message.savingsRequestData;
      
      if (savingsData) {
        router.push({
          pathname: '/savings-confirm/[roomId]',
          params: {
            roomId: roomId,
            amount: savingsData.requestAmount.toString(),
            messageId: message.messageId
          }
        });
      }
    }
  };

  // 뒤로가기
  const handleBackPress = () => {
    router.replace('/(main)');
  };

  // 정보 보기 (밥약 정보 or 모임 정보)
  const handleInfoPress = () => {
    if (chatType === 'meal') {
      // 밥약 정보 보기
      const mealId = 'meal-123'; // 실제로는 현재 채팅방과 연결된 mealId 사용
      router.push(`/meal-info/${mealId}`);
    } else {
      // 모임 정보 보기
      const groupId = roomId.replace('group_', ''); // 실제로는 roomId에서 groupId 추출
      router.push(`/groups/${groupId}/info`);
    }
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

  // 새 메시지 보기 버튼 클릭
  const handleNewMessageButtonPress = () => {
    setHasNewMessage(false);
    messageListRef.current?.scrollToEnd({ animated: true });
  };

  // + 버튼 클릭 시 메뉴 표시
  const handlePlusButtonPress = () => {
    if (chatType === 'meal') {
      // 밥약 채팅: 1/N 정산하기
      console.log('1/N 정산하기 클릭:', roomId);
      // TODO: 정산 페이지 구현 후 활성화
      router.push({
        pathname: '/split-bill/[roomId]',
        params: { roomId }
      });
    } else {
      // 모임 채팅: 1/N 정산하기 (밥약과 동일)
      console.log('모임 1/N 정산하기 클릭:', roomId);
      router.push({
        pathname: '/split-bill/[roomId]',
        params: { roomId }
      });
    }
  };

  // 학식 정보 보기 (공통)
  const handleCafeteriaInfoPress = () => {
    sendCafeteriaInfoRequest();
  };

  // AI 챗봇 토글
  const handleAiChatbotPress = () => {
    setShowAiChatbot(!showAiChatbot);
  };

  const getHeaderTitle = () => {
    if (roomInfo?.title) return roomInfo.title;
    return chatType === 'meal' ? '학식 먹으러 가는 팟' : '모임 채팅방';
  };

  const getHeaderButtonText = () => {
    return chatType === 'meal' ? '밥약 정보 보러가기' : '모임 정보 보러가기';
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* 헤더 */}
      <ChatHeader
        roomTitle={getHeaderTitle()}
        onBackPress={handleBackPress}
        onMealInfoPress={handleInfoPress}
        buttonText={getHeaderButtonText()}
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
        onSavingsPress={handleSavingsPress}
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
          onCafeteriaInfoPress={handleCafeteriaInfoPress}
          onAiChatbotPress={handleAiChatbotPress}
          chatType={chatType}
        />
      </View>

      {/* AI 챗봇 모달 */}
      <Modal
        visible={showAiChatbot}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAiChatbot(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAiChatbot(false)}
            >
              <Text style={styles.modalCloseText}>← 채팅으로 돌아가기</Text>
            </TouchableOpacity>
          </View>
          <AiChatbot 
            roomId={roomId}
            currentUser={currentUser}
          />
        </View>
      </Modal>

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
  inputWrapper: {
    // paddingBottom은 동적으로 적용됨
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    alignSelf: 'flex-start',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
});