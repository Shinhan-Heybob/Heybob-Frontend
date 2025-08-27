import React, { useEffect } from 'react';
import { View, StyleSheet, Text, SectionList, Alert } from 'react-native';
import { useAccountHistoryStore } from '@/src/features/account-history/model/accountHistoryStore';
import { DateRangeSelector } from '@/src/features/account-history/ui/components/DateRangeSelector';
import { TransactionItem } from '@/src/features/account-history/ui/components/TransactionItem';
import type { FormattedTransaction, DateSection } from '@/src/features/account-history/model/types';

export const AccountHistorySection: React.FC = () => {
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
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Hey Bob!</Text>
      
      {/* 날짜 선택 */}
      <View style={styles.dateRangeContainer}>
        <DateRangeSelector
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </View>

      {/* 거래 건수 표시 */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          총 {totalCount}건의 거래
        </Text>
      </View>

      {/* 거래 목록 */}
      <View style={styles.listContainer}>
        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item) => item.transactionUniqueNo}
          renderItem={renderTransactionItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={loadAccountHistory}
          stickySectionHeadersEnabled={false}
          scrollEnabled={false} // 부모 ScrollView에서 스크롤하므로 비활성화
          nestedScrollEnabled={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  dateRangeContainer: {
    marginBottom: 12,
  },
  countContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
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