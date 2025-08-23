export interface Department {
  id: string;
  name: string;
  schoolId: string; // 어느 학교에 속하는지
}

export const DEPARTMENTS: Department[] = [
  // 한빛대학교
  { id: 'dept_01', name: '컴퓨터공학과', schoolId: '1' },
  { id: 'dept_02', name: '전자공학과', schoolId: '1' },
  { id: 'dept_03', name: '경영학과', schoolId: '1' },
  { id: 'dept_04', name: '경제학과', schoolId: '1' },
  { id: 'dept_05', name: '심리학과', schoolId: '1' },
  
  // 참나무대학교
  { id: 'dept_06', name: '소프트웨어학과', schoolId: '2' },
  { id: 'dept_07', name: '디자인학과', schoolId: '2' },
  { id: 'dept_08', name: '건축학과', schoolId: '2' },
  { id: 'dept_09', name: '기계공학과', schoolId: '2' },
  { id: 'dept_10', name: '화학공학과', schoolId: '2' },
  
  // 새싹대학교
  { id: 'dept_11', name: '데이터사이언스학과', schoolId: '3' },
  { id: 'dept_12', name: '인공지능학과', schoolId: '3' },
  { id: 'dept_13', name: '바이오공학과', schoolId: '3' },
  { id: 'dept_14', name: '환경공학과', schoolId: '3' },
  { id: 'dept_15', name: '국어국문학과', schoolId: '3' },
  
  // 푸른하늘대학교
  { id: 'dept_16', name: '항공우주공학과', schoolId: '4' },
  { id: 'dept_17', name: '물리학과', schoolId: '4' },
  { id: 'dept_18', name: '수학과', schoolId: '4' },
  { id: 'dept_19', name: '통계학과', schoolId: '4' },
  { id: 'dept_20', name: '영어영문학과', schoolId: '4' },
  
  // 희망대학교
  { id: 'dept_21', name: '사회복지학과', schoolId: '5' },
  { id: 'dept_22', name: '간호학과', schoolId: '5' },
  { id: 'dept_23', name: '의학과', schoolId: '5' },
  { id: 'dept_24', name: '치의학과', schoolId: '5' },
  { id: 'dept_25', name: '약학과', schoolId: '5' },
  
  // 별빛대학교
  { id: 'dept_26', name: '천문학과', schoolId: '6' },
  { id: 'dept_27', name: '지질학과', schoolId: '6' },
  { id: 'dept_28', name: '생물학과', schoolId: '6' },
  { id: 'dept_29', name: '지리학과', schoolId: '6' },
  { id: 'dept_30', name: '역사학과', schoolId: '6' },
  
  // 무지개대학교
  { id: 'dept_31', name: '미술학과', schoolId: '7' },
  { id: 'dept_32', name: '음악학과', schoolId: '7' },
  { id: 'dept_33', name: '연극영화학과', schoolId: '7' },
  { id: 'dept_34', name: '체육학과', schoolId: '7' },
  { id: 'dept_35', name: '무용학과', schoolId: '7' },
  
  // 햇살대학교
  { id: 'dept_36', name: '식품영양학과', schoolId: '8' },
  { id: 'dept_37', name: '의류학과', schoolId: '8' },
  { id: 'dept_38', name: '호텔경영학과', schoolId: '8' },
  { id: 'dept_39', name: '관광학과', schoolId: '8' },
  { id: 'dept_40', name: '조리학과', schoolId: '8' },
  
  // 바다대학교
  { id: 'dept_41', name: '해양학과', schoolId: '9' },
  { id: 'dept_42', name: '수산학과', schoolId: '9' },
  { id: 'dept_43', name: '선박공학과', schoolId: '9' },
  { id: 'dept_44', name: '항만물류학과', schoolId: '9' },
  { id: 'dept_45', name: '해양생물학과', schoolId: '9' },
  
  // 산들대학교
  { id: 'dept_46', name: '산림학과', schoolId: '10' },
  { id: 'dept_47', name: '원예학과', schoolId: '10' },
  { id: 'dept_48', name: '농업경제학과', schoolId: '10' },
  { id: 'dept_49', name: '동물자원학과', schoolId: '10' },
  { id: 'dept_50', name: '식물자원학과', schoolId: '10' },
  
  // SSAFY
  { id: 'dept_51', name: '웹 기술 트랙', schoolId: '11' },
  { id: 'dept_52', name: '모바일 트랙', schoolId: '11' },
  { id: 'dept_53', name: '임베디드 트랙', schoolId: '11' },
  { id: 'dept_54', name: 'AI 트랙', schoolId: '11' },
  { id: 'dept_55', name: '블록체인 트랙', schoolId: '11' },
];

// 특정 학교의 학과만 필터링하는 헬퍼 함수
export const getDepartmentsBySchool = (schoolId: string): Department[] => {
  return DEPARTMENTS.filter(dept => dept.schoolId === schoolId);
};