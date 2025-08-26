import { Button, Text } from '@/src/shared/ui';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { MealCreateHeader } from '../../meal-create/ui/components/MealCreateHeader';
import { StepProgress } from '../../meal-create/ui/components/StepProgress';

interface GroupSuccessScreenProps {
  onBackPress?: () => void;
}

export const GroupSuccessScreen: React.FC<GroupSuccessScreenProps> = ({ onBackPress }) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleGoToGroup = () => {
    // 임시 모임 ID로 모임 정보 페이지 이동 (나중에 실제 API 연동 시 수정)
    const tempGroupId = 'group-123';
    
    console.log('모임 정보 페이지로 이동:', tempGroupId);
    // 일단 메인 페이지로 이동
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <MealCreateHeader 
        title="모임 만들기"
        onBackPress={handleBackPress} 
      />

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
              축하해요! 모임이 만들어졌어요!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <Button
          title="모임 보러가기"
          onPress={handleGoToGroup}
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