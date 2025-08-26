import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface MealInfo {
  hostName: string;
  hostDepartment: string;
  hostStudentId: string;
  hostAvatarId: string;
  mealTitle: string;
}

interface MealInfoCardProps {
  mealInfo: MealInfo | null;
  isLoading?: boolean;
}

export const MealInfoCard: React.FC<MealInfoCardProps> = ({
  mealInfo,
  isLoading = false,
}) => {
  if (isLoading || !mealInfo) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? '밥약 정보를 불러오는 중...' : '밥약 정보가 없습니다.'}
          </Text>
        </View>
      </View>
    );
  }

  // 아바타 이미지 가져오기 (임시로 기본 아바타 사용)
  const avatarImage = require('@/assets/images/character2.png');

  return (
    <View style={styles.card}>
      <View style={styles.hostContainer}>
        {/* 호스트 아바타 */}
        <View style={styles.avatarContainer}>
          <Image
            source={avatarImage}
            style={styles.avatar}
            contentFit="contain"
          />
        </View>
        
        {/* 호스트 정보 */}
        <View style={styles.hostInfo}>
          <Text style={styles.hostLabel}>
            방장 : {mealInfo.hostDepartment} {mealInfo.hostName} ({mealInfo.hostStudentId})
          </Text>
          <Text style={styles.mealTitle}>{mealInfo.mealTitle}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  hostInfo: {
    flex: 1,
  },
  hostLabel: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});