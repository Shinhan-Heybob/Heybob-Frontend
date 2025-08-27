import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useUserStore } from '../../model/userStore';
import { getAvatarById } from '@/src/shared/data/avatars';

export const ProfileSection: React.FC = () => {
  const { profile, isLoading, changeAvatarRandomly } = useUserStore();

  const handleChangeAvatar = async () => {
    try {
      await changeAvatarRandomly();
    } catch (error) {
      Alert.alert('오류', '아바타 변경에 실패했습니다.');
    }
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
        {/* 아바타 이미지 */}
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

        {/* 사용자 정보 */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.studentId}>({profile.studentId})</Text>
        </View>
      </View>
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
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
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
    backgroundColor: '#10B981',
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
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    padding: 20,
  },
});