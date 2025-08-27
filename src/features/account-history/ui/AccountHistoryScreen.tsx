import React, { useEffect } from 'react';
import { View, StyleSheet, Text, SectionList, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAccountHistoryStore } from '../model/accountHistoryStore';
import { AccountHistoryHeader } from './components/AccountHistoryHeader';
import { DateRangeSelector } from './components/DateRangeSelector';
import { TransactionItem } from './components/TransactionItem';
import type { FormattedTransaction, DateSection } from '../model/types';

export const AccountHistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  // 화면 높이에서 하단 탭바 높이(83px)를 뺀 사용 가능한 높이 계산
  const screenHeight = Dimensions.get('window').height;
  const tabBarHeight = 83;
  const availableHeight = screenHeight - tabBarHeight;
  const {
    dateRange,
    totalCount,
    isLoading,
    error,
    loadAccountHistory,
    setDateRange,
    getGroupedTransactions,
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

  // 날짜별로 그룹핑된 거래 내역 가져오기
  const groupedTransactions = getGroupedTransactions();

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

  // 날짜 헤더 렌더링
  const renderSectionHeader = ({ section }: { section: DateSection }) => (
    <View style={styles.dateHeader}>
      <Text style={styles.dateHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { height: availableHeight }]}>
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
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.transactionUniqueNo}
        renderItem={renderTransactionItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: Math.max(20, insets.bottom) }
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadAccountHistory}
        stickySectionHeadersEnabled={false}
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
  dateHeader: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateHeaderText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});