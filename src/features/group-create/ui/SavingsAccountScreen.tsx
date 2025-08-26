import { Button, Text } from '@/src/shared/ui';
import { useMealCreateStore } from '@/src/store';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { MealCreateHeader } from '../../meal-create/ui/components/MealCreateHeader';
import { StepProgress } from '../../meal-create/ui/components/StepProgress';

export const SavingsAccountScreen: React.FC = () => {
  const { selectedFriends } = useMealCreateStore();
  const [amountPerPerson, setAmountPerPerson] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBackPress = () => {
    router.back();
  };

  const handleCreateGroup = () => {
    // 1인당 금액이 입력되었는지 확인
    if (!amountPerPerson.trim() || isNaN(Number(amountPerPerson))) {
      return;
    }
    
    // 모임 생성 완료 페이지로 이동
    router.push('/groups/create/success');
  };

  // 오늘 날짜 계산
  const today = new Date();
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 3개월 후 날짜 계산
  const getDateAfterMonths = (months: number) => {
    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + months);
    return futureDate;
  };

  const startDate = formatDate(today);
  const endDate = formatDate(getDateAfterMonths(3));
  const interestRate = '5%';
  const paymentCycle = '일주일';

  // 목표 금액 계산 (선택된 친구 수 + 본인 = 총 인원)
  const totalMembers = selectedFriends.length + 1;
  const targetAmount = amountPerPerson ? Number(amountPerPerson) * totalMembers : 0;

  // 버튼 활성화 조건
  const isCreateButtonEnabled = amountPerPerson.trim().length > 0 && !isNaN(Number(amountPerPerson)) && Number(amountPerPerson) > 0;

  // 목표금액이 생성될 때 자동으로 스크롤
  useEffect(() => {
    if (targetAmount > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [targetAmount]);

  const handleAmountFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 400, animated: true });
    }, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* 헤더 */}
      <MealCreateHeader 
        title="적금 만들기"
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

        {/* 적금 정보 섹션들 */}
        
        {/* 적금 시작일 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>적금 시작일</Text>
            <Text style={styles.infoValue}>{startDate}</Text>
          </View>
        </View>

        {/* 적금 만료일 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>적금 만료일</Text>
            <Text style={styles.infoValue}>{endDate}</Text>
          </View>
        </View>

        {/* 이자율 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>이자율</Text>
            <Text style={styles.infoValue}>{interestRate}</Text>
          </View>
        </View>

        {/* 납부 주기 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>납부 주기</Text>
            <Text style={styles.infoValue}>{paymentCycle}</Text>
          </View>
        </View>

        {/* 1인당 금액 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>1인당 금액</Text>
          <TextInput
            style={styles.textInput}
            value={amountPerPerson}
            onChangeText={setAmountPerPerson}
            onFocus={handleAmountFocus}
            placeholder="1인당 금액을 입력하세요"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        {/* 목표 금액 표시 */}
        {targetAmount > 0 && (
          <View style={styles.targetAmountContainer}>
            <Text style={styles.targetAmountLabel}>목표 금액</Text>
            <Text style={styles.targetAmountValue}>
              {formatCurrency(targetAmount)}
            </Text>
            <Text style={styles.targetAmountDetail}>
              ({formatCurrency(Number(amountPerPerson))} × {totalMembers}명)
            </Text>
          </View>
        )}
        
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <Button
          title="모임 만들기"
          onPress={handleCreateGroup}
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
  infoContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 16,
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
  targetAmountContainer: {
    backgroundColor: '#EBF8FF',
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
    marginBottom:50
  },
  targetAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D4ED8',
    marginBottom: 8,
  },
  targetAmountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  targetAmountDetail: {
    fontSize: 14,
    color: '#3B82F6',
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