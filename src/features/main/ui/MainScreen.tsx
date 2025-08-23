import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StudentCard } from './StudentCard';
import { MealSummary } from './MealSummary';
import { FeatureGrid } from './FeatureGrid';

export const MainScreen: React.FC = () => {
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