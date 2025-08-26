import { Stack } from 'expo-router';
import React from 'react';

export default function SplitBillLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[roomId]" />
    </Stack>
  );
}