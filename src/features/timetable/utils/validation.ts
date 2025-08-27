import { Lecture, LectureCreateRequest, LectureUpdateRequest } from '../types';

// 시간을 분 단위로 변환
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 분을 시간 형식으로 변환
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// 시간 범위 겹침 검사
export const isTimeOverlapping = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);

  // 겹치지 않는 경우: 한 시간대가 다른 시간대보다 완전히 이전/이후에 있음
  // 겹치는 경우: 위 조건이 아닌 모든 경우
  return !(end1Minutes <= start2Minutes || end2Minutes <= start1Minutes);
};

// 강의 시간 중복 검증
export const validateLectureTimeConflict = (
  existingLectures: Lecture[],
  newLecture: LectureCreateRequest | LectureUpdateRequest,
  excludeLectureId?: number // 수정 시 자기 자신 제외
): { isValid: boolean; conflictingLecture?: Lecture; message?: string } => {
  
  // 같은 요일의 강의들만 필터링
  const sameDayLectures = existingLectures.filter(lecture => {
    // 수정 시 자기 자신 제외
    if (excludeLectureId && lecture.lectureId === excludeLectureId) {
      return false;
    }
    return lecture.dayOfWeek === newLecture.dayOfWeek;
  });

  // 시간 중복 검사
  for (const existingLecture of sameDayLectures) {
    if (isTimeOverlapping(
      newLecture.startTime,
      newLecture.endTime,
      existingLecture.startTime,
      existingLecture.endTime
    )) {
      return {
        isValid: false,
        conflictingLecture: existingLecture,
        message: `'${existingLecture.lectureName}' 강의(${existingLecture.startTime}-${existingLecture.endTime})와 시간이 겹칩니다.`
      };
    }
  }

  return { isValid: true };
};

// 시간 형식 검증
export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;
  return timeRegex.test(time);
};

// 시작시간이 종료시간보다 이른지 검증
export const validateTimeOrder = (startTime: string, endTime: string): boolean => {
  if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
    return false;
  }
  
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  return startMinutes < endMinutes;
};

// 강의 데이터 전체 검증
export interface LectureValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLectureData = (
  data: LectureCreateRequest | LectureUpdateRequest,
  existingLectures?: Lecture[],
  excludeLectureId?: number
): LectureValidationResult => {
  const errors: Record<string, string> = {};

  // 필수 필드 검증
  if (!data.name.trim()) {
    errors.name = '강의명을 입력해주세요';
  }
  
  if (!data.subjectCode.trim()) {
    errors.subjectCode = '과목코드를 입력해주세요';
  }
  
  if (!data.classroom.trim()) {
    errors.classroom = '강의실을 입력해주세요';
  }
  
  if (!data.professor.trim()) {
    errors.professor = '교수명을 입력해주세요';
  }

  // 시간 형식 검증
  if (!data.startTime.trim()) {
    errors.startTime = '시작시간을 입력해주세요';
  } else if (!validateTimeFormat(data.startTime)) {
    errors.startTime = 'HH:mm 형식으로 입력해주세요 (예: 09:00)';
  }

  if (!data.endTime.trim()) {
    errors.endTime = '종료시간을 입력해주세요';
  } else if (!validateTimeFormat(data.endTime)) {
    errors.endTime = 'HH:mm 형식으로 입력해주세요 (예: 10:30)';
  }

  // 시간 순서 검증
  if (data.startTime && data.endTime && validateTimeFormat(data.startTime) && validateTimeFormat(data.endTime)) {
    if (!validateTimeOrder(data.startTime, data.endTime)) {
      errors.endTime = '종료시간은 시작시간보다 늦어야 합니다';
    }
  }

  // 시간 중복 검증 (기존 강의 목록이 제공된 경우)
  if (existingLectures && Object.keys(errors).length === 0) {
    const conflictResult = validateLectureTimeConflict(existingLectures, data, excludeLectureId);
    if (!conflictResult.isValid) {
      errors.timeConflict = conflictResult.message || '시간이 중복됩니다';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 요일 한글->영문 변환
export const getDayOfWeekInEnglish = (koreanDay: string): string => {
  const dayMap: Record<string, string> = {
    '월': 'MON',
    '화': 'TUE', 
    '수': 'WED',
    '목': 'THU',
    '금': 'FRI',
    '토': 'SAT',
    '일': 'SUN'
  };
  return dayMap[koreanDay] || koreanDay;
};

// 요일 영문->한글 변환
export const getDayOfWeekInKorean = (englishDay: string): string => {
  const dayMap: Record<string, string> = {
    'MON': '월',
    'TUE': '화',
    'WED': '수', 
    'THU': '목',
    'FRI': '금',
    'SAT': '토',
    'SUN': '일'
  };
  return dayMap[englishDay] || englishDay;
};