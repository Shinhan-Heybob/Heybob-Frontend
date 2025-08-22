import { create } from 'zustand';
import { User, LoginRequest } from '@/src/shared/types/auth';
import { SCHOOLS } from '@/src/shared/data/schools';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (loginData: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login Action
  login: async (loginData: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      // 더미 API 호출 시뮬레이션 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 더미 로그인 검증 (실제로는 API 호출)
      if (loginData.studentId === 'test123' && loginData.password === 'password') {
        const selectedSchool = SCHOOLS.find(school => school.id === loginData.schoolId);
        
        const mockUser: User = {
          id: '1',
          studentId: loginData.studentId,
          name: '테스트 사용자',
          school: selectedSchool || SCHOOLS[0], // 기본값으로 첫 번째 학교
        };
        
        set({ 
          user: mockUser, 
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        });
      } else {
        // 로그인 실패
        set({ 
          error: '학번 또는 비밀번호가 올바르지 않습니다.',
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        isLoading: false 
      });
    }
  },

  // Logout Action
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  // Clear Error Action
  clearError: () => {
    set({ error: null });
  },
}));