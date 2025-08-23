import { getAvatarById } from '@/src/shared/data/avatars';
import { Text } from '@/src/shared/ui';
import { QRModal } from '@/src/shared/ui/molecules/QRModal';
import { useAuthStore } from '@/src/store';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const StudentCard: React.FC = () => {
  const { user } = useAuthStore();
  const [showQR, setShowQR] = useState(false);

  if (!user) return null;

  const avatarImage = getAvatarById(user.avatarId);

  // 한글명만 추출 (괄호 앞 부분)
  const getKoreanName = (fullName: string) => {
    const koreanName = fullName.split(' (')[0];
    return koreanName;
  };

  const handleQRPress = () => {
    setShowQR(true);
  };

  return (
    <LinearGradient
      colors={['#787FEF', '#787FEF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <View style={styles.card}>
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

        {/* QR 버튼 */}
        <TouchableOpacity 
          style={styles.qrButton} 
          onPress={handleQRPress}
          activeOpacity={0.8}
        >
          <View style={styles.qrButtonContent}>
            <Image
              source={require('@/assets/images/icons/qr.png')}
              style={styles.qrIcon}
              contentFit="contain"
            />
            <Text variant="body" style={styles.qrButtonText}>
              QR
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* QR 모달 */}
      <QRModal
        visible={showQR}
        user={user}
        onClose={() => setShowQR(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
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
    fontSize: 20,
    fontWeight: '700',
  },
  qrButton: {
    backgroundColor: '#7BBBFB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  qrButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  qrButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});