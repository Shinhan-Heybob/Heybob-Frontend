import { getRandomAvatarId } from '@/src/shared/data/avatars';
import { getDepartmentsBySchool } from '@/src/shared/data/departments';
import { SCHOOLS } from '@/src/shared/data/schools';
import { SignUpFormData } from '@/src/shared/types/auth';
import { AvatarSelector, Button, CheckBox, Dropdown, InputField, Text } from '@/src/shared/ui';
import { useAuthStore } from '@/src/store';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

export const SignUpForm: React.FC = () => {
  const { signUp, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    schoolId: '',
    departmentId: '',
    studentId: '',
    name: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    avatarId: getRandomAvatarId(), // 초기 랜덤 아바타
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [agreeTermsError, setAgreeTermsError] = useState<string>('');

  // 학교 선택 시 학과 목록 리셋
  useEffect(() => {
    if (formData.schoolId) {
      setFormData(prev => ({ ...prev, departmentId: '' }));
      // 학과 에러도 제거
      if (errors.departmentId) {
        setErrors(prev => ({ ...prev, departmentId: '' }));
      }
    }
  }, [formData.schoolId]);

  // 현재 선택된 학교의 학과 목록
  const availableDepartments = formData.schoolId 
    ? getDepartmentsBySchool(formData.schoolId) 
    : [];

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.schoolId) {
      newErrors.schoolId = '학교를 선택해주세요.';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = '학과를 선택해주세요.';
    }
    if (!formData.studentId) {
      newErrors.studentId = '학번을 입력해주세요.';
    }
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (!formData.agreeTerms) {
      setAgreeTermsError('약관에 동의해주세요.');
      setErrors(newErrors);
      return false;
    } else {
      setAgreeTermsError('');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 처리
  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    clearError();
    await signUp(formData);
  };

  // 입력값 변경 처리
  const handleInputChange = (field: keyof SignUpFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // 약관 동의 에러 제거
    if (field === 'agreeTerms' && value === true) {
      setAgreeTermsError('');
    }
  };

  // 아바타 변경 처리
  const handleAvatarChange = (avatarId: string) => {
    setFormData(prev => ({ ...prev, avatarId }));
  };

  // 로그인 페이지로 이동
  const navigateToSignIn = () => {
    router.push('/(auth)/sign-in');
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
          회원가입
        </Text>

        {/* 아바타 선택 */}
        <AvatarSelector
          selectedAvatarId={formData.avatarId}
          onAvatarChange={handleAvatarChange}
          style={styles.avatarSelector}
        />

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

          {/* 학과 선택 */}
          <View>
            <Dropdown
              options={availableDepartments}
              selectedValue={formData.departmentId}
              onSelect={(departmentId) => handleInputChange('departmentId', departmentId)}
              placeholder="학과 찾기"
              disabled={!formData.schoolId}
              disabledMessage="먼저 학교를 선택해주세요."
            />
            {errors.departmentId && (
              <Text variant="caption" style={styles.errorText}>
                {errors.departmentId}
              </Text>
            )}
          </View>

          {/* 그룹 2: 개인정보 (학교 선택 후 등장) */}
          {formData.schoolId && (
            <Animated.View entering={SlideInDown.duration(400)} style={styles.animatedSection}>
              {/* 학번 입력 */}
              <InputField
                placeholder="학번 입력하기"
                value={formData.studentId}
                onChangeText={(value) => handleInputChange('studentId', value)}
                error={errors.studentId}
              />

              {/* 이름 입력 */}
              <InputField
                placeholder="이름 입력하기"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                error={errors.name}
              />
            </Animated.View>
          )}

          {/* 그룹 3: 보안설정 (개인정보 입력 후 등장) */}
          {formData.studentId && formData.name && (
            <Animated.View entering={SlideInDown.duration(400)} style={styles.animatedSection}>
              {/* 비밀번호 입력 */}
              <InputField
                placeholder="비밀번호 입력"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={true}
                error={errors.password}
              />

              {/* 비밀번호 확인 입력 */}
              <InputField
                placeholder="비밀번호 확인하기"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={true}
                error={errors.confirmPassword}
              />

              {/* 약관 동의 */}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={formData.agreeTerms}
                  onPress={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
                  label="[필수] 이용약관 및 개인정보처리방침에 동의합니다."
                />
                {agreeTermsError && (
                  <Text variant="caption" style={styles.errorText}>
                    {agreeTermsError}
                  </Text>
                )}
              </View>

              {/* 전체 에러 메시지 */}
              {error && (
                <Text variant="caption" style={styles.globalErrorText}>
                  {error}
                </Text>
              )}

              {/* 회원가입 버튼 */}
              <Button
                title={isLoading ? '회원가입 중...' : '회원가입 하기'}
                onPress={handleSignUp}
                disabled={isLoading}
                style={styles.signUpButton}
              />
            </Animated.View>
          )}

          {/* 로그인 링크 - 맨 마지막 (항상 표시) */}
          <TouchableOpacity onPress={navigateToSignIn} style={styles.signInLink}>
            <Text variant="body" style={styles.signInLinkText}>이미 계정이 있으신가요? 로그인하기</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  title: {
    textAlign: 'left',
    marginBottom: 15,
    fontSize: 17,
  },
  avatarSelector: {
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  animatedSection: {
    gap: 16,
  },
  checkboxContainer: {
    marginTop: 8,
  },
  signInLink: {
    alignSelf: 'center',
  },
  signInLinkText: {
    color: '#B8B8B8',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#B8B8B8',
    // paddingBottom: 2,
  },
  signUpButton: {
    marginTop: 16,
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