import { Button, Text } from '@/src/shared/ui';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { MealCreateHeader } from './MealCreateHeader';
import { StepProgress } from './StepProgress';

interface MealSuccessScreenProps {
  onBackPress?: () => void;
}

export const MealSuccessScreen: React.FC<MealSuccessScreenProps> = ({ onBackPress }) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleGoToChatroom = () => {
    // TODO: 채팅방으로 이동 또는 메인으로 이동
    console.log('밥약 채팅방 입장하기');
    router.back(); // 임시로 뒤로가기
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <MealCreateHeader onBackPress={handleBackPress} />

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 진행 단계 바 */}
        <StepProgress currentStep={3} totalSteps={3} />

        {/* 성공 콘텐츠 */}
        <View style={styles.successContent}>
          {/* 성공 일러스트 */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('@/assets/images/mealSuccess.png')} 
              style={styles.successImage} 
              resizeMode="contain"
            />
          </View>

          {/* 축하 메시지 */}
          <View style={styles.messageContainer}>
            <Text style={styles.successMessage}>
              축하해요! 밥약이 만들어졌어요!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <Button
          title="밥약 채팅방 입장하기"
          onPress={handleGoToChatroom}
          style={styles.chatroomButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  successImage: {
    width: 200,
    height: 200,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  successMessage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 32,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  chatroomButton: {
    width: '100%',
  },
});