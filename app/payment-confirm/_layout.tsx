import { Stack } from 'expo-router';
import React from 'react';

export default function PaymentConfirmLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[roomId]" />
    </Stack>
  );
}