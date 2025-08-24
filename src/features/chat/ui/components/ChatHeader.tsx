import { Text } from '@/src/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ChatHeaderProps {
  roomTitle?: string;
  onBackPress?: () => void;
  onMealInfoPress?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  roomTitle = '학식 먹으러 가는 팟',
  onBackPress,
  onMealInfoPress,
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.replace('/(main)');
    }
  };

  const handleMealInfoPress = () => {
    if (onMealInfoPress) {
      onMealInfoPress();
    } else {
      // TODO: 밥약 정보 페이지로 이동
      console.log('밥약 정보 보기');
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#3B82F6" />
      </TouchableOpacity>

      {/* 제목 */}
      <Text style={styles.title}>{roomTitle}</Text>

      {/* 여백 */}
      <View style={styles.placeholder} />

      {/* 밥약 정보 버튼 */}
      <TouchableOpacity style={styles.mealInfoButton} onPress={handleMealInfoPress}>
        <View style={styles.mealInfoContent}>
          <Image 
            source={require('@/assets/images/icons/volume.png')} 
            style={{ width: 16, height: 16 }} 
          />
          <Text style={styles.mealInfoText}>밥약 정보 보러가기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    position: 'absolute',
    top: 64,
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  placeholder: {
    height: 4,
  },
  mealInfoButton: {
    // backgroundColor: '#FEF2F2',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#000000ff',
  },
  mealInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealInfoText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    marginLeft: 6,
  },
});