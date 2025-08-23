import { Text } from '@/src/shared/ui';
import { useMealCreateStore } from '@/src/store';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { SelectedTimeSlot, TimeSlotData } from '../../model/mealCreateStore';

export const AvailableTimeSlots: React.FC = () => {
  const { 
    availableTimeSlots, 
    selectedTimeSlot,
    setSelectedTimeSlot,
    isLoadingTimeSlots,
    selectedFriends,
    selectedDate
  } = useMealCreateStore();

  // 날짜가 선택되지 않은 경우
  if (!selectedDate) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.sectionTitle}>
          가능한 시간대
        </Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            날짜를 선택하면 공강 시간을 확인할 수 있어요
          </Text>
        </View>
      </View>
    );
  }

  // 친구가 선택되지 않은 경우
  if (selectedFriends.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.sectionTitle}>
          가능한 시간대
        </Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            친구를 선택하면 공강 시간을 확인할 수 있어요
          </Text>
        </View>
      </View>
    );
  }

  // 로딩 중인 경우
  if (isLoadingTimeSlots) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.sectionTitle}>
          가능한 시간대
        </Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>
            친구들의 시간표를 확인하고 있어요
          </Text>
        </View>
      </View>
    );
  }

  // 공강 시간이 없는 경우
  if (availableTimeSlots.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.sectionTitle}>
          가능한 시간대
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            😢 선택한 날짜에 공강인 시간이 없어요
          </Text>
          <Text style={styles.emptySubText}>
            다른 날짜를 선택해보세요
          </Text>
        </View>
      </View>
    );
  }

  const handleTimeSlotSelect = (timeSlotData: TimeSlotData) => {
    const selectedSlot: SelectedTimeSlot = {
      time: timeSlotData.time,
      dayOfWeek: selectedDate?.dayOfWeek || '',
    };
    setSelectedTimeSlot(selectedSlot);
  };

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.sectionTitle}>
        가능한 시간대
      </Text>
      
      <View style={styles.timeSlotsContainer}>
        {availableTimeSlots.map((timeSlot, index) => {
          const isSelected = selectedTimeSlot?.time === timeSlot.time;
          const isAllAvailable = timeSlot.isAllAvailable;
          
          return (
            <View key={index} style={[
              styles.timeSlotRow,
              isAllAvailable && styles.timeSlotRowSelectable,
              isSelected && styles.timeSlotRowSelected
            ]}>
              {/* 시간 표시 */}
              <Text style={styles.timeText}>
                {timeSlot.time}
              </Text>
              
              {/* 참여 가능한 친구들 */}
              <View style={styles.friendsContainer}>
                {timeSlot.availableFriends.map((friendName, friendIndex) => (
                  <View key={friendIndex} style={styles.friendTag}>
                    <Text style={styles.friendTagText}>
                      {friendName}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* 추가 버튼 - 항상 활성화 */}
              <TouchableOpacity
                style={[
                  styles.addButton,
                  isSelected && styles.addButtonSelected
                ]}
                onPress={() => handleTimeSlotSelect(timeSlot)}
              >
                <Text style={[
                  styles.addButtonText,
                  isSelected && styles.addButtonTextSelected
                ]}>
                  + 선택
                </Text>
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
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  placeholderContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  timeSlotsContainer: {
    gap: 8,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB', // 기본 회색 배경
    borderRadius: 16,
    padding: 16,
    minHeight: 60,
  },
  timeSlotRowSelectable: {
    backgroundColor: '#C7D2FE', // 전원 공강시 연보라 배경
  },
  timeSlotRowSelected: {
    backgroundColor: '#A5B4FC', // 선택됨 상태
  },
  timeText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    minWidth: 60,
    marginRight: 16,
  },
  friendsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginRight: 12,
  },
  friendTag: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  friendTagText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  addButtonSelected: {
    backgroundColor: '#4F46E5',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: '#F3F4F6',
  },
  addButtonTextSelected: {
    color: 'white',
  },
});