import { Stack } from 'expo-router';
import React from 'react';

export default function MealInfoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[mealId]" />
    </Stack>
  );
}