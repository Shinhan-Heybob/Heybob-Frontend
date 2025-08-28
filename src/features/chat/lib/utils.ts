import type { MessageType } from '../model/types';

// 메시지 카테고리 분류
export type MessageCategory = 'chat' | 'notification' | 'payment' | 'savings' | 'info' | 'ai' | 'unknown';

export const getMessageCategory = (messageType: MessageType): MessageCategory => {
  if (messageType === 'CHAT') return 'chat';
  if (['JOIN', 'LEAVE'].includes(messageType)) return 'notification';  
  if (['PAYMENT_REQUEST', 'PAYMENT_CONFIRM', 'PAYMENT_COMPLETE'].includes(messageType)) return 'payment';
  if (['SAVINGS_REQUEST', 'SAVINGS_COMPLETE'].includes(messageType)) return 'savings';
  if (messageType === 'CAFETERIA_INFO') return 'info';
  if (['AI_BOT_REQUEST', 'AI_BOT_RESPONSE'].includes(messageType)) return 'ai';
  return 'unknown';
};

// 시간 포맷팅 유틸리티
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${period} ${displayHours}:${minutes}`;
};

// 현재 사용자 메시지인지 확인
export const isMyMessage = (senderId: string, currentUserId: string): boolean => {
  return senderId === currentUserId;
};