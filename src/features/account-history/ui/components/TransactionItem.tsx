import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import type { FormattedTransaction } from '../../model/types';

interface TransactionItemProps {
  transaction: FormattedTransaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const getAmountColor = (isDeposit: boolean) => {
    return isDeposit ? '#10B981' : '#EF4444'; // 입금: 초록, 출금: 빨강
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* 거래 아이콘 */}
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/images/icons/settlement.png')}
            style={styles.transactionIcon}
            contentFit="contain"
          />
        </View>

        {/* 거래 정보 */}
        <View style={styles.transactionInfo}>
          <Text style={styles.transactorName}>{transaction.transactorName}</Text>
          {transaction.eventTitle && (
            <Text style={styles.eventTitle}>{transaction.eventTitle}</Text>
          )}
          <Text style={styles.dateTime}>
            {transaction.formattedDate} {transaction.formattedTime}
          </Text>
        </View>
      </View>

      {/* 거래 금액 */}
      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          { color: getAmountColor(transaction.isDeposit) }
        ]}>
          {transaction.formattedAmount}
        </Text>
        <Text style={styles.afterBalance}>
          잔액 {parseInt(transaction.transactionAfterBalance).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIcon: {
    width: 24,
    height: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  afterBalance: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});