import { MealInfoCard } from '@/src/shared/ui/atoms/MealInfoCard';
import { useAuthStore } from '@/src/store';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatListStore } from '../model/chatListStore';
import { convertToMealInfo, type ChatListItem } from '../model/types';
import { ChatListFilters } from './components/ChatListFilters';
import { ChatListHeader } from './components/ChatListHeader';

export const ChatListScreen: React.FC = () => {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const {
    chatList,
    filters,
    isLoading,
    error,
    loadChatList,
    setCurrentUserId,
    setTypeFilter,
    setStatusFilter,
    clearError,
  } = useChatListStore();

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    if (user?.id) {
      setCurrentUserId(parseInt(user.id));
      loadChatList();
    } else {
      // 개발 중 임시 사용자 ID 설정 (실제 배포시에는 제거)
      setCurrentUserId(1);
      loadChatList();
    }
  }, [user?.id]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Alert.alert('오류', error, [
        { text: '확인', onPress: clearError }
      ]);
    }
  }, [error]);

  // 채팅방 아이템 클릭 핸들러
  const handleChatItemPress = (item: ChatListItem) => {
    const chatType = item.mealType === 'MEAL_APPOINTMENT' ? 'meal' : 'group';
    
    router.push({
      pathname: '/chat/[roomId]',
      params: {
        roomId: item.chatRoomId.toString(),
        chatType: chatType
      }
    });
  };

  // 빈 목록 렌더링
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? '채팅 목록을 불러오는 중...' : '채팅 목록이 없습니다'}
      </Text>
    </View>
  );

  // 채팅 아이템 렌더링 (MealInfoCard 활용)
  const renderChatItem = ({ item }: { item: ChatListItem }) => {
    const mealInfo = convertToMealInfo(item);
    
    return (
      <TouchableOpacity
        style={styles.chatItemContainer}
        onPress={() => handleChatItemPress(item)}
        activeOpacity={0.7}
      >
        <MealInfoCard 
          mealInfo={mealInfo}
          isLoading={false}
        />
        {!item.isActive && (
          <View style={styles.inactiveOverlay}>
            <Text style={styles.inactiveText}>비활성화됨</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <ChatListHeader />

      {/* 필터 */}
      <ChatListFilters
        type={filters.type}
        status={filters.status}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        disabled={isLoading}
      />

      {/* 채팅 목록 */}
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChatItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: Math.max(100, insets.bottom + 80) }
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadChatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  chatItemContainer: {
    position: 'relative',
    marginBottom: -20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16, // MealInfoCard의 marginVertical과 맞춤
  },
  inactiveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});