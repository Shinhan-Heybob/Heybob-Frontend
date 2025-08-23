import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/src/shared/ui';
import { useMealCreateStore } from '@/src/store';
import type { TimeSlot } from '../../model/mealCreateStore';

export const AvailableTimeSlots: React.FC = () => {
  const { 
    availableTimeSlots, 
    selectedTimeSlot,
    setSelectedTimeSlot,
    isLoadingTimeSlots,
    selectedFriends 
  } = useMealCreateStore();

  // 친구가 선택되지 않은 경우
  if (selectedFriends.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.sectionTitle}>
          공강 시간대
        </Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            👥 친구를 선택하면 공강 시간을 확인할 수 있어요
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
          공강 시간대 확인 중...
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
          공강 시간대
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            😢 선택한 날짜에 전원이 공강인 시간이 없어요
          </Text>
          <Text style={styles.emptySubText}>
            다른 날짜를 선택해보세요
          </Text>
        </View>
      </View>
    );
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.sectionTitle}>
        공강 시간대 ({availableTimeSlots.length}개)
      </Text>
      
      <View style={styles.timeSlotsContainer}>
        {availableTimeSlots.map((timeSlot, index) => {
          const isSelected = selectedTimeSlot?.time === timeSlot.time;
          
          return (
            <View key={index} style={styles.timeSlotRow}>
              <View style={styles.timeSlotInfo}>
                <Text style={styles.timeSlotTime}>
                  {timeSlot.time}
                </Text>
                <View style={styles.timeSlotDetails}>
                  <Text style={styles.timeSlotDay}>
                    {timeSlot.dayOfWeek}
                  </Text>
                  <Text style={styles.timeSlotStatus}>
                    전원 공강
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  isSelected && styles.selectButtonSelected
                ]}
                onPress={() => handleTimeSlotSelect(timeSlot)}
              >
                <Text style={[
                  styles.selectButtonText,
                  isSelected && styles.selectButtonTextSelected
                ]}>
                  {isSelected ? '선택됨' : '선택'}
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
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
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
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeSlotInfo: {
    flex: 1,
  },
  timeSlotTime: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeSlotDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSlotDay: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 8,
  },
  timeSlotStatus: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  selectButtonSelected: {
    backgroundColor: '#3B82F6',
  },
  selectButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  selectButtonTextSelected: {
    color: 'white',
  },
});