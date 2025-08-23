import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Text, Button } from '@/src/shared/ui';
import { User } from '@/src/shared/types/auth';

interface StudentQRData {
  studentId: string;
  name: string;
  schoolId: string;
  departmentId: string;
  issueTime: number;
}

interface QRModalProps {
  visible: boolean;
  user: User;
  onClose: () => void;
}

// QR 데이터 생성 함수
const generateQRData = (user: User): string => {
  const qrData: StudentQRData = {
    studentId: user.studentId,
    name: user.name,
    schoolId: user.school.id,
    departmentId: user.department.id,
    issueTime: Date.now(), // 현재 시간 (5분 유효)
  };
  
  return JSON.stringify(qrData);
};

export const QRModal: React.FC<QRModalProps> = ({ visible, user, onClose }) => {
  const qrData = generateQRData(user);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.container}>
          {/* 제목 */}
          <Text variant="title" style={styles.title}>
            디지털 학생증
          </Text>
          
          {/* QR 코드 */}
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={200}
              backgroundColor="white"
              color="black"
              enableLinearGradient={false}
            />
          </View>
          
          {/* 사용자 정보 */}
          <View style={styles.userInfo}>
            <Text variant="body" style={styles.userName}>
              {user.name}
            </Text>
            <Text variant="caption" style={styles.userDetails}>
              {user.studentId} | {user.school.name}
            </Text>
            <Text variant="caption" style={styles.userDetails}>
              {user.department.name}
            </Text>
          </View>
          
          {/* 유효시간 안내 */}
          <Text variant="caption" style={styles.validityText}>
            ⏰ 5분간 유효합니다
          </Text>
          
          {/* 닫기 버튼 */}
          <Button
            title="닫기"
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  title: {
    marginBottom: 24,
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userDetails: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  validityText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  closeButton: {
    width: '100%',
  },
});