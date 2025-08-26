import { Stack } from 'expo-router';

export default function GroupsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create/index" />
      <Stack.Screen name="create/find-friends" />
      <Stack.Screen name="create/savings-account" />
      <Stack.Screen name="create/success" />
    </Stack>
  );
}