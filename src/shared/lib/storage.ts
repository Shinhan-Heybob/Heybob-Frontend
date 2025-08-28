import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'userId',
} as const;

export const storage = {
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('토큰 조회 실패:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
  },

  async setUserId(userId: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
    } catch (error) {
      console.error('사용자 ID 저장 실패:', error);
    }
  },

  async getUserId(): Promise<number | null> {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      return userId ? parseInt(userId, 10) : null;
    } catch (error) {
      console.error('사용자 ID 조회 실패:', error);
      return null;
    }
  },

  async removeUserId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.error('사용자 ID 삭제 실패:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_ID,
      ]);
    } catch (error) {
      console.error('저장소 초기화 실패:', error);
    }
  },
};