import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onCalculatePress: () => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  onCalculatePress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>총 금액을 입력하세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="금액 입력"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={12}
        />
        <Text style={styles.currency}>원</Text>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={onCalculatePress}
        >
          <Image
            source={require('@/assets/images/icons/check-button.png')}
            style={styles.checkIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  currency: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 12,
  },
  checkButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 32,
    height: 32,
  },
});