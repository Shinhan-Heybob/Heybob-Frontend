import { getAvatarById } from '@/src/shared/data/avatars';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

interface Participant {
  id: string;
  name: string;
  studentId: string;
  department: string;
  avatarId: string;
}

interface FriendSelectorProps {
  selectedFriendIds: string[];
  onToggleFriend: (friendId: string) => void;
  participants: Participant[];
  isLoading: boolean;
}

export const FriendSelector: React.FC<FriendSelectorProps> = ({
  selectedFriendIds,
  onToggleFriend,
  participants,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>참여자 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
        {participants.map((participant) => {
          const isSelected = selectedFriendIds.includes(participant.id);
          const avatarImage = getAvatarById(participant.avatarId);
          
          return (
            <View 
              key={participant.id} 
              style={[
                styles.friendCard,
                { opacity: isSelected ? 1.0 : 0.5 }
              ]}
            >
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
                <Text style={styles.friendName}>{participant.name}</Text>
                <Text style={styles.friendDepartment}>{participant.department}</Text>
                <Text style={styles.friendStudentId}>{participant.studentId}</Text>
              </View>
              
              {/* 버튼들 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => onToggleFriend(participant.id)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onToggleFriend(participant.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  friendsList: {
    flex: 1,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  friendDepartment: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  friendStudentId: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});