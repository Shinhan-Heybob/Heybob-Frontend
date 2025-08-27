import React, { useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAccountHistoryStore } from '../model/accountHistoryStore';
import { AccountHistoryHeader } from './components/AccountHistoryHeader';
import { DateRangeSelector } from './components/DateRangeSelector';
import { TransactionItem } from './components/TransactionItem';
import type { FormattedTransaction } from '../model/types';

export const AccountHistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    dateRange,
    totalCount,
    isLoading,
    error,
    loadAccountHistory,
    setDateRange,
    getFormattedTransactions,
    clearError,
  } = useAccountHistoryStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadAccountHistory();
  }, []);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Alert.alert('오류', error, [
        { text: '확인', onPress: clearError }
      ]);
    }
  }, [error]);

  // 포맷팅된 거래 내역 가져오기
  const formattedTransactions = getFormattedTransactions();

  // 빈 목록 렌더링
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? '거래 내역을 불러오는 중...' : '선택한 기간에 거래 내역이 없습니다'}
      </Text>
    </View>
  );

  // 거래 아이템 렌더링
  const renderTransactionItem = ({ item }: { item: FormattedTransaction }) => (
    <TransactionItem transaction={item} />
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <AccountHistoryHeader />

      {/* 날짜 선택 */}
      <DateRangeSelector
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* 거래 건수 표시 */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          총 {totalCount}건의 거래
        </Text>
      </View>

      {/* 거래 목록 */}
      <FlatList
        data={formattedTransactions}
        keyExtractor={(item) => item.transactionUniqueNo}
        renderItem={renderTransactionItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: Math.max(20, insets.bottom) }
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadAccountHistory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});