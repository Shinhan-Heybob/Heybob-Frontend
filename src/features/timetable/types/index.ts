// 시간표 기능 전용 타입 정의

// API 요청/응답 타입
export interface TimetableCreateRequest {
  timeTableName: string;
}

export interface LectureCreateRequest {
  name: string;
  subjectCode: string;
  dayOfWeek: string; // 월,화,수,목,금,토,일
  startTime: string; // HH:mm 형식
  endTime: string;   // HH:mm 형식
  classroom: string;
  professor: string;
}

export interface LectureUpdateRequest extends LectureCreateRequest {}

export interface Lecture {
  lectureId: number;
  lectureName: string;
  subjectCode: string;
  dayOfWeek: string; // 요일 (월, 화, 수, 목, 금, 토, 일)
  startTime: string; // HH:mm 형식
  endTime: string;   // HH:mm 형식
  classroom: string;
  professor: string;
}

export interface TimetableResponse {
  id: number;
  lectures: Lecture[];
}

// API 에러 응답 타입
export interface ApiError {
  status: number;
  customCode: number;
  message: string;
}

// UI용 타입들
export interface TimeSlot {
  hour: number;
  minute: number;
  displayTime: string; // "09:00" 형식
}

export interface DayColumn {
  day: string;
  dayKor: string;
  lectures: LectureBlock[];
}

export interface LectureBlock extends Lecture {
  startRow: number; // 그리드에서의 시작 행
  endRow: number;   // 그리드에서의 종료 행
  height: number;   // 블록 높이 (분 단위)
  color: string;    // 강의별 색상
}

// 시간표 그리드 설정 (토/일 제거)
export const DAYS_OF_WEEK = [
  { day: 'MON', dayKor: '월' },
  { day: 'TUE', dayKor: '화' },
  { day: 'WED', dayKor: '수' },
  { day: 'THU', dayKor: '목' },
  { day: 'FRI', dayKor: '금' },
] as const;

// 시간 슬롯 생성 (9:00 ~ 18:00, 30분 간격)
export const createTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // 18:00까지만
      
      slots.push({
        hour,
        minute,
        displayTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      });
    }
  }
  
  return slots;
};

// 강의별 색상 팔레트 (메인 테마와 조화)
export const LECTURE_COLORS = [
  '#E8EAFF', // 연한 보라 (메인 컬러 계열)
  '#FFF1F1', // 연한 핑크
  '#F0FFF4', // 연한 민트
  '#FFF8E1', // 연한 노랑
  '#F0F8FF', // 연한 파랑
  '#FFFACD', // 연한 크림
  '#F5F5DC', // 연한 베이지
  '#E6E6FA', // 연한 라벤더
] as const;