import { Text } from '@/src/shared/ui';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ChatMessage } from '@/src/features/chat/model/types';
import { formatMessageTime } from '@/src/features/chat/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  isMyMessage: boolean;
  showProfile?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMyMessage,
  showProfile = true,
}) => {
  if (isMyMessage) {
    // 내 메시지 (오른쪽 정렬)
    return (
      <View style={styles.myMessageContainer}>
        <View style={styles.myMessageContent}>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
          <View style={styles.myMessageBubble}>
            <Text style={styles.myMessageText}>{message.content}</Text>
          </View>
        </View>
      </View>
    );
  }

  // 상대방 메시지 (왼쪽 정렬)
  return (
    <View style={styles.otherMessageContainer}>
      {showProfile && (
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            {message.profileImageUrl ? (
              <Image source={{ uri: message.profileImageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarText}>👨‍🎓</Text>
              </View>
            )}
          </View>
        </View>
      )}
      
      <View style={styles.messageContentContainer}>
        {showProfile && (
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{message.senderName}</Text>
            <Text style={styles.studentId}>({message.studentId})</Text>
          </View>
        )}
        
        <View style={styles.messageRow}>
          <View style={styles.otherMessageBubble}>
            <Text style={styles.otherMessageText}>{message.content}</Text>
          </View>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 내 메시지
  myMessageContainer: {
    alignItems: 'flex-end',
    marginVertical: 4,
    marginHorizontal: 16,
  },
  myMessageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  myMessageBubble: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    marginLeft: 8,
  },
  myMessageText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 20,
  },
  
  // 상대방 메시지
  otherMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    marginHorizontal: 16,
  },
  profileContainer: {
    marginRight: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  messageContentContainer: {
    flex: 1,
    maxWidth: '80%',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  studentId: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  otherMessageBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otherMessageText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 20,
  },
  
  // 공통
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});