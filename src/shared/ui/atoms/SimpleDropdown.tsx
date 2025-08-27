import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface DropdownOption<T> {
  label: string;
  value: T;
}

interface SimpleDropdownProps<T> {
  options: DropdownOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  selectedColor?: string;
}

export function SimpleDropdown<T extends string>({
  options,
  value,
  onValueChange,
  placeholder = '선택하세요',
  disabled = false,
  backgroundColor = '#7BBBFB',
  textColor = 'white',
  selectedColor = '#787FEF',
}: SimpleDropdownProps<T>) {
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const dropdownRef = useRef<View>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: T) => {
    onValueChange(selectedValue);
    setIsVisible(false);
  };

  const handleDropdownPress = () => {
    if (!disabled) {
      dropdownRef.current?.measure((x, y, width, height) => {
        setDropdownWidth(width);
        setIsVisible(true);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View ref={dropdownRef}>
        <TouchableOpacity
          style={[
            styles.dropdown, 
            { backgroundColor: disabled ? '#D1D5DB' : backgroundColor },
            disabled && styles.disabled
          ]}
          onPress={handleDropdownPress}
          disabled={disabled}
        >
          <Text style={[
            styles.dropdownText, 
            { color: disabled ? '#9CA3AF' : textColor }
          ]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Ionicons 
            name={isVisible ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={disabled ? '#9CA3AF' : textColor}
          />
        </TouchableOpacity>
      </View>

      {isVisible && (
        <>
          <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View 
            style={[
              styles.dropdownContent,
              {
                width: dropdownWidth,
              }
            ]}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  option.value === value && styles.selectedOption,
                  index === options.length - 1 && styles.lastOption
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.value === value && { 
                      color: selectedColor, 
                      fontWeight: '600' 
                    }
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === value && (
                  <Ionicons name="checkmark" size={20} color={selectedColor} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
  },
  disabled: {
    backgroundColor: '#D1D5DB',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 2,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 1000,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
});