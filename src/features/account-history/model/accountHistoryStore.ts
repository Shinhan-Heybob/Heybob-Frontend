import { create } from 'zustand';
import { accountHistoryApi } from '../api/accountHistoryApi';
import type { DateRange, DateSection, FormattedTransaction, TransactionHistoryDto } from './types';

interface AccountHistoryState {
  // 데이터
  transactions: TransactionHistoryDto[];
  totalCount: number;
  dateRange: DateRange;
  
  // 상태
  isLoading: boolean;
  error: string | null;
}

interface AccountHistoryActions {
  // 데이터 로드
  loadAccountHistory: () => Promise<void>;
  
  // 날짜 범위 변경
  setDateRange: (dateRange: DateRange) => void;
  
  // 유틸리티
  reset: () => void;
  clearError: () => void;
  
  // 포맷팅된 거래 내역 반환
  getFormattedTransactions: () => FormattedTransaction[];
  
  // 날짜별로 그룹핑된 거래 내역 반환
  getGroupedTransactions: () => DateSection[];
}

type AccountHistoryStore = AccountHistoryState & AccountHistoryActions;

// 기본 날짜 범위 (최근 30일)
const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  return {
    startDate: thirtyDaysAgo.toISOString().slice(0, 10).replace(/-/g, ''), // YYYYMMDD
    endDate: today.toISOString().slice(0, 10).replace(/-/g, ''), // YYYYMMDD
  };
};

// 거래 유형이 입금인지 확인하는 헬퍼 함수
const isDepositTransaction = (typeName: string): boolean => {
  return typeName.includes('입금');
};

// 금액 포맷팅 (천 단위 콤마)
const formatAmount = (amount: string): string => {
  const num = parseInt(amount, 10);
  return num.toLocaleString();
};

// 날짜 포맷팅 (YYYYMMDD → MM월 DD일)
const formatDate = (dateStr: string): string => {
  if (dateStr.length !== 8) return dateStr;
  const month = parseInt(dateStr.substring(4, 6));
  const day = parseInt(dateStr.substring(6, 8));
  return `${month}월 ${day}일`;
};

// 시간 포맷팅 (HHMMSS → HH:MM)
const formatTime = (timeStr: string): string => {
  if (timeStr.length < 4) return timeStr;
  const hour = timeStr.substring(0, 2);
  const minute = timeStr.substring(2, 4);
  return `${hour}:${minute}`;
};

// 날짜 전체 포맷팅 (YYYYMMDD → YYYY년 MM월 DD일)
const formatFullDate = (dateStr: string): string => {
  if (dateStr.length !== 8) return dateStr;
  const year = dateStr.substring(0, 4);
  const month = parseInt(dateStr.substring(4, 6));
  const day = parseInt(dateStr.substring(6, 8));
  return `${year}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일`;
};

export const useAccountHistoryStore = create<AccountHistoryStore>((set, get) => ({
  // 초기 상태
  transactions: [],
  totalCount: 0,
  dateRange: getDefaultDateRange(),
  isLoading: false,
  error: null,

  // 계좌 내역 로드
  loadAccountHistory: async () => {
    const { dateRange } = get();
    
    set({ isLoading: true, error: null });

    try {
      // 실제 API 호출 테스트
      const response = await accountHistoryApi.getAccountHistory(dateRange);
      // Mock API 호출 (개발용)
      // const response = await accountHistoryApi.getMockAccountHistory(dateRange);
      if (response.success && response.data) {
        set({ 
          transactions: response.data.transactionHistoryDtoList,
          totalCount: response.data.totalCount,
          isLoading: false 
        });
      } else {
        throw new Error(response.error || '데이터를 불러오는데 실패했습니다');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다',
        isLoading: false
      });
    }
  },

  // 날짜 범위 설정 및 데이터 재로드
  setDateRange: (newDateRange: DateRange) => {
    set({ dateRange: newDateRange });
    get().loadAccountHistory();
  },

  // 포맷팅된 거래 내역 반환
  getFormattedTransactions: (): FormattedTransaction[] => {
    const { transactions } = get();
    
    return transactions.map(transaction => ({
      ...transaction,
      isDeposit: isDepositTransaction(transaction.transactionTypeName),
      formattedAmount: (isDepositTransaction(transaction.transactionTypeName) ? '+' : '-') 
                      + formatAmount(transaction.transactionBalance),
      formattedDate: formatDate(transaction.transactionDate),
      formattedTime: formatTime(transaction.transactionTime),
    }));
  },

  // 상태 초기화
  reset: () => {
    set({
      transactions: [],
      totalCount: 0,
      dateRange: getDefaultDateRange(),
      isLoading: false,
      error: null,
    });
  },

  // 날짜별로 그룹핑된 거래 내역 반환
  getGroupedTransactions: (): DateSection[] => {
    const formattedTransactions = get().getFormattedTransactions();
    
    // 날짜별로 그룹핑
    const grouped: { [key: string]: FormattedTransaction[] } = {};
    
    formattedTransactions.forEach(transaction => {
      const dateKey = transaction.transactionDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    
    // DateSection 배열로 변환하고 날짜별로 정렬 (최신순)
    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a)) // 내림차순 정렬 (최신 날짜 먼저)
      .map(dateKey => ({
        title: formatFullDate(dateKey),
        data: grouped[dateKey]
      }));
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));