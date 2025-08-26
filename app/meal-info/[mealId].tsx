import { MealInfoDetailScreen } from '@/src/features/meal-info-detail/ui/MealInfoDetailScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function MealInfoPage() {
  const { mealId } = useLocalSearchParams<{ mealId: string }>();

  if (!mealId || Array.isArray(mealId)) {
    return null;
  }

  return <MealInfoDetailScreen mealId={mealId} />;
}