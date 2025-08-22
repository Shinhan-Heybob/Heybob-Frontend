import React from 'react';
import { View } from 'react-native';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

interface InputFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  className = '',
}) => {
  return (
    <View className={`${className}`}>
      {label && (
        <Text variant="body" className="mb-2 font-medium">
          {label}
        </Text>
      )}
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        className={error ? 'border border-red-500' : ''}
      />
      {error && (
        <Text variant="caption" className="mt-1 text-red-500">
          {error}
        </Text>
      )}
    </View>
  );
};