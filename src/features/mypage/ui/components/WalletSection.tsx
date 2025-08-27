import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mypageApi } from '../../api/mypageApi';
import { DepositModal } from './DepositModal';

export const WalletSection: React.FC = () => {
  const [accountNo, setAccountNo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // 컴포넌트 마운트 시 계좌번호 로드
  useEffect(() => {
    loadAccountNo();
  }, []);

  const loadAccountNo = async () => {
    setIsLoading(true);
    try {
      const response = await mypageApi.getAccountNo();
      if (response.success) {
        setAccountNo(response.data.accountNo);
      } else {
        Alert.alert('오류', response.error || '계좌번호를 불러오는데 실패했습니다');
      }
    } catch (error) {
      Alert.alert('오류', '계좌번호를 불러오는 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAccountNo = (accountNo: string): string => {
    if (accountNo.length === 16) {
      return `${accountNo.slice(0, 3)}-${accountNo.slice(3, 6)}-${accountNo.slice(6)}`;
    }
    return accountNo;
  };

  const handleDeposit = () => {
    setShowDepositModal(true);
  };

  const handleDepositSuccess = () => {
    // 입금 성공 시 필요한 추가 작업 (계좌내역 새로고침 등)
    console.log('입금 성공 - 계좌내역 새로고침 필요');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>내 지갑</Text>
      
      <View style={styles.card}>
        {/* 계좌 정보 */}
        <View style={styles.accountInfo}>
          <Text style={styles.bankName}>신한</Text>
          <Text style={styles.accountNumber}>
            {isLoading ? '로딩 중...' : formatAccountNo(accountNo)}
          </Text>
        </View>

        {/* 입금하기 버튼 */}
        <TouchableOpacity 
          style={styles.depositButton}
          onPress={handleDeposit}
          disabled={isLoading}
        >
          <Text style={styles.depositButtonText}>입금하기</Text>
        </TouchableOpacity>
      </View>

      {/* 입금 모달 */}
      <DepositModal
        visible={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={handleDepositSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accountInfo: {
    marginBottom: 16,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  depositButton: {
    backgroundColor: '#7BBBFB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  depositButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});