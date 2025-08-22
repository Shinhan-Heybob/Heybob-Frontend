import { SCHOOLS } from '@/src/shared/data/schools';
import { LoginFormData } from '@/src/shared/types/auth';
import { Button, Dropdown, InputField, Text } from '@/src/shared/ui';
import { useAuthStore } from '@/src/store';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
export const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState<LoginFormData>({
    schoolId: '',
    studentId: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.schoolId) {
      newErrors.schoolId = '학교를 선택해주세요.';
    }
    if (!formData.studentId) {
      newErrors.studentId = '학번을 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 처리
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    clearError();
    await login(formData);
  };

  // 입력값 변경 처리
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 회원가입 페이지로 이동
  const navigateToSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 제목 */}
        <Text variant="title" style={styles.title}>
          로그인
        </Text>

        {/* 캐릭터 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/login-character.png')}
            style={styles.image}
            contentFit="contain"
          />
        </View>

        {/* 폼 */}
        <View style={styles.form}>
        {/* 학교 선택 */}
        <View>
          <Dropdown
            options={SCHOOLS}
            selectedValue={formData.schoolId}
            onSelect={(schoolId) => handleInputChange('schoolId', schoolId)}
            placeholder="학교 찾기"
          />
          {errors.schoolId && (
            <Text variant="caption" style={styles.errorText}>
              {errors.schoolId}
            </Text>
          )}
        </View>

        {/* 학번 입력 */}
        <InputField
          placeholder="학번 입력하기"
          value={formData.studentId}
          onChangeText={(value) => handleInputChange('studentId', value)}
          error={errors.studentId}
        />

        {/* 비밀번호 입력 */}
        <InputField
          placeholder="비밀번호 입력"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry={true}
          error={errors.password}
        />

        {/* 전체 에러 메시지 */}
        {error && (
          <Text variant="caption" style={styles.globalErrorText}>
            {error}
          </Text>
        )}

        {/* 회원가입 링크 */}
        <TouchableOpacity onPress={navigateToSignUp} style={styles.signUpLink}>
          <Text variant="link">회원가입 하기</Text>
        </TouchableOpacity>

        {/* 로그인 버튼 */}
        <Button
          title={isLoading ? '로그인 중...' : '로그인 하기'}
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.loginButton}
        />
        
      </View>

        {/* 더미 로그인 정보 안내 (개발용) */}
        {/* <View style={styles.debugInfo}>
          <Text variant="caption" style={styles.debugText}>
            개발용 테스트 계정
          </Text>
          <Text variant="caption" style={styles.debugText}>
            학번: test123 / 비밀번호: password
          </Text>
        </View> */}
        {/* </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    // paddingBottom: 40, // 하단 여백 추가
  },
  title: {
    textAlign: 'left',
    marginBottom: 32,
    fontSize: 17
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 320,
    height: 320,
  },
  form: {
    gap: 16,
  },
  signUpLink: {
    alignSelf: 'flex-end',
  },
  loginButton: {
    marginTop: 24,
  },
  debugInfo: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  debugText: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 4,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
  },
  globalErrorText: {
    color: '#EF4444',
    textAlign: 'center',
  },
});