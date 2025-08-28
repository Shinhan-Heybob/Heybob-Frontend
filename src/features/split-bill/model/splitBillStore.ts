import { create } from 'zustand';
import {
  splitBillApi,
  type SettlementPageResponseDto,
  type SettlementResponseDto,
} from '../api/splitBillApi';

export interface SplitBillFriend {
  id: string;
  name: string;
  studentId: string;
  department: string;
  avatarId: string;
}

interface SplitBillState {
  // UI 상태
  selectedFriendIds: string[];  // UI 상 문자열 ID
  totalAmount: string;          // 콤마 포함 입력 문자열
  isLoading: boolean;
  error: string | null;

  // 서버 데이터 캐시
  settlementInfo: SettlementResponseDto | null;
  pageData: SettlementPageResponseDto | null;
  
  // 추가 UI 상태
  isPaymentModalOpen: boolean;
  paymentStep: 'input' | 'confirm' | 'processing' | 'completed';
}

interface SplitBillActions {
  // 친구 선택
  toggleFriend: (friendId: string) => void;
  clearFriends: () => void;
  setSelectedFriends: (friendIds: string[]) => void;

  // 금액 입력 (콤마 포맷팅 포함)
  setTotalAmount: (amount: string) => void;

  // 🔥 핵심 API 액션들
  sendPaymentRequest: (roomId: string, description?: string) => Promise<void>;
  updatePaymentRequest: (roomId: string) => Promise<void>;
  fetchSettlementInfo: (roomId: string) => Promise<void>;
  payMyShare: (roomId: string) => Promise<void>;
  fetchSettlementPage: (roomId: string) => Promise<void>;

  // UI 상태 관리
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  setPaymentStep: (step: 'input' | 'confirm' | 'processing' | 'completed') => void;

  // 상태 유틸
  reset: () => void;
  clearError: () => void;
  setError: (error: string) => void;

  // 계산된 값들 (getter 스타일)
  getSelectedFriendsCount: () => number;
  getTotalAmountNumber: () => number;
  getPerPersonAmount: () => number;
  isValidForSubmit: () => boolean;
}

type SplitBillStore = SplitBillState & SplitBillActions;

/** 숫자 콤마 제거 후 정수 반환 */
const parseAmount = (amount: string): number => {
  const digits = (amount || '').replace(/[^\d]/g, '');
  if (!digits) return 0;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
};

/** 문자열 배열 → 숫자 배열 (유효한 숫자만) */
const toUserIdNumbers = (ids: string[]): number[] =>
  ids
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n)) as number[];

export const useSplitBillStore = create<SplitBillStore>((set, get) => ({
  // 🏁 초기 상태
  selectedFriendIds: [],
  totalAmount: '',
  isLoading: false,
  error: null,
  settlementInfo: null,
  pageData: null,
  isPaymentModalOpen: false,
  paymentStep: 'input',

  // 👥 친구 선택 관련
  toggleFriend: (friendId: string) => {
    const { selectedFriendIds } = get();
    if (selectedFriendIds.includes(friendId)) {
      set({ selectedFriendIds: selectedFriendIds.filter((id) => id !== friendId) });
    } else {
      set({ selectedFriendIds: [...selectedFriendIds, friendId] });
    }
  },

  clearFriends: () => set({ selectedFriendIds: [] }),

  setSelectedFriends: (friendIds: string[]) => set({ selectedFriendIds: friendIds }),

  // 💰 금액 입력 (천단위 콤마 포맷팅)
  setTotalAmount: (amount: string) => {
    const digits = (amount || '').replace(/[^\d]/g, '');
    if (!digits) {
      set({ totalAmount: '' });
      return;
    }
    set({ totalAmount: Number.parseInt(digits, 10).toLocaleString() });
  },

  // 🚀 정산 생성 API (POST /settle/{chatRoomId}/create) - 8081 → 8080 포트
  sendPaymentRequest: async (roomId: string, _description = '1/N 정산') => {
    const { selectedFriendIds, totalAmount } = get();

    const participantsUserIds = toUserIdNumbers(selectedFriendIds);
    if (participantsUserIds.length === 0) {
      set({ error: '정산할 친구를 선택해주세요.' });
      return;
    }

    const amount = parseAmount(totalAmount);
    if (amount <= 0) {
      set({ error: '정산 금액을 입력해주세요.' });
      return;
    }

    set({ isLoading: true, error: null, paymentStep: 'processing' });
    
    try {
      console.log('🚀 정산 요청 전송 시작 (8081 → 8080):', {
        roomId,
        amount,
        participantsUserIds,
        totalParticipants: participantsUserIds.length + 1 // 본인 포함
      });

      const result = await splitBillApi.createSettlement(roomId, {
        totalAmount: amount,
        participantsUserIds,
      });

      console.log('✅ 정산 요청 성공 (8080 응답):', result);

      set({ 
        isLoading: false, 
        paymentStep: 'completed'
      });

      // 정산 정보 새로고침
      await get().fetchSettlementInfo(roomId);
      
    } catch (e: any) {
      console.error('❌ 정산 요청 실패:', e);
      set({
        error: e?.message || '정산 요청 전송에 실패했습니다',
        isLoading: false,
        paymentStep: 'input'
      });
    }
  },

  // 📝 정산 수정 API (PATCH /settle/{chatRoomId}/update) - 8080 → 8080 포트
  updatePaymentRequest: async (roomId: string) => {
    const { selectedFriendIds, totalAmount } = get();

    const participantsUserIds = toUserIdNumbers(selectedFriendIds);
    if (participantsUserIds.length === 0) {
      set({ error: '수정할 친구 선택이 비어 있습니다.' });
      return;
    }

    const amount = parseAmount(totalAmount);
    if (amount <= 0) {
      set({ error: '수정할 정산 금액을 입력해주세요.' });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      console.log('📝 정산 수정 요청 (8080 → 8080):', { roomId, amount, participantsUserIds });
      
      await splitBillApi.updateSettlement(roomId, {
        totalAmount: amount,
        participantsUserIds,
      });
      
      console.log('✅ 정산 수정 성공 (8080 응답)');
      set({ isLoading: false });
      
      // 정산 정보 새로고침
      await get().fetchSettlementInfo(roomId);
      
    } catch (e: any) {
      console.error('❌ 정산 수정 실패:', e);
      set({
        error: e?.message || '정산 수정에 실패했습니다.',
        isLoading: false,
      });
    }
  },

  // 📊 정산 정보 조회 API (GET /settle/{chatRoomId}/info) - 8080 → 8080 포트
  fetchSettlementInfo: async (roomId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('📊 정산 정보 조회 (8080 → 8080):', roomId);
      
      const info = await splitBillApi.getSettlementInfo(roomId);
      
      console.log('✅ 정산 정보 조회 성공 (8080 응답):', info);
      set({ 
        settlementInfo: info, 
        isLoading: false 
      });
      
    } catch (e: any) {
      console.error('❌ 정산 정보 조회 실패:', e);
      set({
        error: e?.message || '정산 정보를 불러오지 못했습니다.',
        settlementInfo: null,
        isLoading: false,
      });
    }
  },

  // 💳 내 분담금 결제 API (POST /settle/{chatRoomId}/pay) - 8080 → 8080 포트
  payMyShare: async (roomId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('💳 분담금 결제 시작 (8080 → 8080):', roomId);
      
      await splitBillApi.paySettlement(roomId);
      
      console.log('✅ 분담금 결제 성공 (8080 응답)');
      set({ isLoading: false });
      
      // 정산 정보 새로고침
      await get().fetchSettlementInfo(roomId);
      
    } catch (e: any) {
      console.error('❌ 분담금 결제 실패:', e);
      set({
        error: e?.message || '결제 처리에 실패했습니다.',
        isLoading: false,
      });
    }
  },

  // 📄 페이지 데이터 조회 API (GET /settle/{chatRoomId}/page) - 8080 → 8080 포트
  fetchSettlementPage: async (roomId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('📄 페이지 데이터 조회 (8080 → 8080):', roomId);
      
      const page = await splitBillApi.getSettlementPage(roomId);
      
      console.log('✅ 페이지 데이터 조회 성공 (8080 응답):', page);
      set({ 
        pageData: page, 
        isLoading: false 
      });
      
    } catch (e: any) {
      console.error('❌ 페이지 데이터 조회 실패:', e);
      set({
        error: e?.message || '페이지 정보를 불러오지 못했습니다.',
        pageData: null,
        isLoading: false,
      });
    }
  },

  // 🎛️ UI 상태 관리
  openPaymentModal: () => set({ isPaymentModalOpen: true, paymentStep: 'input' }),
  closePaymentModal: () => set({ isPaymentModalOpen: false, paymentStep: 'input' }),
  setPaymentStep: (step) => set({ paymentStep: step }),

  // 🔄 상태 관리
  reset: () =>
    set({
      selectedFriendIds: [],
      totalAmount: '',
      isLoading: false,
      error: null,
      settlementInfo: null,
      pageData: null,
      isPaymentModalOpen: false,
      paymentStep: 'input',
    }),

  clearError: () => set({ error: null }),
  setError: (error: string) => set({ error }),

  // 📊 계산된 값들 (getter 스타일)
  getSelectedFriendsCount: () => {
    const { selectedFriendIds } = get();
    return selectedFriendIds.length;
  },

  getTotalAmountNumber: () => {
    const { totalAmount } = get();
    return parseAmount(totalAmount);
  },

  getPerPersonAmount: () => {
    const { selectedFriendIds, totalAmount } = get();
    const total = parseAmount(totalAmount);
    const totalParticipants = selectedFriendIds.length + 1; // 본인 포함
    
    if (totalParticipants === 0) return 0;
    return Math.floor(total / totalParticipants);
  },

  isValidForSubmit: () => {
    const { selectedFriendIds, totalAmount } = get();
    return selectedFriendIds.length > 0 && parseAmount(totalAmount) > 0;
  },
}));

// 🎯 사용 예시를 위한 헬퍼 훅들
export const useSplitBillActions = () => {
  const store = useSplitBillStore();
  return {
    // 자주 사용되는 액션들만 노출
    sendPaymentRequest: store.sendPaymentRequest,
    payMyShare: store.payMyShare,
    fetchSettlementInfo: store.fetchSettlementInfo,
    toggleFriend: store.toggleFriend,
    setTotalAmount: store.setTotalAmount,
    reset: store.reset,
  };
};

export const useSplitBillState = () => {
  const store = useSplitBillStore();
  return {
    // 읽기 전용 상태들
    selectedFriends: store.selectedFriendIds,
    totalAmount: store.totalAmount,
    isLoading: store.isLoading,
    error: store.error,
    settlementInfo: store.settlementInfo,
    pageData: store.pageData,
    perPersonAmount: store.getPerPersonAmount(),
    isValid: store.isValidForSubmit(),
  };
};