import { Button } from '@/src/shared/ui';
import { useMealCreateStore } from '@/src/store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AvailableTimeSlots } from './components/AvailableTimeSlots';
import { DateSelector } from './components/DateSelector';
import { FriendSearchButton } from './components/FriendSearchButton';
import { MealCreateHeader } from './components/MealCreateHeader';
import { MealDetailsScreen } from './components/MealDetailsScreen';
import { MealSuccessScreen } from './components/MealSuccessScreen';
import { SelectedFriendsList } from './components/SelectedFriendsList';
import { StepProgress } from './components/StepProgress';

export const MealCreateScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { selectedTimeSlot, selectedFriends } = useMealCreateStore();

  // 밥약 만들러 가기 버튼 활성화 조건
  const isCreateButtonEnabled = selectedTimeSlot !== null;

  const handleCreateMeal = () => {
    if (!isCreateButtonEnabled) return;
    
    // 2단계로 이동
    setCurrentStep(2);
  };

  const handleBackToCreateMeal = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else {
      router.back();
    }
  };
  
  // 3단계인 경우 MealSuccessScreen 렌더링
  if (currentStep === 3) {
    return <MealSuccessScreen onBackPress={() => setCurrentStep(2)} />;
  }
  
  // 2단계인 경우 MealDetailsScreen 렌더링
  if (currentStep === 2) {
    return <MealDetailsScreen 
      onBackPress={() => setCurrentStep(1)} 
      onNext={() => setCurrentStep(3)} 
    />;
  }

  // 1단계 렌더링
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <MealCreateHeader onBackPress={handleBackToCreateMeal} />

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 진행 단계 바 */}
        <StepProgress currentStep={1} totalSteps={3} />

        {/* 날짜 선택 */}
        <DateSelector />

        {/* 친구 검색 버튼 */}
        <FriendSearchButton />

        {/* 선택된 친구들 목록 */}
        {selectedFriends.length > 0 && <SelectedFriendsList />}

        {/* 공강 시간대 표시 */}
        <AvailableTimeSlots />
        
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <Button
          title="밥약 만들러 가기"
          onPress={handleCreateMeal}
          disabled={!isCreateButtonEnabled}
          style={[
            styles.createButton,
            !isCreateButtonEnabled && styles.createButtonDisabled
          ]}
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
  createButton: {
    width: '100%',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
});