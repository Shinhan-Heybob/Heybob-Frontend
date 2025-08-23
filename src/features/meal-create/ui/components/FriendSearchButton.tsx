import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/src/shared/ui';
import { router } from 'expo-router';

export const FriendSearchButton: React.FC = () => {
  const handleFriendSearch = () => {
    // 친구 찾기 페이지로 이동
    router.push('/meals/create/find-friends');
  };

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.sectionTitle}>
        함께 먹을 친구
      </Text>
      
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={handleFriendSearch}
        activeOpacity={0.7}
      >
        <View style={styles.searchButtonContent}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchButtonText}>
            친구 검색
          </Text>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchButtonText: {
    flex: 1,
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  arrowIcon: {
    color: '#9CA3AF',
    fontSize: 20,
    fontWeight: '300',
  },
});