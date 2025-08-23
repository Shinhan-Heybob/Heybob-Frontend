import { getAvatarById } from '@/src/shared/data/avatars';
import { FriendData, searchFriends } from '@/src/shared/data/friends';
import { Button, Text } from '@/src/shared/ui';
import { useMealCreateStore } from '@/src/store';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// Search Icon Component
const SearchIcon: React.FC<{ color?: string }> = ({ color = '#B8B8B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Dropdown Icon
const ChevronDownIcon: React.FC<{ color?: string }> = ({ color = '#B8B8B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="m6 9 6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

type SearchType = 'name' | 'department' | 'studentId';

const SEARCH_OPTIONS = [
  { value: 'name' as SearchType, label: '이름' },
  { value: 'department' as SearchType, label: '학과' },
  { value: 'studentId' as SearchType, label: '학번' },
];

export const FindFriendsScreen: React.FC = () => {
  const { selectedFriends, addFriend, removeFriend } = useMealCreateStore();
  
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FriendData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 검색 실행
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchFriends(searchQuery, searchType);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchType]);

  const handleFriendToggle = (friend: FriendData) => {
    const isSelected = selectedFriends.some(f => f.id === friend.id);
    
    if (isSelected) {
      removeFriend(friend.id);
    } else {
      // FriendData를 Friend 타입으로 변환
      const friendToAdd = {
        id: friend.id,
        name: friend.name,
        studentId: friend.studentId,
        department: friend.department,
        avatarId: friend.avatarId,
      };
      addFriend(friendToAdd);
    }
  };

  const handleBackToCreateMeal = () => {
    router.back();
  };

  const selectedSearchOption = SEARCH_OPTIONS.find(opt => opt.value === searchType);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToCreateMeal}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>친구 찾기</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 검색 영역 */}
      <View style={styles.searchSection}>
        {/* 검색 타입 드롭다운과 입력창을 한 줄로 */}
        <View style={styles.searchRow}>
          {/* 검색 타입 드롭다운 */}
          <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownText}>
              {selectedSearchOption?.label}
            </Text>
            <ChevronDownIcon color="white" />
          </TouchableOpacity>

          {/* 검색 입력창 */}
          <View style={styles.searchInputContainer}>
            <SearchIcon color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder={`${selectedSearchOption?.label}을 입력하세요`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 드롭다운 옵션 */}
        {showDropdown && (
          <View style={styles.dropdownOptions}>
            {SEARCH_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownOption,
                  searchType === option.value && styles.dropdownOptionSelected,
                  index === SEARCH_OPTIONS.length - 1 && styles.dropdownOptionLast
                ]}
                onPress={() => {
                  setSearchType(option.value);
                  setShowDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  searchType === option.value && styles.dropdownOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 검색 결과 */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {searchResults.length > 0 ? (
          searchResults.map((friend) => {
            const isSelected = selectedFriends.some(f => f.id === friend.id);
            const avatarImage = getAvatarById(friend.avatarId);
            
            return (
              <View key={friend.id} style={styles.friendItem}>
                {/* 아바타 */}
                <View style={styles.avatarContainer}>
                  <Image
                    source={avatarImage}
                    style={styles.avatar}
                    contentFit="contain"
                  />
                </View>
                
                {/* 친구 정보 */}
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendDetails}>
                    {friend.department} ({friend.studentId})
                  </Text>
                </View>
                
                {/* 추가/제거 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    isSelected && styles.toggleButtonSelected
                  ]}
                  onPress={() => handleFriendToggle(friend)}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    isSelected && styles.toggleButtonTextSelected
                  ]}>
                    {isSelected ? '✓' : '+'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : searchQuery ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
            <Text style={styles.emptySubText}>다른 검색어를 시도해보세요</Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>친구를 검색해보세요</Text>
            <Text style={styles.emptySubText}>이름, 학과, 학번으로 검색할 수 있어요</Text>
          </View>
        )}
      </ScrollView>

      {/* 하단 선택된 친구들 + 버튼 */}
      {selectedFriends.length > 0 && (
        <View style={styles.bottomSection}>
          <Text style={styles.selectedTitle}>
            선택한 친구 {selectedFriends.length}명
          </Text>
          <View style={styles.selectedFriendsContainer}>
            {selectedFriends.map((friend) => {
              const avatarImage = getAvatarById(friend.avatarId);
              return (
                <View key={friend.id} style={styles.selectedFriend}>
                  <Image
                    source={avatarImage}
                    style={styles.selectedFriendAvatar}
                    contentFit="contain"
                  />
                  <Text style={styles.selectedFriendName}>{friend.name}</Text>
                </View>
              );
            })}
          </View>
          <Button
            title="시간표 대조하러 가기"
            onPress={handleBackToCreateMeal}
            style={styles.continueButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop:15
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7BBBFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 90,
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownOptions: {
    position: 'absolute',
    top: 90,
    left: 20,
    width: 90,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionSelected: {
    backgroundColor: '#EBF8FF',
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  dropdownOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  friendDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonSelected: {
    backgroundColor: '#EF4444',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleButtonTextSelected: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  selectedFriendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  selectedFriend: {
    alignItems: 'center',
    width: 60,
  },
  selectedFriendAvatar: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  selectedFriendName: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
  },
});