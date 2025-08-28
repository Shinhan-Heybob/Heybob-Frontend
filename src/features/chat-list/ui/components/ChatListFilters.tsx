import { SimpleDropdown } from '@/src/shared/ui/atoms/SimpleDropdown';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatStatus, ChatType, STATUS_OPTIONS, TYPE_OPTIONS } from '../../model/types';

interface ChatListFiltersProps {
  type: ChatType;
  status: ChatStatus;
  onTypeChange: (type: ChatType) => void;
  onStatusChange: (status: ChatStatus) => void;
  disabled?: boolean;
}

export const ChatListFilters: React.FC<ChatListFiltersProps> = ({
  type,
  status,
  onTypeChange,
  onStatusChange,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <SimpleDropdown
        options={TYPE_OPTIONS}
        value={type}
        onValueChange={onTypeChange}
        disabled={disabled}
      />
      
      <SimpleDropdown
        options={STATUS_OPTIONS}
        value={status}
        onValueChange={onStatusChange}
        disabled={disabled}
        backgroundColor="#787FEF"
        textColor="white"
        selectedColor="#6366F1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#F9FAFB',
  },
});