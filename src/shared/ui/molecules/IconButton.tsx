import React from 'react';
import { TouchableOpacity, View, StyleSheet, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../atoms/Text';

interface IconButtonProps {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
  iconSize?: number;
  style?: any;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onPress,
  iconSize = 48,
  style,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 아이콘 */}
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={[styles.icon, { width: iconSize, height: iconSize }]}
          contentFit="contain"
        />
      </View>
      
      {/* 라벨 */}
      <Text variant="caption" style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    minHeight: 100,
    flex: 1,
  },
  iconContainer: {
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    // 동적 크기는 props로 설정
  },
  label: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});