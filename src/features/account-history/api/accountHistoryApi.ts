import { apiClient } from '@/src/shared/api/client';
import type { AccountHistoryRequest, AccountHistoryResponse } from '../model/types';

const EMPTY: AccountHistoryResponse = {
  transactionHistoryDtoList: [],
  totalCount: 0,
};

export const accountHistoryApi = {
  // 실제 API 호출
  getAccountHistory: async (request: AccountHistoryRequest): Promise<AccountHistoryResponse> => {
    const res = await apiClient.post<AccountHistoryResponse>(
      '/account/personal/history',
      request,
    );
    
    if (!res.success) {
      throw new Error(res.error || 'Failed to fetch account history');
    }

    return res.data ?? EMPTY;
  },

  // 개발용 Mock API
  // getMockAccountHistory: async (request: AccountHistoryRequest): Promise<{ success: boolean; data: AccountHistoryResponse; error?: string }> => {
  //   await new Promise(resolve => setTimeout(resolve, 800));
    
  //   try {
  //     const mockData: TransactionHistoryDto[] = [
  //       {
  //         transactorName: "이지민",
  //         transactionUniqueNo: "59",
  //         transactionDate: "20250827",
  //         transactionTime: "102427",
  //         transactionTypeName: "입금(이체)",
  //         transactionBalance: "12000",
  //         transactionAfterBalance: "88000",
  //         eventTitle: "🍕 피자 먹으러 가실 분~"
  //       },
  //       {
  //         transactorName: "박재은",
  //         transactionUniqueNo: "60",
  //         transactionDate: "20250827",
  //         transactionTime: "143520",
  //         transactionTypeName: "출금(이체)",
  //         transactionBalance: "5000",
  //         transactionAfterBalance: "83000",
  //         eventTitle: "🍜 라면 끓여먹을 사람!"
  //       },
  //       {
  //         transactorName: "김민수",
  //         transactionUniqueNo: "61",
  //         transactionDate: "20250826",
  //         transactionTime: "191245",
  //         transactionTypeName: "입금(이체)",
  //         transactionBalance: "3000",
  //         transactionAfterBalance: "86000",
  //         eventTitle: "🍱 학식 같이 먹어요!"
  //       },
  //       {
  //         transactorName: "최유진",
  //         transactionUniqueNo: "62",
  //         transactionDate: "20250826",
  //         transactionTime: "120000",
  //         transactionTypeName: "출금(이체)",
  //         transactionBalance: "8000",
  //         transactionAfterBalance: "78000",
  //         eventTitle: "🥗 샐러드 같이 드실분"
  //       },
  //       {
  //         transactorName: "장동건",
  //         transactionUniqueNo: "63",
  //         transactionDate: "20250825",
  //         transactionTime: "200030",
  //         transactionTypeName: "입금(이체)",
  //         transactionBalance: "6000",
  //         transactionAfterBalance: "84000",
  //         eventTitle: "🍗 치킨 파티 하실분!!"
  //       },
  //       {
  //         transactorName: "정수아",
  //         transactionUniqueNo: "64",
  //         transactionDate: "20250825",
  //         transactionTime: "113000",
  //         transactionTypeName: "출금(이체)",
  //         transactionBalance: "4500",
  //         transactionAfterBalance: "79500",
  //         eventTitle: "🍱 기숙사 같이 밥먹기"
  //       },
  //       {
  //         transactorName: "윤도현",
  //         transactionUniqueNo: "65",
  //         transactionDate: "20250824",
  //         transactionTime: "155500",
  //         transactionTypeName: "입금(이체)",
  //         transactionBalance: "7500",
  //         transactionAfterBalance: "87000",
  //         eventTitle: "☕ 카페 스터디"
  //       },
  //       {
  //         transactorName: "김하늘",
  //         transactionUniqueNo: "66",
  //         transactionDate: "20250824",
  //         transactionTime: "140000",
  //         transactionTypeName: "출금(이체)",
  //         transactionBalance: "2500",
  //         transactionAfterBalance: "76500",
  //         eventTitle: "📚 스터디 모임"
  //       },
  //     ];

  //     // 날짜 범위 필터링
  //     const filteredData = mockData.filter(item => 
  //       item.transactionDate >= request.startDate && 
  //       item.transactionDate <= request.endDate
  //     );

  //     // 날짜/시간 순으로 정렬 (최신순)
  //     const sortedData = filteredData.sort((a, b) => {
  //       const dateTimeA = a.transactionDate + a.transactionTime;
  //       const dateTimeB = b.transactionDate + b.transactionTime;
  //       return dateTimeB.localeCompare(dateTimeA);
  //     });

  //     const response: AccountHistoryResponse = {
  //       totalCount: sortedData.length,
  //       transactionHistoryDtoList: sortedData
  //     };

  //     return {
  //       success: true,
  //       data: response
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       data: { totalCount: 0, transactionHistoryDtoList: [] },
  //       error: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다'
  //     };
  //   }
  // }
};