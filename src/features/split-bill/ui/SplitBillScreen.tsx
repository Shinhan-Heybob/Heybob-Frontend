import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSplitBillStore } from '../model/splitBillStore';
import { settlementApi } from '../api/settlementApi';
import { mealInfoApi } from '@/src/features/meal-info/api/mealInfoApi';
import { AmountInput } from './components/AmountInput';
import { CalculatedAmount } from './components/CalculatedAmount';
import { FriendSelector } from './components/FriendSelector';

interface SplitBillScreenProps {
  roomId: string;
}

export const SplitBillScreen: React.FC<SplitBillScreenProps> = ({ roomId }) => {
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [showCalculatedAmount, setShowCalculatedAmount] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  
  const {
    selectedFriendIds,
    totalAmount,
    isLoading,
    error,
    toggleFriend,
    setTotalAmount,
    reset,
    clearError,
  } = useSplitBillStore();

  // 참여자 정보 로드
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setIsLoadingParticipants(true);
        const result = await mealInfoApi.getMealAppointmentInfo(roomId);
        
        if (result.success && result.data) {
          // 참여자 목록을 FriendSelector에서 사용할 수 있는 형태로 변환
          const participantsList = result.data.participants.map((participant, index) => ({
            id: participant.studentId || index.toString(),
            name: participant.name,
            studentId: participant.studentId,
            department: participant.department,
            avatarId: participant.profileUrl || 'avatar_01'
          }));
          
          setParticipants(participantsList);
        }
      } catch (error) {
        console.error('참여자 정보 로드 실패:', error);
        Alert.alert('오류', '참여자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    loadParticipants();
  }, [roomId]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Alert.alert('오류', error, [
        { text: '확인', onPress: clearError }
      ]);
    }
  }, [error]);

  // 뒤로가기
  const handleBackPress = () => {
    router.back();
  };

  // 1인당 금액 계산 (프론트엔드)
  const handleCalculateAmount = () => {
    // 유효성 검사
    if (!totalAmount || totalAmount.trim() === '') {
      Alert.alert('오류', '총 금액을 입력해주세요.');
      return;
    }

    if (selectedFriendIds.length === 0) {
      Alert.alert('오류', '정산할 친구를 선택해주세요.');
      return;
    }

    // 총 금액을 숫자로 변환 (콤마 제거)
    const total = parseInt(totalAmount.replace(/,/g, ''));
    
    if (total <= 0) {
      Alert.alert('오류', '금액은 0보다 커야 합니다.');
      return;
    }

    // 1인당 금액 계산 (소수점 버림)
    const perPerson = Math.floor(total / selectedFriendIds.length);
    
    setCalculatedAmount(perPerson);
    setShowCalculatedAmount(true);
  };

  // 취소 (API 호출 없음)
  const handleCancel = () => {
    reset();
    router.back();
  };

  // 정산 요청 API 호출
  const handleSettlement = async () => {
    if (!showCalculatedAmount || calculatedAmount === null) {
      Alert.alert('오류', '먼저 금액을 계산해주세요.');
      return;
    }

    try {
      const totalAmountNumber = parseInt(totalAmount.replace(/,/g, ''));
      
      const result = await settlementApi.createSettlement(roomId, {
        totalAmount: totalAmountNumber,
        participantIds: selectedFriendIds,
        description: '1/N 정산'
      });

      if (result.success) {
        Alert.alert('완료', '정산을 요청했습니다!', [
          {
            text: '확인',
            onPress: () => {
              reset();
              setCalculatedAmount(null);
              setShowCalculatedAmount(false);
              router.back();
            }
          }
        ]);
      } else {
        Alert.alert('오류', result.error || '정산 요청에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '정산 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>1/N 정산하기</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 금액 입력 */}
        <View style={styles.section}>
          <AmountInput
            value={totalAmount}
            onChangeText={setTotalAmount}
            onCalculatePress={handleCalculateAmount}
          />
        </View>

        {/* 계산된 금액 표시 */}
        <CalculatedAmount
          amount={calculatedAmount}
          isVisible={showCalculatedAmount}
        />

        {/* 친구 선택 */}
        <View style={styles.section}>
          <FriendSelector
            selectedFriendIds={selectedFriendIds}
            onToggleFriend={toggleFriend}
            participants={participants}
            isLoading={isLoadingParticipants}
          />
        </View>
      </ScrollView>

      {/* 하단 버튼들 */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.settlementButton,
              !showCalculatedAmount && styles.disabledButton
            ]}
            onPress={handleSettlement}
            disabled={!showCalculatedAmount}
          >
            <Text style={[
              styles.settlementButtonText,
              !showCalculatedAmount && styles.disabledButtonText
            ]}>
              정산하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  bottomSection: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  settlementButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#10B981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settlementButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
});