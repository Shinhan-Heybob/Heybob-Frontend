import { MealInfoCard, type MealInfo } from '@/src/shared/ui/atoms/MealInfoCard';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMealInfoDetailStore, type MealDetailInfo } from '../model/mealInfoDetailStore';
import { SettlementAmountCard } from './components/SettlementAmountCard';
import { SettlementStatusList } from './components/SettlementStatusList';

interface MealInfoDetailScreenProps {
  mealId: string;
}

export const MealInfoDetailScreen: React.FC<MealInfoDetailScreenProps> = ({ mealId }) => {
  const {
    mealInfo,
    isMealInfoLoading,
    settlementInfo,
    isSettlementLoading,
    error,
    loadMealInfo,
    loadSettlementInfo,
    reset,
    clearError,
  } = useMealInfoDetailStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMealInfo(mealId);
    loadSettlementInfo(mealId);
    
    return () => {
      reset();
    };
  }, [mealId]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Alert.alert('오류', error, [
        { text: '확인', onPress: clearError }
      ]);
    }
  }, [error]);

  // MealDetailInfo → MealInfoCard 타입 변환
  const convertToMealInfoCardType = (info: MealDetailInfo): MealInfo => {
    return {
      hostName: info.host.name,
      hostDepartment: info.host.department,
      hostStudentId: info.host.studentId,
      hostAvatarId: info.host.profileUrl,
      mealTitle: info.title,
    };
  };

  // 뒤로가기
  const handleBackPress = () => {
    router.back();
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
        <Text style={styles.headerTitle}>밥약 정보</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 방장 정보 */}
        <MealInfoCard
          mealInfo={mealInfo ? convertToMealInfoCardType(mealInfo) : null}
          isLoading={isMealInfoLoading}
        />

        {/* 밥약 날짜/시간 */}
        {mealInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>밥약 날짜/시간</Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.calendarIcon}>
                <Image 
                  source={require('@/assets/images/icons/calendar.png')} 
                  style={styles.calendarImage}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.dateTimeText}>
                {mealInfo.date} {mealInfo.time}
              </Text>
            </View>
          </View>
        )}

        {/* 메모 */}
        {mealInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>메모</Text>
            <View style={styles.memoContainer}>
              <Text style={styles.memoText}>
                {mealInfo.memo || '메모가 없습니다.'}
              </Text>
            </View>
          </View>
        )}

        {/* 정산 총 금액 */}
        {settlementInfo && (
          <SettlementAmountCard
            date={settlementInfo.requestDate}
            amount={settlementInfo.totalAmount}
          />
        )}

        {/* 참여자별 정산 상태 */}
        {settlementInfo && (
          <View style={styles.section}>
            <SettlementStatusList
              participants={settlementInfo.participants}
              isLoading={isSettlementLoading}
            />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
});