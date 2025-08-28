// 시간표 전용 API 클라이언트

import { TimetableCreateRequest, TimetableResponse, LectureCreateRequest, LectureUpdateRequest, ApiError } from '../types';
import { storage } from '@/src/shared/lib/storage';
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

      const token = await storage.getToken(); // 토큰 저장 방식에 따라 수정

          if (!token) {
            return {
              success: false,
              error: '로그인이 필요합니다.'
            };
          }
      
      //TODO: 실제 API 연동시 아래 주석 해제
      const response = await fetch(`${API_BASE_URL}/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
                'Authorization': 'Bearer ${token}'
            },
        body: JSON.stringify(data)
      });

      // HTTP 상태 코드 확인
          if (!response.ok) {
            if (response.status === 401) {
              return {
                success: false,
                error: '인증이 만료되었습니다. 다시 로그인해주세요.'
              };
            }
            return {
              success: false,
              error: `서버 오류: ${response.status}`
            };
          }

          const result: TimetableResponse = await response.json();

      console.log('✅ 시간표 생성 성공:', result);
      return { success: true, data: result};
      
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

      const token = await storage.getToken();// 토큰 저장 방식에 따라 수정
              if (!token) {
                  return {
                    success: false,
                    error: '로그인이 필요합니다.'
                  };
              }

      // TODO: 실제 API 연동시 아래 주석 해제
      const response = await fetch(`${API_BASE_URL}/timetable/${timeTableId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // JWT 토큰 헤더 추가[236][237]
            }
          });

      // HTTP 상태 코드 확인
          if (!response.ok) {
            if (response.status === 401) {
              return {
                success: false,
                error: '인증이 만료되었습니다. 다시 로그인해주세요.'
              };
            } else if (response.status === 404) {
              return {
                success: false,
                error: '해당 시간표를 찾을 수 없습니다.'
              };
            }

            const errorText = await response.text();
            console.error('서버 오류:', errorText);
            return {
              success: false,
              error: `서버 오류: ${response.status}`
            };
          }

      const result: TimetableResponse = await response.json();
      
      console.log('✅ 시간표 조회 성공:', result);
      return { success: true, data: result };
      
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


      const token = await await storage.getToken(); // 토큰 저장 방식에 따라 수정

               if (!token) {
                  return {
                    success: false,
                    error: '로그인이 필요합니다.'
                  };
              }

      // TODO: 실제 API 연동시 아래 주석 해제
      const response = await fetch(`${API_BASE_URL}/timetable/${timeTableId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // JWT 토큰 헤더 추가 필수!
            }
          });

      
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

      const token = await storage.getToken(); // 토큰 저장 방식에 따라 수정
              if (!token) {
                  return {
                    success: false,
                    error: '로그인이 필요합니다.'
                  };
              }
      //TODO: 실제 API 연동시 아래 주석 해제
      const response = await fetch(`${API_BASE_URL}/timetable/lecture/${timeTableId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                'Authorization': 'Bearer ${token}'
            },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          apiError: errorData,
          error: errorData.message || '강의 생성에 실패했습니다.'
        };
      }

      // 응답 처리
          if (!response.ok) {
            const errorData = await response.json();

            // 시간 중복 에러 처리
            if (response.status === 400) {
              return {
                success: false,
                apiError: errorData,
                error: errorData.message || '강의 시간이 중복됩니다.'
              };
            }

            // 인증 에러 처리
            if (response.status === 401) {
              return {
                success: false,
                error: '인증이 만료되었습니다. 다시 로그인해주세요.'
              };
            }

            // 시간표를 찾을 수 없음
            if (response.status === 404) {
              return {
                success: false,
                error: '해당 시간표를 찾을 수 없습니다.'
              };
            }

            return {
              success: false,
              apiError: errorData,
              error: errorData.message || '강의 생성에 실패했습니다.'
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

      const token = await storage.getToken(); // 토큰 저장 방식에 따라 수정
                    if (!token) {
                        return {
                          success: false,
                          error: '로그인이 필요합니다.'
                        };
                    }

      const response = await fetch(`${API_BASE_URL}/timetable/lecture/${lectureId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',
            'Authorization': 'Bearer ${token}'
            },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          apiError: errorData,
          error: errorData.message || '강의 수정에 실패했습니다.'
        };
      }
      
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

      const token = await storage.getToken(); // 토큰 저장 방식에 따라 수정

      if (!token) {
          return {
              success: false,
              error: '로그인이 필요합니다.'
              };
          }
      
      //TODO: 실제 API 연동시 아래 주석 해제
      const response = await fetch(`${API_BASE_URL}/timetable/lecture/${lectureId}`, {
        method: 'DELETE',
        headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // JWT 토큰 헤더 추가 필수!
              }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          apiError: errorData,
          error: errorData.message || '강의 삭제에 실패했습니다.'
        };
      }
      
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