import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function MainLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}