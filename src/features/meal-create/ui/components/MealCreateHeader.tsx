import { Text } from '@/src/shared/ui';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface MealCreateHeaderProps {
  title?: string;
  onBackPress: () => void;
}

export const MealCreateHeader: React.FC<MealCreateHeaderProps> = ({
  title = '밥약 만들기',
  onBackPress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
      >
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text variant="title" style={styles.headerTitle}>
        {title}
      </Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
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
});