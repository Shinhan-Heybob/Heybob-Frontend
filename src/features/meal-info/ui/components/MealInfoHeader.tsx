import { Text } from '@/src/shared/ui';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface MealInfoHeaderProps {
  onBackPress: () => void;
  onEnterChat: () => void;
  disabled?: boolean;
}

export const MealInfoHeader: React.FC<MealInfoHeaderProps> = ({
  onBackPress,
  onEnterChat,
  disabled = false
}) => {
  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
      >
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      
      {/* 타이틀 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>밥약 정보</Text>
      </View>
      
      {/* 채팅방 입장하기 버튼 */}
      <TouchableOpacity 
        style={[
          styles.chatButton,
          disabled && styles.chatButtonDisabled
        ]} 
        onPress={onEnterChat}
        disabled={disabled}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[
          styles.chatButtonText,
          disabled && styles.chatButtonTextDisabled
        ]}>
          채팅방 입장하기
        </Text>
        <Text style={[
          styles.chatButtonIcon,
          disabled && styles.chatButtonTextDisabled
        ]}>
          →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: '300',
  },
  titleContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 60,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7BBBFB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  chatButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  chatButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
  },
  chatButtonTextDisabled: {
    color: '#9CA3AF',
  },
  chatButtonIcon: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
});