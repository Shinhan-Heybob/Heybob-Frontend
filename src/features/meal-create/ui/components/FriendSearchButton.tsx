import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/src/shared/ui';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

// Search Icon Component (Dropdown에서 가져온 것과 동일)
const SearchIcon: React.FC<{ color?: string }> = ({ color = '#B8B8B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const FriendSearchButton: React.FC = () => {
  const handleFriendSearch = () => {
    // TODO: 친구 찾기 페이지 구현 후 활성화
    console.log('친구 찾기 버튼 클릭 - 페이지 구현 예정');
    // router.push('/meals/create/find-friends');
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
          <SearchIcon color="#6B7280" />
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
  searchButtonText: {
    flex: 1,
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  arrowIcon: {
    color: '#9CA3AF',
    fontSize: 20,
    fontWeight: '300',
  },
});