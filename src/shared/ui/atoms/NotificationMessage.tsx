import { Text } from '@/src/shared/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ChatMessage } from '@/src/features/chat/model/types';
import { formatMessageTime } from '@/src/features/chat/lib/utils';

interface NotificationMessageProps {
  message: ChatMessage;
}

export const NotificationMessage: React.FC<NotificationMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message.content}</Text>
      </View>
      <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  messageContainer: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});