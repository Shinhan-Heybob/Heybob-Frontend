import { IconButton } from '@/src/shared/ui/molecules/IconButton';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface FeatureItem {
  id: string;
  label: string;
  icon: any;
  route: string;
}

// 기능 버튼 데이터 (피그마 순서대로)
const FEATURES: FeatureItem[] = [
  // 첫 번째 줄

  {
    id: 'meal-list',
    label: '채팅 목록',
    icon: require('@/assets/images/icons/meal-list.png'),
    route: '/chatlist',
  },
  {
    id: 'meal-create',
    label: '밥약 만들기',
    icon: require('@/assets/images/icons/meal-create.png'),
    route: '/meals/create',
  },
    {
    id: 'group-create',
    label: '모임 만들기',
    icon: require('@/assets/images/icons/group-create.png'),
    route: '/groups/create',
  },
  // {
  //   id: 'savings',
  //   label: '모임 적금',
  //   icon: require('@/assets/images/icons/group.png'), // savings.png가 없으면 group.png 사용
  //   route: '/savings',
  // },
  // 두 번째 줄
  {
    id: 'account',
    label: '계좌 내역',
    icon: require('@/assets/images/icons/account.png'),
    route: '/account',
  },
    {
    id: 'schedule',
    label: '시간표 확인',
    icon: require('@/assets/images/icons/schedule.png'),
    route: '/schedule',
  },
  // {
  //   id: 'settlement',
  //   label: '정산 목록',
  //   icon: require('@/assets/images/icons/settlement.png'),
  //   route: '/settlement',
  // },

  {
    id: 'settings',
    label: '마이페이지',
    icon: require('@/assets/images/icons/mypage.png'),
    route: '/mypage',
  },
];

export const FeatureGrid: React.FC = () => {
  const handleFeaturePress = (route: string) => {

    // 밥약 만들기, 모임 만들기, 채팅 목록은 실제 페이지로 이동
    if (route === '/meals/create' || route === '/groups/create') {
      router.push(route);
      return;
    }
    
    if (route === '/chatlist') {
      router.push(route);
      return;
    }
    
    if (route === '/schedule') {
      router.push('/timetable');
      return;
    }
    
    if (route === '/account') {
      router.push('/account-history');
      return;
    }

      if (route === '/mypage') {
      router.push('/mypage');
      return;
    }
    
    // 나머지는 임시로 알림만 표시 (실제 페이지들은 나중에 구현)
    console.log(`Navigate to: ${route}`);
    // router.push(route); // 페이지 구현 후 활성화
  };

  return (
    <View style={styles.container}>
      {/* 첫 번째 줄 */}
      <View style={styles.row}>
        {FEATURES.slice(0, 3).map((feature) => (
          <IconButton
            key={feature.id}
            icon={feature.icon}
            label={feature.label}
            onPress={() => handleFeaturePress(feature.route)}
            iconSize={40}
            style={styles.gridItem}
          />
        ))}
      </View>

      {/* 두 번째 줄 */}
      <View style={styles.row}>
        {FEATURES.slice(3, 6).map((feature) => (
          <IconButton
            key={feature.id}
            icon={feature.icon}
            label={feature.label}
            onPress={() => handleFeaturePress(feature.route)}
            iconSize={40}
            style={styles.gridItem}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});