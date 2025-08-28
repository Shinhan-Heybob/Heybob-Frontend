import { DEPARTMENTS } from '@/src/shared/data/departments';
import { SCHOOLS } from '@/src/shared/data/schools';
import { LoginFormData, SignUpFormData, User } from '@/src/shared/types/auth';
import { storage } from '@/src/shared/lib/storage';
import { authApi, LoginRequest, SignUpRequest } from '../api/authApi';
import { create } from 'zustand';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (loginData: LoginFormData) => Promise<void>;
  signUp: (signUpData: SignUpFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login Action
  login: async (formData: LoginFormData) => {
    set({ isLoading: true, error: null });
    
    try {
      // 학교 정보 조회
      const selectedSchool = SCHOOLS.find(school => school.id === formData.schoolId);
      if (!selectedSchool) {
        set({ 
          error: '선택한 학교 정보를 찾을 수 없습니다.',
          isLoading: false 
        });
        return;
      }

      // API 요청용 데이터 변환
      const loginRequest: LoginRequest = {
        university: selectedSchool.name,
        studentId: formData.studentId,
        password: formData.password,
      };

      // API 호출
      const response = await authApi.login(loginRequest);
      
      if (response.success && response.data) {
        // 토큰 및 사용자 ID 저장
        await storage.setToken(response.data.refreshToken);
        await storage.setUserId(response.data.userId);

        // 임시 사용자 정보 생성 (추후 profile API로 대체)
        const user: User = {
          id: response.data.userId.toString(),
          studentId: formData.studentId,
          name: '사용자', // 추후 profile API에서 가져오기
          school: selectedSchool,
          department: DEPARTMENTS[0], // 추후 profile API에서 가져오기
          avatarId: 'avatar_01', // 추후 profile API에서 가져오기
        };
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        });
      } else {
        set({ 
          error: response.error || '로그인에 실패했습니다.',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('로그인 오류:', error);
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
      // 학교 정보 조회
      const selectedSchool = SCHOOLS.find(school => school.id === signUpData.schoolId);
      const selectedDepartment = DEPARTMENTS.find(dept => dept.id === signUpData.departmentId);
      
      if (!selectedSchool || !selectedDepartment) {
        set({ 
          error: '선택한 학교 또는 학과 정보를 찾을 수 없습니다.',
          isLoading: false 
        });
        return;
      }

      // API 요청용 데이터 변환
      const signUpRequest: SignUpRequest = {
        name: signUpData.name,
        profileUrl: signUpData.avatarId, // avatarId를 profileUrl로 사용
        password: signUpData.password,
        studentId: signUpData.studentId,
        university: selectedSchool.name,
        department: selectedDepartment.name,
        agreeTerms: signUpData.agreeTerms,
      };

      // API 호출
      const response = await authApi.signUp(signUpRequest);
      
      if (response.success && response.data) {
        // 토큰 및 사용자 ID 저장
        await storage.setToken(response.data.refreshToken);
        await storage.setUserId(response.data.userId);

        // 사용자 정보 생성
        const newUser: User = {
          id: response.data.userId.toString(),
          studentId: signUpData.studentId,
          name: signUpData.name,
          school: selectedSchool,
          department: selectedDepartment,
          avatarId: signUpData.avatarId,
        };
        
        // 회원가입 후 자동 로그인
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        });
      } else {
        set({ 
          error: response.error || '회원가입에 실패했습니다.',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      set({ 
        error: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
        isLoading: false 
      });
    }
  },

  // Logout Action
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
    } finally {
      // 로컬 저장소 정리
      await storage.clearAll();
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
    }
  },

  // Clear Error Action
  clearError: () => {
    set({ error: null });
  },

  // 앱 시작 시 인증 상태 초기화
  initializeAuth: async () => {
    try {
      const token = await storage.getToken();
      const userId = await storage.getUserId();
      
      if (token && userId) {
        // 토큰이 있으면 프로필 정보 조회 시도
        const profileResponse = await authApi.getProfile();
        
        if (profileResponse.success && profileResponse.data) {
          // 프로필 정보로 사용자 상태 복원
          // 현재는 임시로 기본 사용자 정보 생성
          const user: User = {
            id: userId.toString(),
            studentId: 'stored_user',
            name: '사용자',
            school: SCHOOLS[0],
            department: DEPARTMENTS[0],
            avatarId: 'avatar_01',
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          // 프로필 조회 실패 시 로그아웃
          await storage.clearAll();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('인증 초기화 오류:', error);
      await storage.clearAll();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));