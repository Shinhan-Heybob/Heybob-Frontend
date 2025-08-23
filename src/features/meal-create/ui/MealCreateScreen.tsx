import { Button, Text } from '@/src/shared/ui';
import { useMealCreateStore } from '@/src/store';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AvailableTimeSlots } from './components/AvailableTimeSlots';
import { DateSelector } from './components/DateSelector';
import { FriendSearchButton } from './components/FriendSearchButton';
import { SelectedFriendsList } from './components/SelectedFriendsList';
import { StepProgress } from './components/StepProgress';

export const MealCreateScreen: React.FC = () => {
  // console.log('MealCreateScreen 렌더링 시작');
  
  const { selectedTimeSlot, selectedFriends } = useMealCreateStore();
  // console.log('Store 데이터:', { selectedTimeSlot, selectedFriends });

  // 밥약 만들러 가기 버튼 활성화 조건
  const isCreateButtonEnabled = selectedTimeSlot !== null;

  const handleCreateMeal = () => {
    if (!isCreateButtonEnabled) return;
    
    // TODO: 2단계로 이동
    console.log('밥약 만들러 가기 - 2단계로 이동');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text variant="title" style={styles.headerTitle}>
          밥약 만들기
        </Text>
      </View>

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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 하단 버튼 공간 확보
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