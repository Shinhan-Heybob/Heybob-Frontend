import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Lecture, LectureBlock, createTimeSlots, DAYS_OF_WEEK } from '../../types';
import { convertToLectureBlocks, groupLecturesByDay, getTimeSlotLabel, calculateBlockHeight, calculateBlockTop } from '../../utils';
import { useTimetableStore } from '../../model/timetableStore';

interface TimetableGridProps {
  lectures: Lecture[];
}

const { width: screenWidth } = Dimensions.get('window');
const SLOT_HEIGHT = 35; // 30분당 높이 (더 줄임)
const TIME_COLUMN_WIDTH = 35; // 시간 컬럼 너비 (더 줄임)
const DAY_COLUMN_WIDTH = (screenWidth - TIME_COLUMN_WIDTH - 40) / 5; // 요일 컬럼 너비 (월~금)

export const TimetableGrid: React.FC<TimetableGridProps> = ({ lectures }) => {
  const { setSelectedLecture } = useTimetableStore();
  const timeSlots = createTimeSlots();
  
  // 강의를 LectureBlock으로 변환하고 요일별로 그룹핑
  const lectureBlocks = convertToLectureBlocks(lectures);
  const dayColumns = groupLecturesByDay(lectureBlocks);

  const handleLecturePress = (lecture: Lecture) => {
    setSelectedLecture(lecture);
  };

  const renderTimeSlots = () => {
    return timeSlots.map((_, index) => (
      <View key={index} style={styles.timeSlot}>
        <Text style={styles.timeText}>
          {getTimeSlotLabel(index)}
        </Text>
      </View>
    ));
  };

  const renderLectureBlock = (lectureBlock: LectureBlock) => {
    const blockHeight = calculateBlockHeight(lectureBlock, SLOT_HEIGHT);
    const blockTop = calculateBlockTop(lectureBlock, SLOT_HEIGHT);
    
    return (
      <TouchableOpacity
        key={lectureBlock.lectureId}
        style={[
          styles.lectureBlock,
          {
            backgroundColor: lectureBlock.color,
            height: blockHeight,
            top: blockTop,
            minHeight: Math.max(blockHeight, 40), // 최소 높이 보장
          }
        ]}
        onPress={() => handleLecturePress(lectureBlock)}
        activeOpacity={0.8}
      >
        <Text style={styles.lectureName} numberOfLines={1}>
          {lectureBlock.lectureName}
        </Text>
        <Text style={styles.lectureRoom} numberOfLines={1}>
          {lectureBlock.classroom}
        </Text>
        <Text style={styles.lectureTime} numberOfLines={1}>
          {lectureBlock.startTime}-{lectureBlock.endTime}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDayColumn = (dayColumn: typeof dayColumns[0]) => {
    return (
      <View key={dayColumn.day} style={styles.dayColumn}>
        {/* 요일 헤더 */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayText}>{dayColumn.dayKor}</Text>
        </View>
        
        {/* 강의 블록들 */}
        <View style={styles.lecturesContainer}>
          {dayColumn.lectures.map(lectureBlock => renderLectureBlock(lectureBlock))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16}
      >
        <View style={styles.timetableContainer}>
          {/* 헤더 행 */}
          <View style={styles.headerRow}>
            {/* 빈 공간 (시간 컬럼 위) */}
            <View style={styles.timeColumn} />
            
            {/* 요일 헤더들 */}
            {DAYS_OF_WEEK.map(day => (
              <View key={day.day} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{day.dayKor}</Text>
              </View>
            ))}
          </View>

          {/* 메인 그리드 */}
          <View style={styles.mainGrid}>
            {/* 시간 컬럼 */}
            <View style={styles.timeColumn}>
              {renderTimeSlots()}
            </View>

            {/* 요일 컬럼들 */}
            <View style={styles.daysContainer}>
              {dayColumns.map(dayColumn => (
                <View key={dayColumn.day} style={styles.dayColumnContainer}>
                  {/* 배경 그리드 */}
                  <View style={styles.backgroundGrid}>
                    {timeSlots.map((_, index) => (
                      <View key={index} style={styles.gridCell} />
                    ))}
                  </View>
                  
                  {/* 강의 블록들 */}
                  <View style={styles.lecturesContainer}>
                    {dayColumn.lectures.map(lectureBlock => renderLectureBlock(lectureBlock))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  timetableContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timeColumn: {
    width: TIME_COLUMN_WIDTH,
  },
  dayHeaderCell: {
    width: DAY_COLUMN_WIDTH,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7BBBFB',
    borderRadius: 12,
    marginHorizontal: 2,
    shadowColor: '#7BBBFB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  mainGrid: {
    flexDirection: 'row',
  },
  daysContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  dayColumnContainer: {
    width: DAY_COLUMN_WIDTH,
    marginHorizontal: 2,
    position: 'relative',
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridCell: {
    height: SLOT_HEIGHT,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
  },
  timeSlot: {
    height: SLOT_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  timeText: {
    fontSize: 9,
    color: '#8E8E93',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  lecturesContainer: {
    position: 'relative',
    flex: 1,
  },
  lectureBlock: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 10,
    padding: 6,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lectureName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 1,
    letterSpacing: -0.2,
  },
  lectureRoom: {
    fontSize: 8,
    color: '#1A1A1A',
    marginBottom: 1,
    fontWeight: '500',
    opacity: 0.8,
  },
  lectureTime: {
    fontSize: 7,
    color: '#1A1A1A',
    fontWeight: '500',
    opacity: 0.6,
  },
  dayColumn: {
    width: DAY_COLUMN_WIDTH,
  },
  dayHeader: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 10,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});