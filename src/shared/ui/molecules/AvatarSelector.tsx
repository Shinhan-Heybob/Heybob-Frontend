import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { getAvatarById, getRandomAvatarId } from '@/src/shared/data/avatars';
import { Button } from '../atoms/Button';

interface AvatarSelectorProps {
  selectedAvatarId: string;
  onAvatarChange: (avatarId: string) => void;
  style?: any;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatarId,
  onAvatarChange,
  style,
}) => {
  // 아바타 재생산 버튼 클릭 핸들러
  const handleRegenerateAvatar = () => {
    const newAvatarId = getRandomAvatarId();
    onAvatarChange(newAvatarId);
  };

  // 현재 선택된 아바타 이미지 가져오기
  const currentAvatarImage = getAvatarById(selectedAvatarId);

  return (
    <View style={[styles.container, style]}>
      {/* 아바타 이미지 */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity 
          style={styles.avatarImageContainer}
          onPress={handleRegenerateAvatar}
          activeOpacity={0.8}
        >
          <Image
            source={currentAvatarImage}
            style={styles.avatarImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 아바타 재생산 버튼 */}
      <Button
        title="아바타 재생산"
        onPress={handleRegenerateAvatar}
        variant="primary"
        style={styles.regenerateButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  avatarImage: {
    width: 100,
    height: 100,
  },
  regenerateButton: {
    paddingHorizontal: 20,
    height: 40, // 기본 Button보다 작게
  },
});