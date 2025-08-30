/**
 * 한국 시간대(KST)를 기준으로 현재 날짜를 반환
 * React Native/Expo 환경에서 시간대 문제를 해결하기 위한 유틸리티
 */
export const getKoreanDate = (): Date => {
  const now = new Date();
  
  // UTC 시간 가져오기
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // 한국 시간 = UTC + 9시간
  const koreanTime = new Date(utcTime + (9 * 60 * 60 * 1000));
  
  return koreanTime;
};

/**
 * Date 객체를 YYYYMMDD 형식의 문자열로 변환
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환
 */
export const formatDateToYYYY_MM_DD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * YYYYMMDD 형식의 문자열을 MM월 DD일 형식으로 변환
 */
export const formatDateToDisplay = (dateStr: string): string => {
  if (dateStr.length !== 8) return '';
  const month = parseInt(dateStr.substring(4, 6));
  const day = parseInt(dateStr.substring(6, 8));
  return `${month}월 ${day}일`;
};