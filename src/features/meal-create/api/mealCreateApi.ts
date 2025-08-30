import { apiClient } from '@/src/shared/api/client';

// 밥약 생성 요청 타입
export interface CreateMealAppointmentRequest {
  name: string;
  memo: string;
  appointmentDate: string;      // "2024-12-25"
  appointmentTime: string;      // "12:30:00"
  participantIds: number[];
  creatorId: number;
  mealType: string;             // "MEAL_APPOINTMENT"
}

// 밥약 생성 응답 타입
export interface CreateMealAppointmentResponse {
  id: number;
}

export const mealCreateApi = {
  // 밥약 생성
  createMealAppointment: async (
    request: CreateMealAppointmentRequest
  ): Promise<{ success: boolean; data?: CreateMealAppointmentResponse; error?: string }> => {
    try {
      const response = await apiClient.post<CreateMealAppointmentResponse>(
        '/meal-appointments',
        request
      );
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || '밥약 생성에 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Meal Create API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '밥약 생성 중 오류가 발생했습니다'
      };
    }
  }
};