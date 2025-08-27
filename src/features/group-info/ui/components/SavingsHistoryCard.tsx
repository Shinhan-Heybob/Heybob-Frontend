import { getAvatarById } from '@/src/shared/data/avatars';
import { Text } from '@/src/shared/ui';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { SavingsHistoryItem } from '../../model/types';

interface SavingsHistoryCardProps {
  item: SavingsHistoryItem;
}

export const SavingsHistoryCard: React.FC<SavingsHistoryCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = item.participants.filter(p => p.isCompleted).length;
  const totalCount = item.participants.length;

  return (
    <View style={styles.container}>
      {/* 카드 헤더 (클릭 가능) */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.roundText}>{item.round}회차 적금</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.amountText}>{item.amount.toLocaleString()}원</Text>
          <Text style={styles.statusText}>
            {completedCount}/{totalCount}명 완료
          </Text>
        </View>
        
        <View style={styles.arrowContainer}>
          <Text style={[styles.arrow, isExpanded && styles.arrowExpanded]}>
            ‹
          </Text>
        </View>
      </TouchableOpacity>

      {/* 참여자 상세 정보 (토글) */}
      {isExpanded && (
        <View style={styles.participantsContainer}>
          {item.participants.map((participant, index) => (
            <View key={`${participant.studentId}-${index}`} style={styles.participantItem}>
              <View style={styles.participantAvatar}>
                <Image 
                  source={getAvatarById(participant.profileUrl)} 
                  style={styles.avatar}
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.participantDetails}>
                <Text style={styles.participantDept}>
                  {participant.department} ({participant.studentId})
                </Text>
                <Text style={styles.participantName}>{participant.name}</Text>
              </View>
              
              {/* 정산완료 상태만 표시 */}
              {participant.isCompleted && (
                <View style={styles.completedContainer}>
                  <Image 
                    source={require('@/assets/images/icons/confirm-button.png')}
                    style={styles.completedIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  headerLeft: {
    flex: 1,
  },
  roundText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  arrowContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#9CA3AF',
    transform: [{ rotate: '-90deg' }],
  },
  arrowExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  participantsContainer: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  participantDetails: {
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
  completedContainer: {
    marginLeft: 8,
  },
  completedIcon: {
    width: 24,
    height: 24,
  },
});