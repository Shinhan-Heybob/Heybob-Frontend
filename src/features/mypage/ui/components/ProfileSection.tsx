import { getAvatarById } from '@/src/shared/data/avatars';
import { QRModal } from '@/src/shared/ui/molecules/QRModal';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../../model/userStore';

export const ProfileSection: React.FC = () => {
  const { profile, isLoading, changeAvatarRandomly } = useUserStore();
  const [showQRModal, setShowQRModal] = useState(false);

  const handleChangeAvatar = async () => {
    try {
      await changeAvatarRandomly();
    } catch (error) {
      Alert.alert('오류', '아바타 변경에 실패했습니다.');
    }
  };

  const handleShowStudentCard = () => {
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>프로필 정보를 불러올 수 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* 왼쪽: 아바타 이미지 */}
        <View style={styles.avatarContainer}>
          <Image
            source={getAvatarById(profile.profileImage)}
            style={styles.avatar}
            contentFit="contain"
          />
          
          {/* 아바타 변경 버튼 */}
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={handleChangeAvatar}
            disabled={isLoading}
          >
            <Image
              source={require('@/assets/images/icons/repeat.png')}
              style={styles.changeIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* 오른쪽: 사용자 정보 */}
        <View style={styles.userInfo}>
          <Text style={styles.schoolInfo}>싸피대학교 / 컴퓨터공학과</Text>
          <Text style={styles.userName}>{profile.name}({profile.studentId})</Text>
          <TouchableOpacity 
            style={styles.studentCardButton}
            onPress={handleShowStudentCard}
          >
            <Image
              source={require('@/assets/images/icons/qr.png')}
              style={styles.qrIcon}
              contentFit="contain"
            />
            <Text style={styles.studentCardText}>모바일 학생증</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* QR 모달 */}
      {showQRModal && profile && (
        <QRModal
          visible={showQRModal}
          onClose={handleCloseQRModal}
          user={{
            id: profile.id,
            name: profile.name,
            studentId: profile.studentId,
            avatarId: profile.profileImage,
            school: { id: '1', name: '싸피대학교' },
            department: { id: 'dept_01', name: '컴퓨터공학과', schoolId: '1' }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 5, // 오른쪽 사용자 정보와의 간격
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  changeButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CDD0FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
  },
  userInfo: {
    flex: 1, // 남은 공간 모두 사용
    alignItems: 'center', // 왼쪽 정렬
  },
  schoolInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  studentCardButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8, // 입금하기 버튼과 동일한 radius
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center', // 가운데 정렬
    minWidth: 140, // 최소 너비 설정
  },
  qrIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#6B7280',
  },
  studentCardText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    padding: 20,
  },
});