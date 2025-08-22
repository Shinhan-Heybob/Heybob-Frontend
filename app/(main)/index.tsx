import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button } from '@/src/shared/ui';
import { useAuthStore } from '@/src/store';

export default function HomePage() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Text variant="title" className="mb-6">
        환영합니다! 🎉
      </Text>
      
      {user && (
        <View className="mb-8 items-center">
          <Text variant="body" className="mb-2">
            이름: {user.name}
          </Text>
          <Text variant="body" className="mb-2">
            학번: {user.studentId}
          </Text>
          <Text variant="body" className="mb-2">
            학교: {user.school.name}
          </Text>
        </View>
      )}

      <Text variant="body" className="text-center text-gray-500 mb-8">
        메인 홈 화면입니다.
        {'\n'}여기에 실제 앱 기능들이 들어갈 예정입니다.
      </Text>

      <Button
        title="로그아웃"
        onPress={handleLogout}
        variant="secondary"
      />
    </View>
  );
}