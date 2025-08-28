import { formatMessageTime } from '@/src/features/chat/lib/utils';
import type { ChatMessage } from '@/src/features/chat/model/types';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AiMessageBubbleProps {
  message: ChatMessage;
  isMyMessage: boolean;
}

export const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({
  message,
  isMyMessage,
}) => {
  const isAiResponse = message.messageType === 'AI_BOT_RESPONSE';
  
  if (isMyMessage) {
    // 내 메시지 (오른쪽 정렬)
    return (
      <View style={styles.myMessageContainer}>
        <View style={styles.myMessageContent}>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
          <View style={[styles.myMessageBubble, !isAiResponse && styles.myAiQuestionBubble]}>
            <Text style={[styles.myMessageText, !isAiResponse && styles.myAiQuestionText]}>
              {message.content}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // 상대방 메시지 (왼쪽 정렬)
  return (
    <View style={styles.otherMessageContainer}>
      {/* 프로필 아바타 */}
      <View style={styles.profileContainer}>
        <View style={[styles.avatarContainer, isAiResponse && styles.aiAvatarContainer]}>
          {!isAiResponse && message.profileImageUrl ? (
            <Image source={{ uri: message.profileImageUrl }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>{isAiResponse ? '🤖' : '👨‍🎓'}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.messageContentContainer}>
        {/* 이름과 학번 표시 */}
        <View style={styles.senderInfo}>
          <Text style={styles.senderName}>
            {isAiResponse ? 'AI 메뉴추천봇' : message.senderName}
          </Text>
          {!isAiResponse && (
            <Text style={styles.studentId}>({message.studentId})</Text>
          )}
        </View>
        
        <View style={styles.messageRow}>
          <View style={[
            styles.otherMessageBubble,
            isAiResponse && styles.aiBubble
          ]}>
            <Text style={[
              styles.otherMessageText,
              isAiResponse && styles.aiMessageText
            ]}>
              {message.content}
            </Text>
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
    flexWrap: 'wrap',
  },
  myMessageBubble: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    marginLeft: 8,
  },
  myAiQuestionBubble: {
    backgroundColor: '#7C3AED',
  },
  myMessageText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  myAiQuestionText: {
    color: '#FFFFFF',
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
  avatarText: {
    fontSize: 20,
  },
  aiAvatarContainer: {
    backgroundColor: '#DBEAFE',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    flexWrap: 'wrap',
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
    flexShrink: 1,
  },
  aiBubble: {
    backgroundColor: '#0EA5E9',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  otherMessageText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  aiMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // 공통
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});