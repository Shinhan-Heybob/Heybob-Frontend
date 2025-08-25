import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ChatPlusButton } from './ChatPlusButton';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onPlusButtonPress?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = '메시지 입력...',
  disabled = false,
  onPlusButtonPress,
}) => {
  const [message, setMessage] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  const handlePlusButtonPress = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
  };

  const handleMenuItemPress = () => {
    onPlusButtonPress?.();
    setIsDropdownVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleDropdownClose}>
      <View style={styles.container}>
        {/* 드롭다운 메뉴 */}
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.menuItem} onPress={handleMenuItemPress}>
              <Text style={styles.menuItemText}>1/N 정산하기</Text>
            </TouchableOpacity>
          </View>
        )}

        <ChatPlusButton onPress={handlePlusButtonPress} disabled={disabled} />
        <View style={styles.inputContainer}>
          <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={1000}
          editable={!disabled}
        />
        
        <TouchableOpacity
          style={[styles.sendButton, canSend && styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={canSend ? '#FFFFFF' : '#9CA3AF'} 
          />
        </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
  dropdown: {
    position: 'absolute',
    bottom: 85, // 인풋창과 더 멀리 떨어뜨림
    left: 5,
    width: 200, // 너비를 더 넓게
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
});