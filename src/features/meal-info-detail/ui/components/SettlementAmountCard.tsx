import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SettlementAmountCardProps {
  date: string;
  amount: number;
}

export const SettlementAmountCard: React.FC<SettlementAmountCardProps> = ({
  date,
  amount,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.dateText}>{date}일 정산</Text>
      <Text style={styles.separator}>•</Text>
      <Text style={styles.amountText}>{amount.toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  separator: {
    fontSize: 18,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});