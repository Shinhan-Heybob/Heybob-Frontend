import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Text } from './Text';

interface DropdownOption {
  id: string;
  name: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder: string;
  style?: any;
  disabled?: boolean;
  disabledMessage?: string;
}

// Search Icon Component
const SearchIcon: React.FC<{ color?: string }> = ({ color = '#B8B8B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Chevron Down Icon Component
const ChevronDownIcon: React.FC<{ color?: string }> = ({ color = '#B8B8B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="m6 9 6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Chevron Up Icon Component
const ChevronUpIcon: React.FC<{ color?: string }> = ({ color = '#B8B8B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="m18 15-6-6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  style,
  disabled = false,
  disabledMessage = "먼저 상위 항목을 선택해주세요.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDisabledMessage, setShowDisabledMessage] = useState(false);
  
  const selectedOption = options.find(option => option.id === selectedValue);
  
  const handleSelect = (optionId: string) => {
    onSelect(optionId);
    setIsOpen(false);
  };

  const handlePress = () => {
    if (disabled) {
      setShowDisabledMessage(true);
      // 2초 후 메시지 숨김
      setTimeout(() => setShowDisabledMessage(false), 2000);
      return;
    }
    setIsOpen(true);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabledButton]}
        onPress={handlePress}
      >
        <View style={styles.buttonContent}>
          {/* Search Icon */}
          <View style={styles.iconContainer}>
            <SearchIcon />
          </View>
          <Text 
            style={[styles.buttonText, selectedOption ? styles.selectedText : styles.placeholderText]}
            variant="body"
          >
            {selectedOption ? selectedOption.name : placeholder}
          </Text>
        </View>
        {/* Arrow Icon */}
        <View>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </View>
      </TouchableOpacity>

      {/* Disabled Message */}
      {showDisabledMessage && (
        <View style={styles.disabledMessageContainer}>
          <Text variant="caption" style={styles.disabledMessageText}>
            {disabledMessage}
          </Text>
        </View>
      )}

      {/* Modal with Options */}
      <Modal
        visible={isOpen && !disabled}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.optionItemContainer}
                  onPress={() => handleSelect(item.id)}
                >
                  <Text variant="body" style={styles.optionText}>
                    {item.name}
                  </Text>
                  {index !== options.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    height: 56,
    backgroundColor: '#F3F6F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    flex: 1,
  },
  selectedText: {
    color: '#111827',
  },
  placeholderText: {
    color: '#B8B8B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 320,
    overflow: 'hidden', // 스크롤바가 모달 밖으로 나가지 않도록
  },
  listContainer: {
    paddingVertical: 8, // 상하 여백 추가
  },
  optionItemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 1, // 좌우 여백으로 밑줄 길이 줄이기
    marginTop: 16,
  },
  optionText: {
    color: '#111827',
  },
  disabledButton: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  disabledMessageContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
    zIndex: 1000,
  },
  disabledMessageText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
  },
});