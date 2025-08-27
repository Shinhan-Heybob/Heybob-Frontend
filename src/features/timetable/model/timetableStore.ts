import { create } from 'zustand';
import { TimetableResponse, TimetableCreateRequest, Lecture, LectureCreateRequest, LectureUpdateRequest } from '../types';
import { TimetableApi } from '../api';

interface TimetableState {
  // 현재 선택된 시간표
  currentTimetable: TimetableResponse | null;
  
  // 로딩 상태들
  isLoadingCurrent: boolean;
  isCreating: boolean;
  isCreatingLecture: boolean;
  isUpdatingLecture: boolean;
  isDeletingLecture: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 선택된 강의 (상세 모달용)
  selectedLecture: Lecture | null;
}

interface TimetableActions {
  // 시간표 생성
  createTimetable: (data: TimetableCreateRequest) => Promise<boolean>;
  
  // 현재 시간표 관련
  fetchCurrentTimetable: (id: number) => Promise<void>;
  clearCurrentTimetable: () => void;
  
  // 강의 관련
  createLecture: (timeTableId: number, data: LectureCreateRequest) => Promise<boolean>;
  updateLecture: (lectureId: number, data: LectureUpdateRequest) => Promise<boolean>;
  deleteLecture: (lectureId: number) => Promise<boolean>;
  
  // 강의 상세
  setSelectedLecture: (lecture: Lecture | null) => void;
  
  // 에러 처리
  clearError: () => void;
}

type TimetableStore = TimetableState & TimetableActions;

export const useTimetableStore = create<TimetableStore>((set, get) => ({
  // 초기 상태
  currentTimetable: null,
  isLoadingCurrent: false,
  isCreating: false,
  isCreatingLecture: false,
  isUpdatingLecture: false,
  isDeletingLecture: false,
  error: null,
  selectedLecture: null,

  // 시간표 생성
  createTimetable: async (data: TimetableCreateRequest) => {
    set({ isCreating: true, error: null });
    
    try {
      const response = await TimetableApi.createTimetable(data);
      
      if (response.success && response.data) {
        set({ 
          currentTimetable: response.data,
          isCreating: false 
        });
        return true;
      } else {
        set({ 
          error: response.error || '시간표를 생성할 수 없습니다',
          isCreating: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: '시간표 생성 중 오류가 발생했습니다',
        isCreating: false 
      });
      return false;
    }
  },

  // 현재 시간표 조회 (강의 정보 포함)
  fetchCurrentTimetable: async (id: number) => {
    set({ isLoadingCurrent: true, error: null });
    
    try {
      const response = await TimetableApi.getTimetable(id);
      
      if (response.success && response.data) {
        set({ 
          currentTimetable: response.data,
          isLoadingCurrent: false 
        });
      } else {
        set({ 
          error: response.error || '시간표를 불러올 수 없습니다',
          isLoadingCurrent: false 
        });
      }
    } catch (error) {
      set({ 
        error: '시간표 조회 중 오류가 발생했습니다',
        isLoadingCurrent: false 
      });
    }
  },

  // 현재 시간표 초기화
  clearCurrentTimetable: () => {
    set({ currentTimetable: null });
  },

  // 선택된 강의 설정
  setSelectedLecture: (lecture: Lecture | null) => {
    set({ selectedLecture: lecture });
  },

  // 강의 생성
  createLecture: async (timeTableId: number, data: LectureCreateRequest) => {
    set({ isCreatingLecture: true, error: null });
    
    try {
      const response = await TimetableApi.createLecture(timeTableId, data);
      
      if (response.success) {
        // 현재 시간표를 다시 불러와 최신 강의 목록 반영
        await get().fetchCurrentTimetable(timeTableId);
        set({ isCreatingLecture: false });
        return true;
      } else {
        set({ 
          error: response.error || '강의를 생성할 수 없습니다',
          isCreatingLecture: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: '강의 생성 중 오류가 발생했습니다',
        isCreatingLecture: false 
      });
      return false;
    }
  },

  // 강의 수정
  updateLecture: async (lectureId: number, data: LectureUpdateRequest) => {
    set({ isUpdatingLecture: true, error: null });
    
    try {
      const response = await TimetableApi.updateLecture(lectureId, data);
      
      if (response.success) {
        // 현재 시간표가 있다면 다시 불러와 최신 정보 반영
        const { currentTimetable } = get();
        if (currentTimetable) {
          await get().fetchCurrentTimetable(currentTimetable.id);
        }
        set({ isUpdatingLecture: false });
        return true;
      } else {
        set({ 
          error: response.error || '강의를 수정할 수 없습니다',
          isUpdatingLecture: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: '강의 수정 중 오류가 발생했습니다',
        isUpdatingLecture: false 
      });
      return false;
    }
  },

  // 강의 삭제
  deleteLecture: async (lectureId: number) => {
    set({ isDeletingLecture: true, error: null });
    
    try {
      const response = await TimetableApi.deleteLecture(lectureId);
      
      if (response.success) {
        // 현재 시간표가 있다면 다시 불러와 최신 정보 반영
        const { currentTimetable } = get();
        if (currentTimetable) {
          await get().fetchCurrentTimetable(currentTimetable.id);
        }
        set({ isDeletingLecture: false });
        return true;
      } else {
        set({ 
          error: response.error || '강의를 삭제할 수 없습니다',
          isDeletingLecture: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: '강의 삭제 중 오류가 발생했습니다',
        isDeletingLecture: false 
      });
      return false;
    }
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));