import { getAvatarById } from '@/src/shared/data/avatars';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Participant {
  userId: string;
  name: string;
  department: string;
  studentId: string;
  avatarId: string;
  isSettled: boolean;
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
              <Text style={styles.participantName}>{participant.name}</Text>
            </View>
            
            {/* 정산 완료 아이콘 */}
            {participant.isSettled && (
              <View style={styles.statusContainer}>
                <Image
                  source={require('@/assets/images/icons/confirm-button.png')}
                  style={styles.confirmIcon}
                  contentFit="contain"
                />
                <Text style={styles.statusText}>정산 완료</Text>
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
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});