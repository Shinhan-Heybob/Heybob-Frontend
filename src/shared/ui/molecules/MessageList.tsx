import { getMessageCategory, isMyMessage } from '@/src/features/chat/lib/utils';
import type { ChatMessage } from '@/src/features/chat/model/types';
import React, { useEffect, useRef } from 'react';
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

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading = false,
  hasMore = true,
  onLoadMore,
  onPaymentPress,
}) => {
  const flatListRef = useRef<FlatList>(null);

  // 새 메시지가 오면 자동으로 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

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
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleLoadMore}
            enabled={hasMore}
          />
        }
        // 성능 최적화
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 80, // 대략적인 메시지 높이
          offset: 80 * index,
          index,
        })}
      />
    </View>
  );
};

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
    paddingBottom: 16,
  },
});