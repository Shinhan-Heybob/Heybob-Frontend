import { getAvatarById } from '@/src/shared/data/avatars';
import { User } from '@/src/shared/types/auth';
import { Button, Text } from '@/src/shared/ui';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

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
  const avatarImage = getAvatarById(user.avatarId);

  // 한글명만 추출 (괄호 앞 부분)
  const getKoreanName = (fullName: string) => {
    const koreanName = fullName.split(' (')[0];
    return koreanName;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            {/* 학생증 정보 섹션 */}
            <View style={styles.studentCardSection}>
              {/* 카드 헤더 */}
              <View style={styles.cardHeader}>
                <Text variant="body" style={styles.cardTitle}>
                  모바일 학생증
                </Text>
              </View>

              {/* 학생 정보 */}
              <View style={styles.studentInfo}>
                {/* 아바타 */}
                <View style={styles.avatarContainer}>
                  <Image
                    source={avatarImage}
                    style={styles.avatar}
                    contentFit="contain"
                  />
                </View>

                {/* 정보 텍스트 */}
                <View style={styles.infoContainer}>
                  <Text variant="body" style={styles.schoolInfo}>
                    {getKoreanName(user.school.name)} / {getKoreanName(user.department.name)}
                  </Text>
                  <Text variant="title" style={styles.nameInfo}>
                    {user.name}({user.studentId})
                  </Text>
                </View>
              </View>
            </View>
            
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
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
    borderWidth:1,
    borderColor:'#E5E7EB'
  },
  studentCardSection: {
    width: '100%',
    marginBottom: 12,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    flex: 1,
  },
  schoolInfo: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  nameInfo: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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