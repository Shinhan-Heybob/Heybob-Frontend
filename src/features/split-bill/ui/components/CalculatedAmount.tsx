import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CalculatedAmountProps {
  amount: number | null;
  isVisible: boolean;
}

export const CalculatedAmount: React.FC<CalculatedAmountProps> = ({
  amount,
  isVisible,
}) => {
  if (!isVisible || amount === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>1인당 정산 금액</Text>
      <Text style={styles.amount}>
        {amount.toLocaleString()}원
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 24,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
});