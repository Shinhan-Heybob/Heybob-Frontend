// 시간표 전용 API 클라이언트

import { TimetableCreateRequest, TimetableResponse, LectureCreateRequest, LectureUpdateRequest, ApiError } from '../types';

// API 기본 설정
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  apiError?: ApiError;
}

// 시간표 API 클래스
export class TimetableApi {
  
  // 시간표 생성
  static async createTimetable(data: TimetableCreateRequest): Promise<ApiResponse<TimetableResponse>> {
    try {
      console.log('🌐 시간표 생성 API 요청:', data);
      
      // TODO: 실제 API 연동시 아래 주석 해제
      // const response = await fetch(`${API_BASE_URL}/timetable`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const result = await response.json();
      
      // 임시 더미 응답 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: TimetableResponse = {
        id: Date.now(),
        timeTableName: data.timeTableName,
        lectures: []
      };
      
      console.log('✅ 시간표 생성 성공:', mockResponse);
      return { success: true, data: mockResponse };
      
    } catch (error) {
      console.error('❌ 시간표 생성 실패:', error);
      return { 
        success: false, 
        error: '시간표 생성 중 오류가 발생했습니다.' 
      };
    }
  }

  // 시간표 조회
  static async getTimetable(timeTableId: number): Promise<ApiResponse<TimetableResponse>> {
    try {
      console.log('🌐 시간표 조회 API 요청:', timeTableId);
      
      // TODO: 실제 API 연동시 아래 주석 해제
      // const response = await fetch(`${API_BASE_URL}/timetable/${timeTableId}`);
      // const result = await response.json();
      
      // 임시 더미 응답 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: TimetableResponse = {
        id: timeTableId,
        timeTableName: '내 시간표',
        lectures: [
          {
            lectureId: 1,
            lectureName: '데이터구조',
            subjectCode: 'CS101',
            dayOfWeek: '월',
            startTime: '09:00',
            endTime: '10:30',
            classroom: '공학관 301호',
            professor: '김교수'
          },
          {
            lectureId: 2,
            lectureName: '알고리즘',
            subjectCode: 'CS201',
            dayOfWeek: '월',
            startTime: '14:00',
            endTime: '15:30',
            classroom: '공학관 302호',
            professor: '이교수'
          },
          {
            lectureId: 3,
            lectureName: '웹프로그래밍',
            subjectCode: 'CS301',
            dayOfWeek: '화',
            startTime: '10:00',
            endTime: '12:00',
            classroom: '공학관 303호',
            professor: '박교수'
          },
          {
            lectureId: 4,
            lectureName: '데이터베이스',
            subjectCode: 'CS401',
            dayOfWeek: '수',
            startTime: '13:00',
            endTime: '14:30',
            classroom: '공학관 304호',
            professor: '최교수'
          },
          {
            lectureId: 5,
            lectureName: '소프트웨어공학',
            subjectCode: 'CS501',
            dayOfWeek: '목',
            startTime: '15:00',
            endTime: '16:30',
            classroom: '공학관 305호',
            professor: '정교수'
          },
          {
            lectureId: 6,
            lectureName: '운영체제',
            subjectCode: 'CS601',
            dayOfWeek: '금',
            startTime: '11:00',
            endTime: '12:30',
            classroom: '공학관 306호',
            professor: '윤교수'
          }
        ]
      };
      
      console.log('✅ 시간표 조회 성공:', mockResponse);
      return { success: true, data: mockResponse };
      
    } catch (error) {
      console.error('❌ 시간표 조회 실패:', error);
      return { 
        success: false, 
        error: '시간표를 불러오는 중 오류가 발생했습니다.' 
      };
    }
  }

  // 시간표 삭제
  static async deleteTimetable(timeTableId: number): Promise<ApiResponse<void>> {
    try {
      console.log('🌐 시간표 삭제 API 요청:', timeTableId);
      
      // TODO: 실제 API 연동시 아래 주석 해제
      // const response = await fetch(`${API_BASE_URL}/timetable/${timeTableId}`, {
      //   method: 'DELETE'
      // });
      
      // 임시 더미 응답 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ 시간표 삭제 성공:', timeTableId);
      return { success: true };
      
    } catch (error) {
      console.error('❌ 시간표 삭제 실패:', error);
      return { 
        success: false, 
        error: '시간표 삭제 중 오류가 발생했습니다.' 
      };
    }
  }

  // 강의 생성
  static async createLecture(timeTableId: number, data: LectureCreateRequest): Promise<ApiResponse<void>> {
    try {
      console.log('🌐 강의 생성 API 요청:', { timeTableId, data });
      
      // TODO: 실제 API 연동시 아래 주석 해제
      // const response = await fetch(`${API_BASE_URL}/timetable/lecture/${timeTableId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   return { 
      //     success: false, 
      //     apiError: errorData,
      //     error: errorData.message || '강의 생성에 실패했습니다.' 
      //   };
      // }
      
      // 임시 더미 응답 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 시간 중복 검증 시뮬레이션 (임시)
      if (data.dayOfWeek === '월' && data.startTime === '09:00') {
        return {
          success: false,
          apiError: {
            status: 400,
            customCode: 400,
            message: '강의 시간이 겹칩니다'
          },
          error: '강의 시간이 겹칩니다'
        };
      }
      
      console.log('✅ 강의 생성 성공');
      return { success: true };
      
    } catch (error) {
      console.error('❌ 강의 생성 실패:', error);
      return { 
        success: false, 
        error: '강의 생성 중 오류가 발생했습니다.' 
      };
    }
  }

  // 강의 수정
  static async updateLecture(lectureId: number, data: LectureUpdateRequest): Promise<ApiResponse<void>> {
    try {
      console.log('🌐 강의 수정 API 요청:', { lectureId, data });
      
      // TODO: 실제 API 연동시 아래 주석 해제
      // const response = await fetch(`${API_BASE_URL}/timetable/lecture/${lectureId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   return { 
      //     success: false, 
      //     apiError: errorData,
      //     error: errorData.message || '강의 수정에 실패했습니다.' 
      //   };
      // }
      
      // 임시 더미 응답 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ 강의 수정 성공');
      return { success: true };
      
    } catch (error) {
      console.error('❌ 강의 수정 실패:', error);
      return { 
        success: false, 
        error: '강의 수정 중 오류가 발생했습니다.' 
      };
    }
  }

  // 강의 삭제
  static async deleteLecture(lectureId: number): Promise<ApiResponse<void>> {
    try {
      console.log('🌐 강의 삭제 API 요청:', lectureId);
      
      // TODO: 실제 API 연동시 아래 주석 해제
      // const response = await fetch(`${API_BASE_URL}/timetable/lecture/${lectureId}`, {
      //   method: 'DELETE'
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   return { 
      //     success: false, 
      //     apiError: errorData,
      //     error: errorData.message || '강의 삭제에 실패했습니다.' 
      //   };
      // }
      
      // 임시 더미 응답 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ 강의 삭제 성공');
      return { success: true };
      
    } catch (error) {
      console.error('❌ 강의 삭제 실패:', error);
      return { 
        success: false, 
        error: '강의 삭제 중 오류가 발생했습니다.' 
      };
    }
  }
}