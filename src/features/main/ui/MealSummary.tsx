import { Text } from '@/src/shared/ui';
import { useMealStore } from '../model/mealStore';
import { useAccountStore } from '@/src/entities/account/model/accountStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface MealSummaryData {
  participationCount: number;  // 밥약 참여 횟수
  groupParticipationCount: number; // 그룹 만들기 참여 횟수
  accountBalance: number;       // 내 계좌 잔액
}

interface MealSummaryProps {
  data?: MealSummaryData;      // 백엔드 데이터 (없으면 더미 사용)
}

export const MealSummary: React.FC<MealSummaryProps> = ({ data }) => {
  const { mealStatistics, isLoading: mealLoading } = useMealStore();
  const { balance, isLoading: balanceLoading } = useAccountStore();

  // 각 스토어에서 데이터 가져와서 조합
  const summaryData = data || {
    participationCount: mealStatistics?.mealAppointmentCount || 0,
    groupParticipationCount: mealStatistics?.regularMeetingCount || 0,
    accountBalance: balance ? parseInt(balance.balance) : 0,
  };

  const isLoading = mealLoading || balanceLoading;

  // 데이터 로딩 중일 때
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.sectionTitle}>
          밥약 요약
        </Text>
        <View style={styles.summaryContainer}>
          <Text variant="body" style={styles.loadingText}>
            로딩 중...
          </Text>
        </View>
      </View>
    );
  }

  // 데이터가 없을 때
  if (!summaryData) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.sectionTitle}>
          밥약 요약
        </Text>
        <View style={styles.summaryContainer}>
          <Text variant="body" style={styles.loadingText}>
            데이터를 불러올 수 없습니다
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 섹션 제목 */}
      <Text variant="body" style={styles.sectionTitle}>
       밥약 요약
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

         {/* 모임 참여 */}
        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.summaryLabel}>
            모임 참여
          </Text>
          <Text variant="body" style={styles.summaryValue}>
            {summaryData.groupParticipationCount}회
          </Text>
        </View>

        {/* 구분선 */}
        <View style={styles.separator} />

        {/* 내 계좌 잔액 */}
        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.summaryLabel}>
            내 계좌 잔액
          </Text>
          <Text variant="body" style={styles.summaryValue}>
            {summaryData.accountBalance.toLocaleString()}원
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
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
  },
});