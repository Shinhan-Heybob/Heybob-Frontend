import { Stack } from 'expo-router';
import React from 'react';

export default function MealLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[mealId]" />
    </Stack>
  );
}