import { formatMessageTime } from '@/src/features/chat/lib/utils';
import type { ChatMessage } from '@/src/features/chat/model/types';
import { Text } from '@/src/shared/ui';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface PaymentMessageProps {
  message: ChatMessage;
  isMyMessage: boolean;
  onPaymentPress?: (message: ChatMessage) => void;
}

export const PaymentMessage: React.FC<PaymentMessageProps> = ({
  message,
  isMyMessage,
  onPaymentPress,
}) => {
  // 디버깅: 정산 메시지 정보 확인
  console.log('💰 PaymentMessage 렌더링:', {
    messageType: message.messageType,
    senderId: message.senderId,
    senderName: message.senderName,
    studentId: message.studentId,
    profileImageUrl: message.profileImageUrl,
    isMyMessage,
  });
  
  const handlePaymentPress = () => {
    onPaymentPress?.(message);
  };

  const renderPaymentButton = () => {
    if (message.messageType === 'PAYMENT_REQUEST') {
      // 실시간 메시지는 paymentData, 목 데이터는 paymentRequestData
      const paymentData = (message as any).paymentData || message.paymentRequestData;
      
      if (paymentData) {
        return (
          <TouchableOpacity 
            style={styles.paymentButton} 
            onPress={handlePaymentPress}
            testID={`payment-button-${message.messageId}`}
          >
            <Text style={styles.paymentButtonText}>
              {paymentData.requestAmount.toLocaleString()}원 송금하기
            </Text>
          </TouchableOpacity>
        );
      }
    }
    return null;
  };

  const isPaymentComplete = message.messageType === 'PAYMENT_COMPLETE';

  const getMessageText = () => {
    switch (message.messageType) {
      case 'PAYMENT_REQUEST':
        return message.content; // "이지민님이 정산하기를 요청했습니다."
      case 'PAYMENT_COMPLETE':
        return message.content; // "김철수님이 정산을 완료했습니다."
      default:
        return message.content;
    }
  };

  if (isMyMessage) {
    // 내가 보낸 결제 메시지 (오른쪽 정렬)
    return (
      <View style={styles.myPaymentContainer}>
        <View style={styles.myPaymentContent}>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
          <View style={isPaymentComplete ? styles.myCompleteBubble : styles.myPaymentBubble}>
            <Text style={isPaymentComplete ? styles.myCompleteText : styles.myPaymentText}>{getMessageText()}</Text>
            {!isPaymentComplete && renderPaymentButton()}
          </View>
        </View>
      </View>
    );
  }

  // 상대방이 보낸 결제 메시지 (왼쪽 정렬)
  return (
    <View style={styles.otherPaymentContainer}>
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
      
      <View style={styles.paymentContentContainer}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderName}>{message.senderName}</Text>
          <Text style={styles.studentId}>({message.studentId})</Text>
        </View>
        
        <View style={styles.paymentRow}>
          <View style={isPaymentComplete ? styles.otherCompleteBubble : styles.otherPaymentBubble}>
            <Text style={isPaymentComplete ? styles.otherCompleteText : styles.otherPaymentText}>{getMessageText()}</Text>
            {!isPaymentComplete && renderPaymentButton()}
          </View>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 내 결제 메시지
  myPaymentContainer: {
    alignItems: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  myPaymentContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '100%',
  },
  myPaymentBubble: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    marginLeft: 8,
  },
  myPaymentText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 20,
    marginBottom: 8,
  },
  myCompleteBubble: {
    backgroundColor: '#3B82F6',
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

  // 상대방 결제 메시지
  otherPaymentContainer: {
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
  paymentContentContainer: {
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
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  otherPaymentBubble: {
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
  otherPaymentText: {
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

  // 결제 버튼
  paymentButton: {
    backgroundColor: '#7BBBFB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'stretch',
  },
  paymentButtonText: {
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