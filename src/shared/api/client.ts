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
      const token = options.skipAuth ? null : await storage.getToken();
      
      const { skipAuth, ...requestOptions } = options;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...requestOptions.headers,
        },
        ...requestOptions,
      };

      console.log(`🌐 API 요청: ${config.method || 'GET'} ${url}`);
      console.log(`🔑 Authorization 헤더:`, (config.headers as Record<string, string>)?.['Authorization'] ? '있음' : '없음');
      if (options.skipAuth) {
        console.log(`⏭️ skipAuth: true - 토큰 제외됨`);
      }
      
      const response = await fetch(url, config);
      
      // 응답이 비어있는 경우 처리
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        data = {};
      }

      // 401 Unauthorized 처리
      if (response.status === 401) {
        console.warn('🔒 인증 토큰이 만료되었습니다.');
        console.log('🔍 client.ts - storage.clearAll() 호출됨');
        await storage.clearAll();
        // 로그아웃 처리는 AuthStore에서 담당
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