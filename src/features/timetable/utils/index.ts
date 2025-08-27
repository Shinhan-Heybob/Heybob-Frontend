import { Lecture, LectureBlock, DayColumn, LECTURE_COLORS, DAYS_OF_WEEK } from '../types';

// 시간을 분으로 변환
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 강의를 LectureBlock으로 변환
export const convertToLectureBlocks = (lectures: Lecture[]): LectureBlock[] => {
  return lectures.map((lecture, index) => {
    const startMinutes = timeToMinutes(lecture.startTime);
    const endMinutes = timeToMinutes(lecture.endTime);
    const startRow = Math.floor((startMinutes - 9 * 60) / 30); // 9시 기준
    const endRow = Math.floor((endMinutes - 9 * 60) / 30);
    
    return {
      ...lecture,
      startRow,
      endRow,
      height: endMinutes - startMinutes,
      color: LECTURE_COLORS[index % LECTURE_COLORS.length]
    };
  });
};

// 요일별로 강의 그룹핑
export const groupLecturesByDay = (lectureBlocks: LectureBlock[]): DayColumn[] => {
  return DAYS_OF_WEEK.map(day => ({
    day: day.day,
    dayKor: day.dayKor,
    lectures: lectureBlocks.filter(lecture => lecture.dayOfWeek === day.dayKor)
  }));
};

// 시간 슬롯 라벨 생성
export const getTimeSlotLabel = (index: number): string => {
  const totalMinutes = 9 * 60 + index * 30; // 9시부터 30분 간격
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // 정시만 표시
  if (minutes === 0) {
    return `${hours.toString().padStart(2, '0')}:00`;
  }
  return '';
};

// 강의 블록 높이 계산
export const calculateBlockHeight = (lectureBlock: LectureBlock, slotHeight: number): number => {
  const durationMinutes = lectureBlock.height;
  return (durationMinutes / 30) * slotHeight;
};

// 강의 블록 위치 계산
export const calculateBlockTop = (lectureBlock: LectureBlock, slotHeight: number): number => {
  const startMinutes = timeToMinutes(lectureBlock.startTime);
  const baseMinutes = 9 * 60; // 9시 기준
  const offsetMinutes = startMinutes - baseMinutes;
  return (offsetMinutes / 30) * slotHeight;
};