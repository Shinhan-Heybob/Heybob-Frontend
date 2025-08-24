import { getAvatarById } from '@/src/shared/data/avatars';
import { Text } from '@/src/shared/ui';
import { useMealCreateStore } from '@/src/store';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const SelectedFriendsList: React.FC = () => {
  const { selectedFriends, removeFriend } = useMealCreateStore();

  if (selectedFriends.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.sectionTitle}>
        선택된 친구들 ({selectedFriends.length}명)
      </Text>
      
      <View style={styles.friendsList}>
        {selectedFriends.map((friend, index) => {
          const avatarImage = getAvatarById(friend.avatarId);
          const isLastItem = index === selectedFriends.length - 1;
          
          return (
            <View key={friend.id} style={[
              styles.friendItem,
              isLastItem && styles.friendItemLast
            ]}>
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
                <Text variant="caption" style={styles.friendDetails}>
                  {friend.department} ({friend.studentId})
                </Text>
                <Text variant="body" style={styles.friendName}>
                  {friend.name}
                </Text>
              </View>
              
              {/* 삭제 버튼 */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFriend(friend.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
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
  friendsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  friendItemLast: {
    borderBottomWidth: 0,
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
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  friendDetails: {
    color: '#6B7280',
    fontSize: 14,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});