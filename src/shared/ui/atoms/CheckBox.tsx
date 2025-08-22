import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Text } from './Text';

interface CheckBoxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  style?: any;
}

// Check Icon Component
const CheckIcon: React.FC<{ color?: string }> = ({ color = '#FFFFFF' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M20 6L9 17l-5-5" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onPress,
  label,
  style,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkedBox]}>
        {checked && <CheckIcon />}
      </View>
      <Text variant="body" style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#7BBBFB',
    borderColor: '#7BBBFB',
  },
  label: {
    flex: 1,
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
});