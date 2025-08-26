import { Button } from '@/src/shared/ui';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DateSelector } from '../../../shared/ui/molecules/DateSelector';
import { SelectedFriendsList } from '../../../shared/ui/molecules/SelectedFriendsList';
import { StepProgress } from '../../../shared/ui/molecules/StepProgress';
import { FriendSearchButton } from '../../meal-create/ui/components/FriendSearchButton';
import { MealCreateHeader } from '../../meal-create/ui/components/MealCreateHeader';
import { useGroupCreateStore } from '../model/groupCreateStore';
import { GroupDetailsScreen } from './GroupDetailsScreen';
import { GroupSuccessScreen } from './GroupSuccessScreen';

export const GroupCreateScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const groupStore = useGroupCreateStore();
  const { selectedDate, selectedFriends } = groupStore;

  // 모임 만들기 버튼 활성화 조건 (공강시간대는 필요없고 날짜와 친구만 필요)
  const isCreateButtonEnabled = selectedDate !== null && selectedFriends.length > 0;

  const handleCreateGroup = () => {
    if (!isCreateButtonEnabled) return;
    
    // 2단계로 이동
    setCurrentStep(2);
  };

  const handleBackToCreateGroup = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else {
      router.back();
    }
  };
  
  // 3단계인 경우 GroupSuccessScreen 렌더링
  if (currentStep === 3) {
    return <GroupSuccessScreen onBackPress={() => setCurrentStep(2)} />;
  }
  
  // 2단계인 경우 GroupDetailsScreen 렌더링
  if (currentStep === 2) {
    return <GroupDetailsScreen 
      onBackPress={() => setCurrentStep(1)} 
      onNext={() => setCurrentStep(3)} 
    />;
  }

  // 1단계 렌더링
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <MealCreateHeader 
        title="모임 만들기"
        onBackPress={handleBackToCreateGroup} 
      />

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 진행 단계 바 */}
        <StepProgress currentStep={1} totalSteps={3} />

        {/* 날짜 선택 */}
        <DateSelector store={groupStore} />

        {/* 친구 검색 버튼 */}
        <FriendSearchButton />

        {/* 선택된 친구들 목록 */}
        {selectedFriends.length > 0 && <SelectedFriendsList store={groupStore} />}
        
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <Button
          title="모임 만들러 가기"
          onPress={handleCreateGroup}
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