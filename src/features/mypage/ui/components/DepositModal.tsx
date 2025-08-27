import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { mypageApi } from '../../api/mypageApi';

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void; // 입금 성공 시 호출
}

export const DepositModal: React.FC<DepositModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    const numericAmount = parseInt(amount.replace(/,/g, ''));

    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('오류', '올바른 금액을 입력해주세요');
      return;
    }

    setIsLoading(true);

    try {
      const response = await mypageApi.deposit({ amount: numericAmount });
      
      if (response.success) {
        Alert.alert('입금 완료', '내 계좌로 입금되었습니다!', [
          {
            text: '확인',
            onPress: () => {
              setAmount('');
              onClose();
              onSuccess(); // 성공 콜백 호출
            }
          }
        ]);
      } else {
        Alert.alert('오류', response.error || '입금에 실패했습니다');
      }
    } catch (error) {
      Alert.alert('오류', '입금 처리 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (text: string) => {
    // 숫자만 허용
    const numericText = text.replace(/[^0-9]/g, '');
    
    // 천 단위 콤마 추가
    if (numericText) {
      const formatted = parseInt(numericText).toLocaleString();
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.modal}>
            <TouchableOpacity activeOpacity={1}>
              {/* 제목 */}
              <Text style={styles.title}>입금하기</Text>
              
              {/* 입금액 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>입금 금액</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={handleAmountChange}
                    placeholder="금액을 입력하세요"
                    keyboardType="numeric"
                    maxLength={15} // 999,999,999,999
                  />
                  <Text style={styles.unit}>원</Text>
                </View>
              </View>

              {/* 버튼들 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.confirmButton, isLoading && styles.disabledButton]}
                  onPress={handleDeposit}
                  disabled={isLoading || !amount}
                >
                  <Text style={styles.confirmButtonText}>
                    {isLoading ? '처리중...' : '입금'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'right',
    backgroundColor: '#F9FAFB',
  },
  unit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
});