import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/src/shared/ui';
import { useMealStore } from '@/src/store';

interface MealSummaryData {
  participationCount: number;  // 밥약 참여 횟수
  savingsAmount: number;       // 모임 적금 금액
}

interface MealSummaryProps {
  data?: MealSummaryData;      // 백엔드 데이터 (없으면 더미 사용)
}

export const MealSummary: React.FC<MealSummaryProps> = ({ data }) => {
  const { summaryData: storeData, fetchMealSummary, isLoading } = useMealStore();
  
  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    if (!storeData) {
      fetchMealSummary();
    }
  }, [storeData, fetchMealSummary]);

  // 우선순위: props > store > 더미 데이터
  const summaryData = data || storeData || {
    participationCount: 12,
    savingsAmount: 47500,
  };

  return (
    <View style={styles.container}>
      {/* 섹션 제목 */}
      <Text variant="body" style={styles.sectionTitle}>
        이번 학기 밥약 요약
      </Text>

      {/* 요약 정보 */}
      <View style={styles.summaryContainer}>
        {/* 밥약 참여 */}
        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.summaryLabel}>
            밥약 참여
          </Text>
          <Text variant="body" style={styles.summaryValue}>
            {summaryData.participationCount}회
          </Text>
        </View>

        {/* 구분선 */}
        <View style={styles.separator} />

        {/* 밥약 모임 적금 */}
        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.summaryLabel}>
            밥약 모임 적금
          </Text>
          <Text variant="body" style={styles.summaryValue}>
            {summaryData.savingsAmount.toLocaleString()}원
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: -4,
  },
  summaryLabel: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  summaryValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});