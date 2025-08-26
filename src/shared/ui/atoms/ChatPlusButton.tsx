import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ChatPlusButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const ChatPlusButton: React.FC<ChatPlusButtonProps> = ({
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={require('@/assets/images/icons/add-button.png')}
        style={styles.icon}
        contentFit="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    width: 35,
    height: 35,
  },
});