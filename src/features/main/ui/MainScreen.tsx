import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StudentCard } from './StudentCard';
import { MealSummary } from './MealSummary';
import { FeatureGrid } from './FeatureGrid';
import { useUserStore } from '@/src/entities/user/model/userStore';
import { useMealStore } from '../model/mealStore';
import { useAccountStore } from '@/src/entities/account/model/accountStore';

export const MainScreen: React.FC = () => {
  const { fetchUserInfo } = useUserStore();
  const { fetchMealStatistics } = useMealStore();
  const { fetchBalance } = useAccountStore();

  // 컴포넌트 마운트시 데이터 로드 (3개 API 병렬 호출)
  useEffect(() => {
    const loadMainPageData = async () => {
      await Promise.all([
        fetchUserInfo(),
        fetchMealStatistics(), 
        fetchBalance()
      ]);
    };

    loadMainPageData();
  }, [fetchUserInfo, fetchMealStatistics, fetchBalance]);
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 학생증 카드 */}
        <StudentCard />

        {/* 밥약 요약 정보 */}
        <MealSummary />

        {/* 기능 버튼 그리드 */}
        <FeatureGrid />
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
    paddingTop: 40, // 상단 여백 (StatusBar 고려)
    paddingBottom: 40, // 하단 여백
  },
});