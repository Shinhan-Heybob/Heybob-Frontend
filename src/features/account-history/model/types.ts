// 거래 내역 API 요청 타입
export interface AccountHistoryRequest {
  startDate: string;  // YYYYMMDD 형식
  endDate: string;    // YYYYMMDD 형식
}

// 거래 내역 개별 아이템 타입
export interface TransactionHistoryDto {
  transactorName: string;           // 거래 상대방 이름
  transactionUniqueNo: string;      // 거래 고유 번호
  transactionDate: string;          // 거래 날짜 (YYYYMMDD)
  transactionTime: string;          // 거래 시간 (HHMMSS)
  transactionTypeName: string;      // 거래 유형 ("입금(이체)", "출금(이체)" 등)
  transactionBalance: string;       // 거래 금액
  transactionAfterBalance: string;  // 거래 후 잔액
  eventTitle?: string;              // 관련 이벤트 제목 (밥약/모임)
}

// 거래 내역 API 응답 타입
export interface AccountHistoryResponse {
  totalCount: number;
  transactionHistoryDtoList: TransactionHistoryDto[];
}

// 날짜 범위 타입
export interface DateRange {
  startDate: string;  // YYYYMMDD
  endDate: string;    // YYYYMMDD
}

// 포맷팅된 거래 정보 (화면 표시용)
export interface FormattedTransaction extends TransactionHistoryDto {
  isDeposit: boolean;        // 입금 여부
  formattedAmount: string;   // +/- 포함된 금액 표시
  formattedDate: string;     // MM월 DD일 형식
  formattedTime: string;     // HH:MM 형식
}

// 날짜별 그룹핑된 섹션 데이터
export interface DateSection {
  title: string;                    // "2024년 08월 27일"
  data: FormattedTransaction[];     // 해당 날짜의 거래 내역들
}