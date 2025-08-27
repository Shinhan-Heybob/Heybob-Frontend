import { formatMessageTime } from '@/src/features/chat/lib/utils';
import type { ChatMessage } from '@/src/features/chat/model/types';
import { Text } from '@/src/shared/ui';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface InfoMessageProps {
  message: ChatMessage;
  isMyMessage: boolean;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({
  message,
  isMyMessage,
}) => {
  const getMessageText = () => {
    switch (message.messageType) {
      case 'CAFETERIA_INFO':
        return message.content;
      default:
        return message.content;
    }
  };

  if (isMyMessage) {
    // 내가 보낸 정보 메시지 (오른쪽 정렬)
    return (
      <View style={styles.myInfoContainer}>
        <View style={styles.myInfoContent}>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
          <View style={styles.myInfoBubble}>
            <Text style={styles.myInfoText}>{getMessageText()}</Text>
          </View>
        </View>
      </View>
    );
  }

  // 상대방이 보낸 정보 메시지 (왼쪽 정렬)
  return (
    <View style={styles.otherInfoContainer}>
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
      
      <View style={styles.infoContentContainer}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderName}>{message.senderName}</Text>
          <Text style={styles.studentId}>({message.studentId})</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.otherInfoBubble}>
            <Text style={styles.otherInfoText}>{getMessageText()}</Text>
          </View>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 내 정보 메시지
  myInfoContainer: {
    alignItems: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  myInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  myInfoBubble: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    marginLeft: 8,
  },
  myInfoText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 20,
  },

  // 상대방 정보 메시지
  otherInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
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
  infoContentContainer: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  otherInfoBubble: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    marginRight: 8,
  },
  otherInfoText: {
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