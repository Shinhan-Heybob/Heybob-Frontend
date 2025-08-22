import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  style?: any;
}

export const Input: React.FC<InputProps> = ({
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#B8B8B8"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 56,
    backgroundColor: '#F3F6F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
});