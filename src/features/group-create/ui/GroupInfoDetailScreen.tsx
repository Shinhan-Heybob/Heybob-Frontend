import { getAvatarById } from '@/src/shared/data/avatars';
import { MealInfoCard, type MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGroupCreateStore } from '../model/groupCreateStore';

interface GroupInfoDetailScreenProps {
  groupId: string;
}

export const GroupInfoDetailScreen: React.FC<GroupInfoDetailScreenProps> = ({ groupId }) => {
  const { selectedDate, selectedFriends, basicInfo, savingsInfo } = useGroupCreateStore();

  // 모임장 정보 (현재 사용자가 모임장이라고 가정)
  const hostInfo: MealInfo = {
    hostName: '김모임장', // 임시 데이터
    hostDepartment: '컴퓨터공학과',
    hostStudentId: '12345678',
    hostAvatarId: '1',
    mealTitle: basicInfo?.title || '모임 이름'
  };

  // 뒤로가기
  const handleBackPress = () => {
    router.back();
  };

  // 채팅방 입장
  const handleEnterChat = () => {
    router.push(`/groups/${groupId}/chat`);
  };

  // 통화 포맷팅
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  // 날짜 포맷팅
  const formatDate = (selectedDate: { date: string; dayOfWeek: string }) => {
    return `${selectedDate.date} (${selectedDate.dayOfWeek})`;
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        
        {/* 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>모임 정보</Text>
        </View>
        
        {/* 채팅방 입장하기 버튼 */}
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleEnterChat}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.chatButtonText}>채팅방 입장하기</Text>
          <Text style={styles.chatButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 모임장 정보 */}
        <MealInfoCard
          mealInfo={hostInfo}
          isLoading={false}
        />

        {/* 모임 날짜/시간 */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>모임 날짜</Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.calendarIcon}>
                <Image 
                  source={require('@/assets/images/icons/calendar.png')} 
                  style={styles.calendarImage}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.dateTimeText}>
                {formatDate(selectedDate)}
              </Text>
            </View>
          </View>
        )}
    {/* 메모 */}
        {basicInfo?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>메모</Text>
            <View style={styles.memoContainer}>
              <Text style={styles.memoText}>
                {basicInfo.description}
              </Text>
            </View>
          </View>
        )}
        {/* 참여자 목록 */}
        {selectedFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>참여자 목록</Text>
            <View style={styles.participantsContainer}>
              {selectedFriends.map((friend) => {
                const avatarImage = getAvatarById(friend.avatarId);
                return (
                  <View key={friend.id} style={styles.participantItem}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={avatarImage}
                        style={styles.avatar}
                        contentFit="contain"
                      />
                    </View>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantDetails}>
                        {friend.department} ({friend.studentId})
                      </Text>
                      <Text style={styles.participantName}>{friend.name}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

    

        {/* 적금 정보 */}
        {savingsInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>적금 정보</Text>
            
            {/* 목표 금액 */}
            <View style={styles.savingsInfoContainer}>
              <View style={styles.savingsInfoRow}>
                <Text style={styles.savingsInfoLabel}>목표 금액</Text>
                <Text style={styles.savingsInfoValue}>
                  {formatCurrency(savingsInfo.totalAmount)}
                </Text>
              </View>
              <Text style={styles.savingsInfoDetail}>
                (주 {formatCurrency(savingsInfo.amountPerPerson)} × 12주 × {selectedFriends.length + 1}명 + 이자 5%)
              </Text>
            </View>

            {/* 적금 세부 정보 */}
            <View style={styles.savingsDetailContainer}>
              <View style={styles.savingsDetailRow}>
                <Text style={styles.savingsDetailLabel}>적금 시작일</Text>
                <Text style={styles.savingsDetailValue}>{savingsInfo.startDate}</Text>
              </View>
              <View style={styles.savingsDetailRow}>
                <Text style={styles.savingsDetailLabel}>적금 만료일</Text>
                <Text style={styles.savingsDetailValue}>{savingsInfo.endDate}</Text>
              </View>
              <View style={styles.savingsDetailRow}>
                <Text style={styles.savingsDetailLabel}>이자율</Text>
                <Text style={styles.savingsDetailValue}>{savingsInfo.interestRate}</Text>
              </View>
              <View style={styles.savingsDetailRow}>
                <Text style={styles.savingsDetailLabel}>납부 주기</Text>
                <Text style={styles.savingsDetailValue}>{savingsInfo.paymentCycle}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: '300',
  },
  titleContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 60,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7BBBFB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  chatButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
  },
  chatButtonIcon: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dateTimeContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
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
  participantsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 30,
    height: 30,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  participantDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  memoContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    minHeight: 70,
  },
  memoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  savingsInfoContainer: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
  },
  savingsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  savingsInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D4ED8',
    marginRight: 8,
  },
  savingsInfoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
  },
  savingsInfoDetail: {
    fontSize: 14,
    color: '#3B82F6',
  },
  savingsDetailContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  savingsDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  savingsDetailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  savingsDetailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
});