import { Button, Text } from '@/src/shared/ui';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SelectedFriendsList } from '../../../shared/ui/molecules/SelectedFriendsList';
import { StepProgress } from '../../../shared/ui/molecules/StepProgress';
import { MealCreateHeader } from '../../meal-create/ui/components/MealCreateHeader';
import { useGroupCreateStore } from '../model/groupCreateStore';

interface GroupDetailsScreenProps {
  onBackPress?: () => void;
  onNext?: () => void;
}

export const GroupDetailsScreen: React.FC<GroupDetailsScreenProps> = ({ onBackPress, onNext }) => {
  const groupStore = useGroupCreateStore();
  const { selectedDate, selectedFriends, setBasicInfo } = groupStore;
  const [groupName, setGroupName] = useState('');
  const [memo, setMemo] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleCreateSavings = () => {
    // 모임 이름과 메모가 모두 입력되었는지 확인
    if (!groupName.trim() || !memo.trim()) {
      return;
    }
    
    // 모임 기본 정보를 store에 저장
    setBasicInfo({
      title: groupName.trim(),
      description: memo.trim()
    });
    
    // 적금 만들기 페이지로 이동
    router.push('/groups/create/savings-account');
  };

  // 버튼 활성화 조건
  const isCreateButtonEnabled = groupName.trim().length > 0 && memo.trim().length > 0;

  const handleGroupNameFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 350, animated: true });
    }, 100);
  };

  const handleMemoFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 450, animated: true });
    }, 100);
  };

  // 날짜 포맷팅 (SelectedDate에서 표시용 문자열 생성)
  const formatDate = (selectedDate: { date: string; dayOfWeek: string }) => {
    return `${selectedDate.date} (${selectedDate.dayOfWeek})`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* 헤더 */}
      <MealCreateHeader 
        title="모임 만들기"
        onBackPress={handleBackPress} 
      />

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 진행 단계 바 */}
        <StepProgress currentStep={2} totalSteps={3} />

        {/* 선택된 날짜 */}
        <View style={styles.selectedInfoContainer}>
          <View style={styles.infoRow}>
            <Image 
              source={require('@/assets/images/icons/calendar.png')} 
              style={styles.icon} 
            />
            <Text style={styles.selectedText}>
              {selectedDate ? formatDate(selectedDate) : '날짜 미선택'}
            </Text>
          </View>
        </View>

        {/* 선택된 친구들 목록 */}
        <View style={styles.friendContainer}>
        {selectedFriends.length > 0 && <SelectedFriendsList readOnly={true} store={groupStore} />}
        </View>

        {/* 모임 이름 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>모임 이름 입력하기</Text>
          <TextInput
            style={styles.textInput}
            value={groupName}
            onChangeText={setGroupName}
            onFocus={handleGroupNameFocus}
            placeholder="모임 이름을 입력해주세요"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 메모 입력 */}
        <View style={[styles.inputContainer, styles.memoContainer]}>
          <Text style={styles.inputLabel}>메모 입력</Text>
          <TextInput
            style={[styles.textInput, styles.memoInput]}
            value={memo}
            onChangeText={setMemo}
            onFocus={handleMemoFocus}
            placeholder="메모를 입력해주세요"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <Button
          title="적금 만들기"
          onPress={handleCreateSavings}
          disabled={!isCreateButtonEnabled}
          style={[
            styles.createButton,
            !isCreateButtonEnabled && styles.createButtonDisabled
          ]}
        />
      </View>
    </KeyboardAvoidingView>
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
  selectedInfoContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  friendContainer:{
    marginTop: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  selectedText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  memoInput: {
    height: 100,
    paddingTop: 16,
  },
  memoContainer: {
    marginBottom: 30,
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