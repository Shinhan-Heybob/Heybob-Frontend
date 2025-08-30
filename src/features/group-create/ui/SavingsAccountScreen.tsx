import { Button, Text } from '@/src/shared/ui';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { StepProgress } from '../../../shared/ui/molecules/StepProgress';
import { MealCreateHeader } from '../../meal-create/ui/components/MealCreateHeader';
import { useGroupCreateStore } from '../model/groupCreateStore';
import { groupApi } from '@/src/shared/api/groupApi';

export const SavingsAccountScreen: React.FC = () => {
  const { selectedFriends, setAmountPerPerson: setStoreAmountPerPerson, savingsInfo, createdMeetingId } = useGroupCreateStore();
  const [amountPerPerson, setAmountPerPerson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBackPress = () => {
    router.back();
  };

  const handleCreateGroup = async () => {
    // 1인당 금액이 입력되었는지 확인
    if (!amountPerPerson.trim() || isNaN(Number(amountPerPerson))) {
      return;
    }

    if (!createdMeetingId) {
      Alert.alert('오류', '모임 정보를 찾을 수 없습니다.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 1단계: 모임 상세 정보를 조회하여 chatRoomId 획득
      const meetingDetailResult = await groupApi.getMeetingDetail(createdMeetingId);
      
      if (!meetingDetailResult.success || !meetingDetailResult.data) {
        Alert.alert('오류', meetingDetailResult.error || '모임 정보를 불러올 수 없습니다.');
        return;
      }

      const chatRoomId = meetingDetailResult.data.chatRoomId;
      
      // 2단계: 획득한 chatRoomId로 적금 계좌 생성 API 호출
      const result = await groupApi.createSavingsAccount(chatRoomId, {
        perHeadBalance: Number(amountPerPerson),
        totalAmount: savingsInfo?.totalAmount || 0
      });

      if (result.success) {
        // 모임 생성 완료 페이지로 이동
        router.push('/groups/create/success');
      } else {
        Alert.alert('오류', result.error || '적금 계좌 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating savings account:', error);
      Alert.alert('오류', '적금 계좌 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // store에서 적금 정보 가져오기 또는 기본값 사용
  const startDate = savingsInfo?.startDate || new Date().toISOString().split('T')[0];
  const endDate = savingsInfo?.endDate || new Date().toISOString().split('T')[0];
  const interestRate = savingsInfo?.interestRate || '5%';
  const paymentCycle = savingsInfo?.paymentCycle || '일주일';

  // 현재 입력값이 있을 때만 목표 금액 표시
  const currentAmount = Number(amountPerPerson);
  const targetAmount = (currentAmount > 0 && savingsInfo?.totalAmount) ? savingsInfo.totalAmount : 0;

  // 버튼 활성화 조건
  const isCreateButtonEnabled = amountPerPerson.trim().length > 0 && !isNaN(Number(amountPerPerson)) && Number(amountPerPerson) > 0;

  // 1인당 금액이 변경될 때 store 업데이트
  useEffect(() => {
    const amount = Number(amountPerPerson);
    if (amount > 0) {
      setStoreAmountPerPerson(amount);
    }
  }, [amountPerPerson, setStoreAmountPerPerson]);

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
              (주 {formatCurrency(Number(amountPerPerson))} × 12주 × {selectedFriends.length + 1}명 + 이자 5%)
            </Text>
          </View>
        )}
        
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomContainer}>
        <Button
          title={isLoading ? "생성 중..." : "모임 만들기"}
          onPress={handleCreateGroup}
          disabled={!isCreateButtonEnabled || isLoading}
          style={[
            styles.createButton,
            (!isCreateButtonEnabled || isLoading) && styles.createButtonDisabled
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