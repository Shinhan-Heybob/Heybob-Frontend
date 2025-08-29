import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { DateRange } from '../../model/types';
import { getKoreanDate, formatDateToYYYY_MM_DD } from '@/src/shared/utils/dateUtils';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

type DatePickerMode = 'start' | 'end';

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [pickerMode, setPickerMode] = useState<DatePickerMode>('start');

  // YYYYMMDD → YYYY-MM-DD 변환
  const formatToCalendarDate = (dateStr: string): string => {
    if (dateStr.length !== 8) return '';
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  // YYYY-MM-DD → YYYYMMDD 변환
  const formatToApiDate = (dateStr: string): string => {
    return dateStr.replace(/-/g, '');
  };

  // YYYYMMDD → MM월 DD일 형식으로 변환
  const formatDisplayDate = (dateStr: string): string => {
    if (dateStr.length !== 8) return '';
    const month = parseInt(dateStr.substring(4, 6));
    const day = parseInt(dateStr.substring(6, 8));
    return `${month}월 ${day}일`;
  };

  // 오늘 날짜 (YYYY-MM-DD 형식) - 한국 시간대 기준
  const today = formatDateToYYYY_MM_DD(getKoreanDate());

  // 날짜 선택 핸들러
  const handleDateSelect = (day: any) => {
    const selectedApiDate = formatToApiDate(day.dateString);
    
    if (pickerMode === 'start') {
      // 시작일 선택: 종료일이 시작일보다 이전이면 종료일도 같게 설정
      const newEndDate = selectedApiDate > dateRange.endDate ? selectedApiDate : dateRange.endDate;
      onDateRangeChange({
        startDate: selectedApiDate,
        endDate: newEndDate,
      });
    } else {
      // 종료일 선택: 종료일이 시작일보다 이전이면 시작일도 같게 설정
      const newStartDate = selectedApiDate < dateRange.startDate ? selectedApiDate : dateRange.startDate;
      onDateRangeChange({
        startDate: newStartDate,
        endDate: selectedApiDate,
      });
    }
    
    setShowCalendar(false);
  };

  // 시작일 선택 버튼 클릭
  const handleStartDatePress = () => {
    setPickerMode('start');
    setShowCalendar(true);
  };

  // 종료일 선택 버튼 클릭
  const handleEndDatePress = () => {
    setPickerMode('end');
    setShowCalendar(true);
  };

  // 캘린더에 표시할 마크된 날짜들
  const getMarkedDates = () => {
    const startCalendarDate = formatToCalendarDate(dateRange.startDate);
    const endCalendarDate = formatToCalendarDate(dateRange.endDate);
    
    const marked: any = {};
    
    if (startCalendarDate) {
      marked[startCalendarDate] = {
        selected: pickerMode === 'start',
        selectedColor: pickerMode === 'start' ? '#3B82F6' : '#10B981',
        textColor: 'white',
      };
    }
    
    if (endCalendarDate && endCalendarDate !== startCalendarDate) {
      marked[endCalendarDate] = {
        selected: pickerMode === 'end',
        selectedColor: pickerMode === 'end' ? '#3B82F6' : '#EF4444',
        textColor: 'white',
      };
    }
    
    return marked;
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateRangeContainer}>
        {/* 시작일 선택 */}
        <TouchableOpacity 
          style={[styles.dateButton, styles.startDateButton]}
          onPress={handleStartDatePress}
        >
          <View style={styles.dateButtonContent}>
            <Image
              source={require('@/assets/images/icons/calendar.png')}
              style={styles.calendarIcon}
              contentFit="contain"
            />
            <Text style={styles.dateButtonText}>
              {dateRange.startDate ? formatDisplayDate(dateRange.startDate) : '시작날짜'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* 구분자 */}
        <Text style={styles.separator}>~</Text>

        {/* 종료일 선택 */}
        <TouchableOpacity 
          style={[styles.dateButton, styles.endDateButton]}
          onPress={handleEndDatePress}
        >
          <View style={styles.dateButtonContent}>
            <Image
              source={require('@/assets/images/icons/calendar.png')}
              style={styles.calendarIcon}
              contentFit="contain"
            />
            <Text style={styles.dateButtonText}>
              {dateRange.endDate ? formatDisplayDate(dateRange.endDate) : '종료날짜'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

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
              <Text style={styles.calendarTitle}>
                {pickerMode === 'start' ? '시작날짜 선택' : '종료날짜 선택'}
              </Text>
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
              markedDates={getMarkedDates()}
              maxDate={today}
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
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
  },
  startDateButton: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  endDateButton: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  dateButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    color: '#6B7280',
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