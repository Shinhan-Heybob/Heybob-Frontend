import { PaymentConfirmScreen } from '@/src/features/payment-confirm/ui/PaymentConfirmScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function PaymentConfirmPage() {
  const { roomId, amount, messageId } = useLocalSearchParams<{ 
    roomId: string; 
    amount: string;
    messageId: string;
  }>();

  if (!roomId || !amount || !messageId || Array.isArray(roomId) || Array.isArray(amount) || Array.isArray(messageId)) {
    return null;
  }

  return (
    <PaymentConfirmScreen 
      roomId={roomId}
      amount={parseInt(amount)}
      messageId={messageId}
    />
  );
}