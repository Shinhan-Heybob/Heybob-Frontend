// API 클라이언트 설정

// 개발 환경에서 localhost 대신 실제 IP 주소 사용
const getApiBaseUrl = () => {
  if (__DEV__) {
    // 개발 환경에서는 실제 네트워크 IP 사용
    return process.env.EXPO_PUBLIC_API_URL || 'http://70.12.246.239:3000/api';
  }
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
};

const getChatApiBaseUrl = () => {
  if (__DEV__) {
    // 개발 환경에서는 실제 네트워크 IP 사용  
    return process.env.EXPO_PUBLIC_CHAT_API_URL || 'http://70.12.246.239:8081/api';
  }
  return process.env.EXPO_PUBLIC_CHAT_API_URL || 'http://localhost:8081/api';
};

const API_BASE_URL = getApiBaseUrl();
const CHAT_API_BASE_URL = getChatApiBaseUrl();

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      console.log(`🌐 API 요청: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

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

  async get<T>(endpoint: string, options: { headers?: Record<string, string> } = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { 
      method: 'GET',
      headers: options.headers 
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
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
