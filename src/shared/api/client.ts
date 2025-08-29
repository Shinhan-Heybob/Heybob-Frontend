// API 클라이언트 설정

import { storage } from '@/src/shared/lib/storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';
const CHAT_API_BASE_URL = process.env.EXPO_PUBLIC_CHAT_API_URL || 'http://localhost:8081/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // 토큰 가져오기 (skipAuth가 true가 아닌 경우만)
      const token = options.skipAuth ? null : await storage.getAccessToken();
      
      const { skipAuth, ...requestOptions } = options;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...requestOptions.headers,
        },
        ...requestOptions,
      };

      // console.log(`🌐 API 요청: ${config.method || 'GET'} ${url}`);
      const authHeader = (config.headers as Record<string, string>)?.['Authorization'];
      // console.log(`🔑 Authorization 헤더:`, authHeader || '없음');
      // if (options.skipAuth) {
      //   console.log(`⏭️ skipAuth: true - 토큰 제외됨`);
      // }
      if (token) {
        // console.log(`🎫 실제 토큰: ${token.substring(0, 50)}...`);
        
        // JWT 토큰 만료 시간 확인
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          const exp = payload.exp;
          // console.log(`⏰ 토큰 만료시간: ${new Date(exp * 1000).toLocaleString()}`);
          // console.log(`⏰ 현재 시간: ${new Date().toLocaleString()}`);
          // console.log(`⏰ 만료 여부: ${now > exp ? '만료됨' : '유효함'} (${exp - now}초 남음)`);
        } catch (e) {
          console.log(`🎫 토큰 파싱 실패`);
        }
      } else {
        console.log(`🎫 토큰: null 또는 undefined`);
      }
      
      const response = await fetch(url, config);
      
      // 응답 상세 정보 로깅
      console.log(`📊 응답 상태: ${response.status} ${response.statusText}`);
      if (response.status === 401) {
        console.log(`🔍 401 오류 - 요청 URL: ${url}`);
        console.log(`🔍 401 오류 - 사용된 토큰: ${token ? token.substring(0, 50) + '...' : 'null'}`);
      }
      
      // 응답이 비어있는 경우 처리
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        data = {};
      }

      // 401 Unauthorized 처리 (로그인 요청은 제외)
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/signup')) {
        console.warn('🔒 인증 토큰이 만료되었습니다.');
        
        // 토큰이 존재하는 경우에만 clearAll 호출 (중복 호출 방지)
        const currentToken = await storage.getAccessToken();
        if (currentToken) {
          console.log('🔍 client.ts - storage.clearAll() 호출됨');
          await storage.clearAll();
        } else {
          console.log('🔍 client.ts - 토큰이 이미 삭제되어 clearAll() 생략');
        }
        
        return {
          success: false,
          error: 'UNAUTHORIZED',
        };
      }

      if (!response.ok) {
        console.error(`❌ API 오류 [${response.status}]:`, data);
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      console.log(`✅ API 응답:`, data);
      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('❌ API 요청 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다',
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { 
      method: 'GET',
      ...options
    });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export const chatApiClient = new ApiClient(CHAT_API_BASE_URL);
export type { ApiResponse };

