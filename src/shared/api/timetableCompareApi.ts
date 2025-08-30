// 시간표 비교 API

import { apiClient } from './client';

// API 요청 타입
export interface TimetableCompareRequest {
  userIdList: number[];
  day: string; // YYYY-MM-DD 형식
}

// API 응답 타입
export interface TimeSlot {
  startTime: string;        // "09:00:00"
  endTime: string;          // "09:30:00"
  availablePeopleName: string[];  // ["김철수", "이영희"]
}

export interface TimetableCompareResponse {
  timeslots: TimeSlot[];
}

// 시간표 비교 API 함수
export const compareTimetables = async (
  request: TimetableCompareRequest
): Promise<{ success: boolean; data?: TimetableCompareResponse; error?: string }> => {
  try {
    console.log('🌐 시간표 비교 API 요청:', request);
    
    const response = await apiClient.post<TimetableCompareResponse>(
      '/timetable/compare',
      request
    );
    
    if (response.success && response.data) {
      // 실제 배열 내용 확인을 위해 상세 로깅
      console.log('✅ 시간표 비교 API 성공 - 전체 응답:', JSON.stringify(response.data, null, 2));
      console.log('✅ 첫 번째 타임슬롯 상세:', response.data.timeslots[0]);
      console.log('✅ 첫 번째 타임슬롯의 availablePeopleName:', response.data.timeslots[0]?.availablePeopleName);
      
      return {
        success: true,
        data: response.data
      };
    } else {
      console.error('❌ 시간표 비교 API 실패:', response.error);
      return {
        success: false,
        error: response.error || '시간표 비교에 실패했습니다'
      };
    }
  } catch (error) {
    console.error('❌ 시간표 비교 API 오류:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다'
    };
  }
};