import { getMessageCategory, isMyMessage } from '@/src/features/chat/lib/utils';
import type { ChatMessage } from '@/src/features/chat/model/types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { AiMessageBubble } from '../atoms/AiMessageBubble';
import { InfoMessage } from '../atoms/InfoMessage';
import { MessageBubble } from '../atoms/MessageBubble';
import { NotificationMessage } from '../atoms/NotificationMessage';
import { PaymentMessage } from '../atoms/PaymentMessage';
import { SavingsMessage } from '../atoms/SavingsMessage';

export interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onPaymentPress?: (message: ChatMessage) => void;
  onSavingsPress?: (message: ChatMessage) => void;
  onNewMessageReceived?: () => void;
  onScrollNearBottom?: () => void;
}

export const MessageList = forwardRef<FlatList, MessageListProps>(({
  messages,
  currentUserId,
  isLoading = false,
  hasMore = true,
  onLoadMore,
  onPaymentPress,
  onSavingsPress,
  onNewMessageReceived,
  onScrollNearBottom,
}, ref) => {
  const flatListRef = useRef<FlatList>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [previousLatestTimestamp, setPreviousLatestTimestamp] = useState<string>('');

  useImperativeHandle(ref, () => flatListRef.current!, []);

  // 스크롤 위치 감지
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const scrollViewHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;
    
    // 맨 아래에서 100px 이내면 자동 스크롤 허용
    const distanceFromBottom = contentHeight - scrollPosition - scrollViewHeight;
    const nearBottom = distanceFromBottom < 100;
    
    // 사용자가 아래로 스크롤해서 맨 아래 근처에 오면 새 메시지 버튼 숨김
    if (nearBottom) {
      onScrollNearBottom?.();
    }
    
    setIsNearBottom(nearBottom);
  };

  // 새 메시지가 끝에 추가되면 조건부 자동 스크롤
  useEffect(() => {
    if (messages.length === 0) return;
    
    // 마지막 메시지 확인 (가장 최신 메시지)
    const lastMessage = messages[messages.length - 1];
    const isNewMessage = lastMessage.timestamp > previousLatestTimestamp;
    
    console.log('📱 MessageList Auto-Scroll Debug:', {
      messagesLength: messages.length,
      lastMessageTime: lastMessage.timestamp,
      previousTime: previousLatestTimestamp,
      isNewMessage,
      isNearBottom,
      shouldScroll: isNewMessage && (isNearBottom || previousLatestTimestamp === '')
    });
    
    // 이전 최신 timestamp 업데이트
    setPreviousLatestTimestamp(lastMessage.timestamp);
    
    // 새 메시지면 콜백 호출 (사용자가 위쪽에 있을 때)
    if (isNewMessage && !isNearBottom) {
      console.log('📢 New message received while user is scrolled up');
      onNewMessageReceived?.();
    }
    
    // 새 메시지이고 사용자가 아래쪽에 있으면 자동 스크롤
    if (isNewMessage && isNearBottom) {
      console.log('🚀 Auto scrolling to bottom');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages]);

  const renderMessage = ({ item: message }: { item: ChatMessage }) => {
    const category = getMessageCategory(message.messageType);
    const isMine = isMyMessage(message.senderId, currentUserId);

    switch (category) {
      case 'chat':
        return (
          <MessageBubble
            message={message}
            isMyMessage={isMine}
            showProfile={!isMine}
          />
        );

      case 'notification':
        return <NotificationMessage message={message} />;

      case 'payment':
        return (
          <PaymentMessage
            message={message}
            isMyMessage={isMine}
            onPaymentPress={onPaymentPress}
          />
        );

      case 'savings':
        return (
          <SavingsMessage
            message={message}
            isMyMessage={isMine}
            onSavingsPress={onSavingsPress}
          />
        );

      case 'info':
        return (
          <InfoMessage
            message={message}
            isMyMessage={isMine}
          />
        );

      case 'ai':
        return (
          <AiMessageBubble
            message={message}
            isMyMessage={isMine}
          />
        );

      default:
        return null;
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.messageId}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleLoadMore}
            enabled={hasMore}
          />
        }
        // 성능 최적화
        removeClippedSubviews={false}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 15, // 인풋창 높이 + 여유 공간
  },
});