import { formatMessageTime } from '@/src/features/chat/lib/utils';
import type { ChatMessage } from '@/src/features/chat/model/types';
import { Text } from '@/src/shared/ui';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SavingsMessageProps {
  message: ChatMessage;
  isMyMessage: boolean;
  onSavingsPress?: (message: ChatMessage) => void;
}

export const SavingsMessage: React.FC<SavingsMessageProps> = ({
  message,
  isMyMessage,
  onSavingsPress,
}) => {
  const handleSavingsPress = () => {
    onSavingsPress?.(message);
  };

  const renderSavingsButton = () => {
    if (message.messageType === 'SAVINGS_REQUEST' && message.savingsRequestData) {
      return (
        <TouchableOpacity style={styles.savingsButton} onPress={handleSavingsPress}>
          <Text style={styles.savingsButtonText}>
            {message.savingsRequestData.requestAmount.toLocaleString()}원 모으기
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const isSavingsComplete = message.messageType === 'SAVINGS_COMPLETE';

  const getMessageText = () => {
    switch (message.messageType) {
      case 'SAVINGS_REQUEST':
        return message.content;
      case 'SAVINGS_COMPLETE':
        return message.content;
      default:
        return message.content;
    }
  };

  if (isMyMessage) {
    // 내가 보낸 적금 메시지 (오른쪽 정렬)
    return (
      <View style={styles.mySavingsContainer}>
        <View style={styles.mySavingsContent}>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
          <View style={isSavingsComplete ? styles.myCompleteBubble : styles.mySavingsBubble}>
            <Text style={isSavingsComplete ? styles.myCompleteText : styles.mySavingsText}>{getMessageText()}</Text>
            {!isSavingsComplete && renderSavingsButton()}
          </View>
        </View>
      </View>
    );
  }

  // 상대방이 보낸 적금 메시지 (왼쪽 정렬)
  return (
    <View style={styles.otherSavingsContainer}>
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
      
      <View style={styles.savingsContentContainer}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderName}>{message.senderName}</Text>
          <Text style={styles.studentId}>({message.studentId})</Text>
        </View>
        
        <View style={styles.savingsRow}>
          <View style={isSavingsComplete ? styles.otherCompleteBubble : styles.otherSavingsBubble}>
            <Text style={isSavingsComplete ? styles.otherCompleteText : styles.otherSavingsText}>{getMessageText()}</Text>
            {!isSavingsComplete && renderSavingsButton()}
          </View>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 내 적금 메시지
  mySavingsContainer: {
    alignItems: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  mySavingsContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  mySavingsBubble: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    marginLeft: 8,
  },
  mySavingsText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 20,
    marginBottom: 8,
  },
  myCompleteBubble: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    marginLeft: 8,
  },
  myCompleteText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 20,
  },

  // 상대방 적금 메시지
  otherSavingsContainer: {
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
  savingsContentContainer: {
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
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  otherSavingsBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  otherSavingsText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 20,
    marginBottom: 8,
  },
  otherCompleteBubble: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    marginRight: 8,
  },
  otherCompleteText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 20,
  },

  // 적금 버튼 (초록색 계열)
  savingsButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 4,
  },
  savingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // 공통
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});