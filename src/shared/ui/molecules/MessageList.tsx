import { getMessageCategory, isMyMessage } from '@/src/features/chat/lib/utils';
import type { ChatMessage } from '@/src/features/chat/model/types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { MessageBubble } from '../atoms/MessageBubble';
import { NotificationMessage } from '../atoms/NotificationMessage';
import { PaymentMessage } from '../atoms/PaymentMessage';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onPaymentPress?: (message: ChatMessage) => void;
}

export const MessageList = forwardRef<FlatList, MessageListProps>(({
  messages,
  currentUserId,
  isLoading = false,
  hasMore = true,
  onLoadMore,
  onPaymentPress,
}, ref) => {
  const flatListRef = useRef<FlatList>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  // const [contentHeight, setContentHeight] = useState(0);
  // const [layoutHeight, setLayoutHeight] = useState(0);

  useImperativeHandle(ref, () => flatListRef.current!, []);

  // 스크롤 위치 감지
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const scrollViewHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;
    
    // 맨 아래에서 100px 이내면 자동 스크롤 허용
    const distanceFromBottom = contentHeight - scrollPosition - scrollViewHeight;
    setIsNearBottom(distanceFromBottom < 100);
  };

  // 새 메시지가 오면 조건부 자동 스크롤
  useEffect(() => {
    if (messages.length > 0 && isNearBottom) {
      // 레이아웃 업데이트 후 스크롤 (더 부드럽게)
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages.length, isNearBottom]);

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
        maintainVisibleContentPosition={{
          minIndexForVisible: 1,
        }}
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