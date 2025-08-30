import { getAvatarById } from '@/src/shared/data/avatars';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Participant {
  userId: number;
  userName: string;
  department: string;
  studentId: string;
  avatarId: string;
  isPaid: boolean;
  isHost: boolean;
  amount: number;
  status: string;
}

interface SettlementStatusListProps {
  participants: Participant[];
  isLoading?: boolean;
}

export const SettlementStatusList: React.FC<SettlementStatusListProps> = ({
  participants,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>정산 현황을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {participants.map((participant) => {
        const avatarImage = getAvatarById(participant.avatarId);
        
        return (
          <View key={participant.userId} style={styles.participantItem}>
            {/* 아바타 */}
            <View style={styles.avatarContainer}>
              <Image
                source={avatarImage}
                style={styles.avatar}
                contentFit="contain"
              />
            </View>
            
            {/* 참여자 정보 */}
            <View style={styles.participantInfo}>
              <Text style={styles.participantDept}>
                {participant.department} ({participant.studentId})
              </Text>
              <View style={styles.nameContainer}>
                <Text style={styles.participantName}>{participant.userName}</Text>
                {participant.isHost && (
                  <View style={styles.hostBadge}>
                    <Text style={styles.hostBadgeText}>방장</Text>
                  </View>
                )}
              </View>
              <Text style={styles.amountText}>
                {participant.amount.toLocaleString()}원
              </Text>
            </View>
            
            {/* 정산 완료 아이콘 */}
            {participant.isPaid ? (
              <View style={styles.statusContainer}>
                <Image
                  source={require('@/assets/images/icons/confirm-button.png')}
                  style={styles.confirmIcon}
                  contentFit="contain"
                />
                <Text style={styles.statusText}>정산 완료</Text>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <View style={styles.pendingIcon}>
                  <Text style={styles.pendingIconText}>...</Text>
                </View>
                <Text style={styles.pendingText}>대기중</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    padding: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  participantInfo: {
    flex: 1,
  },
  participantDept: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  hostBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hostBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmIcon: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  pendingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  pendingIconText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});