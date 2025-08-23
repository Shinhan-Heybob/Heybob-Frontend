import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function MealsLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      >
        <Stack.Screen name="create" />
      </Stack>
    </>
  );
}