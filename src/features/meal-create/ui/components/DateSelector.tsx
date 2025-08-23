import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Text, Button } from '@/src/shared/ui';
import { Calendar } from 'react-native-calendars';
import { useMealCreateStore } from '@/src/store';

export const DateSelector: React.FC = () => {
  const { selectedDate, setSelectedDate } = useMealCreateStore();
  const [showCalendar, setShowCalendar] = useState(false);

  // 오늘 날짜 계산
  const today = new Date().toISOString().split('T')[0];

  // 선택 가능한 최소 날짜 (오늘)
  const minDate = today;

  // 선택 가능한 최대 날짜 (30일 후)
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleDateSelect = (day: any) => {
    const selectedDateObj = new Date(day.dateString);
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][selectedDateObj.getDay()] + '요일';
    
    setSelectedDate({
      date: day.dateString,
      dayOfWeek: dayOfWeek
    });
    setShowCalendar(false);
  };

  const formatSelectedDate = (date: string) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.sectionTitle}>
        날짜 선택
      </Text>
      
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowCalendar(true)}
      >
        <View style={styles.dateButtonContent}>
          <Text style={styles.calendarIcon}>📅</Text>
          <Text style={styles.dateButtonText}>
            {selectedDate 
              ? `${formatSelectedDate(selectedDate.date)} (${selectedDate.dayOfWeek})`
              : '날짜를 선택하세요'
            }
          </Text>
        </View>
      </TouchableOpacity>

      {/* 캘린더 모달 */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            {/* 모달 헤더 */}
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>날짜 선택</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 캘린더 */}
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate?.date || '']: {
                  selected: true,
                  selectedColor: '#3B82F6',
                },
              }}
              minDate={minDate}
              maxDate={maxDate}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#3B82F6',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3B82F6',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                arrowColor: '#3B82F6',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: '#2d4150',
                indicatorColor: '#3B82F6',
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>
        </View>
      </Modal>
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
  dateButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
});