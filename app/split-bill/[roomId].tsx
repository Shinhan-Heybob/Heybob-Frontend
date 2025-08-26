import { SplitBillScreen } from '@/src/features/split-bill/ui/SplitBillScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function SplitBillPage() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  if (!roomId || Array.isArray(roomId)) {
    return null;
  }

  return <SplitBillScreen roomId={roomId} />;
}