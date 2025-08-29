import { getAvatarById } from '@/src/shared/data/avatars';
import { Text } from '@/src/shared/ui';
import { MealInfoCard, type MealInfo as MealInfoCardType } from '@/src/shared/ui/atoms/MealInfoCard';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { mealInfoApi } from '../api/mealInfoApi';
import { MealInfoHeader } from './components/MealInfoHeader';

interface MealInfo {
  mealId: string;
  title: string;
  date: string;
  time: string;
  memo: string;
  host: {
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  };
  participants: Array<{
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  }>;
  chatRoomId: string;
}

interface MealChatInfoScreenProps {
  mealId: string;
}

export const MealChatInfoScreen: React.FC<MealChatInfoScreenProps> = ({ mealId }) => {
  const [mealInfo, setMealInfo] = useState<MealInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MealInfo → MealInfoCard 타입 변환 함수
  const convertToMealInfoCardType = (info: MealInfo): MealInfoCardType => {
    return {
      hostName: info.host.name,
      hostDepartment: info.host.department,
      hostStudentId: info.host.studentId,
      hostAvatarId: info.host.profileUrl,
      mealTitle: info.title,
    };
  };

  useEffect(() => {
    loadMealInfo();
  }, [mealId]);

  const loadMealInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mealInfoApi.getMealAppointmentInfo(mealId);
      
      if (response.success && response.data) {
        setMealInfo(response.data);
      } else {
        setError(response.error || '밥약 정보를 불러오는데 실패했습니다');
        Alert.alert('오류', response.error || '밥약 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Failed to load meal info:', error);
      const errorMessage = '밥약 정보를 불러오는 중 오류가 발생했습니다';
      setError(errorMessage);
      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleEnterChatRoom = () => {
    if (!mealInfo?.chatRoomId) {
      Alert.alert('오류', '채팅방 정보를 찾을 수 없습니다.');
      return;
    }

    router.push({
      pathname: '/chat/[roomId]',
      params: { roomId: mealInfo.chatRoomId }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <MealInfoHeader 
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

  if (!mealInfo) {
    return (
      <View style={styles.container}>
        <MealInfoHeader 
          onBackPress={handleBackPress} 
          onEnterChat={handleEnterChatRoom}
          disabled={true}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>밥약 정보를 찾을 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MealInfoHeader 
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
          mealInfo={convertToMealInfoCardType(mealInfo)}
          isLoading={false}
        />

        {/* 밥약 날짜/시간 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>밥약 날짜/시간</Text>
          <View style={styles.dateTimeContainer}>
            <View style={styles.calendarIcon}>
              <Image 
                source={require('@/assets/images/icons/calendar.png')} 
                style={styles.calendarImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.dateTimeText}>
              {mealInfo.date} {mealInfo.time}
            </Text>
          </View>
        </View>

        {/* 메모 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메모</Text>
          <View style={styles.memoContainer}>
            <Text style={styles.memoText}>
              {mealInfo.memo || '메모가 없습니다.'}
            </Text>
          </View>
        </View>

        {/* 참여자 목록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참여자 목록</Text>
          {mealInfo.participants.map((participant, index) => (
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
  avatar:{
    width:40,
    height:40
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