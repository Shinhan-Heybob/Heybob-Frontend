import { getAvatarById } from '@/src/shared/data/avatars';
import { Text } from '@/src/shared/ui';
import { MealInfoCard, type MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { useGroupInfoStore } from '../model/groupInfoStore';
import type { GroupInfo, SavingsHistoryItem } from '../model/types';
import { GroupInfoHeader } from './components/GroupInfoHeader';
import { SavingsHistoryCard } from './components/SavingsHistoryCard';

interface GroupInfoScreenProps {
  groupId: string;
}

export const GroupInfoScreen: React.FC<GroupInfoScreenProps> = ({ groupId }) => {
  const { 
    loadGroupInfo, 
    getGroupInfo, 
    isLoading 
  } = useGroupInfoStore();
  
  const groupInfo = getGroupInfo(groupId);
  const loading = isLoading(groupId);

  // GroupInfo → MealInfo 타입 변환
  const convertToMealInfoType = (groupInfo: GroupInfo): MealInfo => ({
    hostName: groupInfo.host.name,
    hostDepartment: groupInfo.host.department,
    hostStudentId: groupInfo.host.studentId,
    hostAvatarId: groupInfo.host.profileUrl,
    mealTitle: groupInfo.title
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadGroupInfo(groupId);
      } catch (error) {
        console.error('Failed to load group info:', error);
        Alert.alert('오류', '모임 정보를 불러올 수 없습니다.');
      }
    };
    
    loadData();
  }, [groupId, loadGroupInfo]);

  const handleBackPress = () => {
    router.back();
  };

  const handleEnterChatRoom = () => {
    if (!groupInfo?.chatRoomId) {
      Alert.alert('오류', '채팅방 정보를 찾을 수 없습니다.');
      return;
    }

    router.push({
      pathname: '/groups/[groupId]/chat',
      params: { groupId: groupInfo.chatRoomId }
    });
  };

  // 적금 히스토리 정렬: 최신 회차(가장 큰 round) 맨 위, 나머지 오름차순
  const getSortedSavingsHistory = (history: SavingsHistoryItem[]): SavingsHistoryItem[] => {
    if (history.length === 0) return [];
    
    // round 번호로 정렬
    const sorted = [...history].sort((a, b) => a.round - b.round);
    
    // 가장 높은 round를 찾아서 맨 앞으로
    const maxRound = Math.max(...sorted.map(item => item.round));
    const latestItem = sorted.find(item => item.round === maxRound);
    const otherItems = sorted.filter(item => item.round !== maxRound);
    
    return latestItem ? [latestItem, ...otherItems] : sorted;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <GroupInfoHeader 
          onBackPress={handleBackPress} 
          onEnterChat={handleEnterChatRoom}
          disabled={true}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </View>
    );
  }

  if (!groupInfo) {
    return (
      <View style={styles.container}>
        <GroupInfoHeader 
          onBackPress={handleBackPress} 
          onEnterChat={handleEnterChatRoom}
          disabled={true}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>모임 정보를 찾을 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  const sortedSavingsHistory = getSortedSavingsHistory(groupInfo.savingsHistory);

  return (
    <View style={styles.container}>
      <GroupInfoHeader 
        onBackPress={handleBackPress} 
        onEnterChat={handleEnterChatRoom}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 방장 정보 */}
        <MealInfoCard
          mealInfo={convertToMealInfoType(groupInfo)}
          isLoading={loading}
        />

        {/* 모임 날짜/시간 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>모임 날짜</Text>
          <View style={styles.dateTimeContainer}>
            <View style={styles.calendarIcon}>
              <Image 
                source={require('@/assets/images/icons/calendar.png')} 
                style={styles.calendarImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.dateTimeText}>
              {groupInfo.date} 
            </Text>
          </View>
        </View>

        {/* 메모 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메모</Text>
          <View style={styles.memoContainer}>
            <Text style={styles.memoText}>
              {groupInfo.memo || '메모가 없습니다.'}
            </Text>
          </View>
        </View>

        {/* 참여자 목록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참여자 목록</Text>
          {groupInfo.participants.map((participant, index) => (
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
            </View>
          ))}
        </View>

        {/* 적금 현황 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>적금 현황</Text>
          {sortedSavingsHistory.map((item) => (
            <SavingsHistoryCard 
              key={item.savingsId} 
              item={item} 
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dateTimeContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarImage: {
    width: 20,
    height: 20,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  memoContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    minHeight: 60,
  },
  memoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
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
});