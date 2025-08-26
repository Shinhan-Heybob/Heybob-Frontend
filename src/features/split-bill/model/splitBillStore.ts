import { create } from 'zustand';

export interface SplitBillFriend {
  id: string;
  name: string;
  studentId: string;
  department: string;
  avatarId: string;
}

interface SplitBillState {
  // 선택된 친구들 ID 목록
  selectedFriendIds: string[];
  
  // 정산 금액
  totalAmount: string;
  
  // 로딩 상태
  isLoading: boolean;
  
  // 에러 상태
  error: string | null;
}

interface SplitBillActions {
  // 친구 추가/제거
  toggleFriend: (friendId: string) => void;
  clearFriends: () => void;
  
  // 금액 설정 (콤마 포맷팅 포함)
  setTotalAmount: (amount: string) => void;
  
  // 정산 요청 전송
  sendPaymentRequest: (roomId: string, description?: string) => Promise<void>;
  
  // 초기화
  reset: () => void;
  
  // 에러 처리
  clearError: () => void;
  setError: (error: string) => void;
}

type SplitBillStore = SplitBillState & SplitBillActions;

export const useSplitBillStore = create<SplitBillStore>((set, get) => ({
  // 초기 상태
  selectedFriendIds: [],
  totalAmount: '',
  isLoading: false,
  error: null,

  // 친구 토글 (추가/제거)
  toggleFriend: (friendId: string) => {
    const { selectedFriendIds } = get();
    
    if (selectedFriendIds.includes(friendId)) {
      // 제거
      set({ selectedFriendIds: selectedFriendIds.filter(id => id !== friendId) });
    } else {
      // 추가
      set({ selectedFriendIds: [...selectedFriendIds, friendId] });
    }
  },

  // 친구 목록 초기화
  clearFriends: () => {
    set({ selectedFriendIds: [] });
  },

  // 금액 설정 (천 단위 콤마 포맷팅)
  setTotalAmount: (amount: string) => {
    // 숫자만 추출
    const numericValue = amount.replace(/[^0-9]/g, '');
    
    // 빈 문자열이면 그대로 저장
    if (!numericValue) {
      set({ totalAmount: '' });
      return;
    }
    
    // 천 단위 콤마 추가
    const formattedAmount = parseInt(numericValue).toLocaleString();
    set({ totalAmount: formattedAmount });
  },

  // 정산 요청 전송
  sendPaymentRequest: async (roomId: string, description = '1/N 정산') => {
    const { selectedFriendIds, totalAmount } = get();
    
    // 유효성 검사
    if (selectedFriendIds.length === 0) {
      set({ error: '정산할 친구를 선택해주세요.' });
      return;
    }
    
    const amount = parseInt(totalAmount.replace(/,/g, ''));
    if (!amount || amount <= 0) {
      set({ error: '정산 금액을 입력해주세요.' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // TODO: 실제 API 엔드포인트로 교체
      const paymentRequestData = {
        messageType: 'PAYMENT_REQUEST',
        roomId: roomId,
        requestAmount: amount,
        participants: selectedFriendIds,
        description: description,
        createdAt: new Date().toISOString(),
      };
      
      // 실제 구현:
      // const response = await fetch('/api/payments/request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentRequestData)
      // });
      
      // 임시: 성공으로 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Payment request sent:', paymentRequestData);
      
      set({ isLoading: false });
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '정산 요청 전송에 실패했습니다',
        isLoading: false 
      });
    }
  },

  // 전체 초기화
  reset: () => {
    set({
      selectedFriendIds: [],
      totalAmount: '',
      isLoading: false,
      error: null,
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },

  // 에러 설정
  setError: (error: string) => {
    set({ error });
  },
}));