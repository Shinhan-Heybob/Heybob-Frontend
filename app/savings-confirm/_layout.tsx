import { Stack } from 'expo-router';

export default function SavingsConfirmLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[roomId]" />
    </Stack>
  );
}