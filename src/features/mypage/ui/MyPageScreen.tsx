import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MyPageHeader } from './components/MyPageHeader';
import { ProfileSection } from './components/ProfileSection';
import { StudentCardSection } from './components/StudentCardSection';
import { WalletSection } from './components/WalletSection';
import { AccountHistorySection } from './components/AccountHistorySection';

export const MyPageScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  // 화면 높이에서 하단 탭바 높이(83px)를 뺀 사용 가능한 높이 계산
  const screenHeight = Dimensions.get('window').height;
  const tabBarHeight = 83;
  const availableHeight = screenHeight - tabBarHeight;

  return (
    <View style={[styles.container, { height: availableHeight }]}>
      {/* 헤더 */}
      <MyPageHeader />

      {/* 스크롤 영역 */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(20, insets.bottom) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 개인 프로필 섹션 */}
        <ProfileSection />

        {/* 학생증 섹션 */}
        <StudentCardSection />

        {/* 지갑 섹션 */}
        <WalletSection />

        {/* 계좌 내역 섹션 */}
        <AccountHistorySection />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
});