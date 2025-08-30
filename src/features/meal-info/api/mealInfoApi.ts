import { apiClient } from '@/src/shared/api/client';

// 밥약 정보 응답 타입 (MealChatInfoScreen에서 사용하는 MealInfo 타입과 맞춤)
export interface MealAppointmentInfo {
  mealId: string;
  title: string;
  date: string;
  time: string;
  memo: string;
  host: {
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  };
  participants: Array<{
    name: string;
    studentId: string;
    department: string;
    profileUrl: string;
  }>;
  chatRoomId: string;
}

export const mealInfoApi = {
  // 밥약 정보 조회
  getMealAppointmentInfo: async (
    appointmentId: string
  ): Promise<{ success: boolean; data?: MealAppointmentInfo; error?: string }> => {
    try {
      const response = await apiClient.get<MealAppointmentInfo>(
        `/meal-appointments/${appointmentId}`
      );
      
      if (response.success && response.data) {
        // API 응답을 UI에서 기대하는 형태로 변환
        const transformedData = {
          mealId: response.data.id.toString(),
          title: response.data.name,
          date: response.data.appointmentDate,
          time: response.data.appointmentTime.substring(0, 5), // "16:30:00" -> "16:30"
          memo: response.data.memo,
          host: {
            name: response.data.creator.name,
            studentId: response.data.creator.studentId,
            department: response.data.creator.department,
            profileUrl: response.data.creator.profileUrl
          },
          participants: response.data.participants,
          chatRoomId: response.data.chatRoomId.toString()
        };
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        return {
          success: false,
          error: response.error || '밥약 정보를 불러오는데 실패했습니다'
        };
      }
    } catch (error) {
      console.error('Meal Info API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '밥약 정보를 불러오는 중 오류가 발생했습니다'
      };
    }
  }
};