export interface Avatar {
  id: string;
  name: string;
  image: any; // require() 타입
}

export const AVATARS: Avatar[] = [
  {
    id: 'avatar_01',
    name: '기본 캐릭터',
    image: require('@/assets/images/login-character.png'), // 기존 로그인 캐릭터 재사용
  },
  // 추가 아바타들은 나중에 이미지 파일이 있을 때 추가
  // {
  //   id: 'avatar_02',
  //   name: '메가네 캐릭터',
  //   image: require('@/assets/images/avatars/character2.png'),
  // },
  // {
  //   id: 'avatar_03', 
  //   name: '모자 캐릭터',
  //   image: require('@/assets/images/avatars/character3.png'),
  // },
];

// 아바타 ID로 이미지 찾기
export const getAvatarById = (avatarId: string): any => {
  const avatar = AVATARS.find(avatar => avatar.id === avatarId);
  return avatar?.image || AVATARS[0].image; // 기본값 반환
};

// 랜덤 아바타 ID 생성
export const getRandomAvatarId = (): string => {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex].id;
};

// 현재 사용 가능한 아바타 ID 목록
export const getAvailableAvatarIds = (): string[] => {
  return AVATARS.map(avatar => avatar.id);
};