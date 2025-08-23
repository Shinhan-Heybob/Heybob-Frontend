import { create } from 'zustand';
import { User, LoginRequest, SignUpFormData } from '@/src/shared/types/auth';
import { SCHOOLS } from '@/src/shared/data/schools';
import { DEPARTMENTS } from '@/src/shared/data/departments';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (loginData: LoginRequest) => Promise<void>;
  signUp: (signUpData: SignUpFormData) => Promise<void>;
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
          department: DEPARTMENTS[0], // 임시 학과
          avatarId: 'avatar_01', // 임시 아바타
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

  // SignUp Action
  signUp: async (signUpData: SignUpFormData) => {
    set({ isLoading: true, error: null });
    
    try {
      // 더미 API 호출 시뮬레이션 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 회원가입 성공 처리 (실제로는 API 호출)
      const selectedSchool = SCHOOLS.find(school => school.id === signUpData.schoolId);
      const selectedDepartment = DEPARTMENTS.find(dept => dept.id === signUpData.departmentId);
      
      const newUser: User = {
        id: Date.now().toString(), // 임시 ID 생성
        studentId: signUpData.studentId,
        name: signUpData.name,
        school: selectedSchool || SCHOOLS[0],
        department: selectedDepartment || DEPARTMENTS[0],
        avatarId: signUpData.avatarId,
      };
      
      // 회원가입 후 자동 로그인
      set({ 
        user: newUser, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        error: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
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