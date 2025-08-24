import { MealChatInfoScreen } from '@/src/features/meal-info/ui/MealChatInfoScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function MealInfoPage() {
  const { mealId } = useLocalSearchParams<{ mealId: string }>();

  if (!mealId) {
    return null;
  }

  return (
    <MealChatInfoScreen mealId={mealId} />
  );
}