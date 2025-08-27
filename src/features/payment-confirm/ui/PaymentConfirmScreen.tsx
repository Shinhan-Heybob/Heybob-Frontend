import { MealInfoCard } from '@/src/shared/ui/atoms/MealInfoCard';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePaymentStore } from '../model/paymentStore';

interface PaymentConfirmScreenProps {
  roomId: string;
  amount: number;
  messageId: string;
}

export const PaymentConfirmScreen: React.FC<PaymentConfirmScreenProps> = ({
  roomId,
  amount,
  messageId,
}) => {
  const {
    mealInfo,
    isMealInfoLoading,
    isProcessing,
    error,
    loadMealInfo,
    cancelPayment,
    confirmPayment,
    reset,
    clearError,
  } = usePaymentStore();

  // 컴포넌트 마운트 시 밥약 정보 로드
  useEffect(() => {
    loadMealInfo(roomId);
    
    return () => {
      reset();
    };
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

  // 취소 버튼
  const handleCancel = async () => {
    const success = await cancelPayment(messageId);
    if (success) {
      router.back();
    }
  };

  // 정산하기 버튼
  const handleConfirm = async () => {
    const success = await confirmPayment(messageId);
    if (success) {
      Alert.alert('완료', '정산이 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => router.back()
        }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>1/N 하기</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* 밥약 정보 카드 */}
        <MealInfoCard 
          mealInfo={mealInfo}
          isLoading={isMealInfoLoading}
        />

        {/* 메인 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/mealSuccess.png')}
            style={styles.mealImage}
            contentFit="contain"
          />
        </View>

        {/* 1인당 정산 금액 */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>1인당 정산 금액</Text>
          <Text style={styles.amountText}>
            {amount.toLocaleString()}원
          </Text>
        </View>
      </View>

      {/* 하단 버튼들 */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.cancelButton, isProcessing && styles.disabledButton]}
            onPress={handleCancel}
            disabled={isProcessing}
          >
            <Text style={[styles.cancelButtonText, isProcessing && styles.disabledButtonText]}>
              취소
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.confirmButton, isProcessing && styles.disabledButton]}
            onPress={handleConfirm}
            disabled={isProcessing}
          >
            <Text style={[styles.confirmButtonText, isProcessing && styles.disabledButtonText]}>
              {isProcessing ? '처리 중...' : '정산하기'}
            </Text>
          </TouchableOpacity>
        </View>
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
  imageContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  mealImage: {
    width: 250,
    height: 200,
  },
  amountContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginVertical: 24,
  },
  amountLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
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
  confirmButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#10B981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
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