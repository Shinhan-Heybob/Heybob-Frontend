import { apiClient } from '@/src/shared/api/client';

export interface LoginRequest {
  university: string;
  studentId: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  refreshToken: string;
}

export interface SignUpRequest {
  name: string;
  profileUrl: string;
  password: string;
  studentId: string;
  university: string;
  department: string;
  agreeTerms: boolean;
}

export interface SignUpResponse {
  userId: number;
  refreshToken: string;
}

export const authApi = {
  login: async (loginData: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', loginData, { skipAuth: true });
    return response;
  },

  signUp: async (signUpData: SignUpRequest) => {
    const response = await apiClient.post<SignUpResponse>('/auth/signup', signUpData, { skipAuth: true });
    return response;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response;
  }
};