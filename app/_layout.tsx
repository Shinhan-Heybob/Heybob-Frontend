import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Text } from '@/src/shared/ui';
import { useAuthStore } from '@/src/store';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 인증 상태에 따른 자동 네비게이션
  useEffect(() => {
    if (!loaded || isLoading) return;

    // 약간의 지연을 두어 컴포넌트가 완전히 마운트된 후 네비게이션
    setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)';
      const inMainGroup = segments[0] === '(main)';
      const inMealsGroup = segments[0] === 'meals'; // 🆕 meals 그룹 추가

      if (!isAuthenticated && !inAuthGroup) {
        // 인증 안됨 → 로그인으로
        router.replace('/(auth)/sign-in');
      } else if (isAuthenticated && !inMainGroup && !inMealsGroup) {
        // 인증됨 + main도 meals도 아님 → 메인으로
        router.replace('/(main)');
      }
    }, 100);
  }, [isAuthenticated, isLoading, loaded, segments]);

  if (!loaded) {
    return null;
  }

  if (isLoading) {
    // 로딩 화면
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text variant="body" className="text-gray-500">
          로딩 중...
        </Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="meals" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
