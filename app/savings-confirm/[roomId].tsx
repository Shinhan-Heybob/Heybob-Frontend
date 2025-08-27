import { SavingsConfirmScreen } from '@/src/features/savings-confirm/ui/SavingsConfirmScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function SavingsConfirmPage() {
  const { roomId, amount, messageId } = useLocalSearchParams<{
    roomId: string;
    amount: string;
    messageId: string;
  }>();

  if (!roomId || !amount || !messageId) {
    return null;
  }

  return (
    <SavingsConfirmScreen
      roomId={roomId}
      amount={parseInt(amount)}
      messageId={messageId}
    />
  );
}