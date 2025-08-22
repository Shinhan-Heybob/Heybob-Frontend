import { School } from '../data/schools';

// 로그인 요청 타입
export interface LoginRequest {
  schoolId: string;    // 선택된 학교 ID
  studentId: string;   // 학번
  password: string;    // 비밀번호
}

// 사용자 정보 타입
export interface User {
  id: string;
  studentId: string;
  name: string;
  school: School;      // 소속 학교 정보
}

// 인증 응답 타입
export interface AuthResponse {
  user: User;
  token: string;
}

// API 에러 타입
export interface ApiError {
  message: string;
  code?: string;
}

// 폼 상태 타입
export interface LoginFormData {
  schoolId: string;
  studentId: string;
  password: string;
}