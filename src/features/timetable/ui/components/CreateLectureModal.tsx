import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LectureCreateRequest } from '../../types';
import { DAYS_OF_WEEK } from '../../types';
import { validateLectureData } from '../../utils/validation';
import { useTimetableStore } from '../../model/timetableStore';

interface CreateLectureModalProps {
  visible: boolean;
  timetableId: number;
  onClose: () => void;
  onSubmit: (data: LectureCreateRequest) => void;
}

export const CreateLectureModal: React.FC<CreateLectureModalProps> = ({
  visible,
  timetableId,
  onClose,
  onSubmit,
}) => {
  const { currentTimetable } = useTimetableStore();
  const [formData, setFormData] = useState<LectureCreateRequest>({
    name: '',
    subjectCode: '',
    dayOfWeek: '월',
    startTime: '',
    endTime: '',
    classroom: '',
    professor: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const existingLectures = currentTimetable?.lectures || [];
    const validation = validateLectureData(formData, existingLectures);
    
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      subjectCode: '',
      dayOfWeek: '월',
      startTime: '',
      endTime: '',
      classroom: '',
      professor: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleInputChange = (field: keyof LectureCreateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>새 강의 추가</Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* 강의명 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>강의명 *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="예: 데이터구조"
                placeholderTextColor="#9CA3AF"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* 과목코드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>과목코드 *</Text>
              <TextInput
                style={[styles.input, errors.subjectCode && styles.inputError]}
                value={formData.subjectCode}
                onChangeText={(value) => handleInputChange('subjectCode', value)}
                placeholder="예: CS101"
                placeholderTextColor="#9CA3AF"
              />
              {errors.subjectCode && <Text style={styles.errorText}>{errors.subjectCode}</Text>}
            </View>

            {/* 요일 선택 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>요일 *</Text>
              <View style={styles.daySelector}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day.day}
                    style={[
                      styles.dayButton,
                      formData.dayOfWeek === day.dayKor && styles.dayButtonSelected
                    ]}
                    onPress={() => handleInputChange('dayOfWeek', day.dayKor)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      formData.dayOfWeek === day.dayKor && styles.dayButtonTextSelected
                    ]}>
                      {day.dayKor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 시간 */}
            <View style={styles.timeRow}>
              <View style={[styles.inputGroup, styles.timeInput]}>
                <Text style={styles.label}>시작시간 *</Text>
                <TextInput
                  style={[styles.input, errors.startTime && styles.inputError]}
                  value={formData.startTime}
                  onChangeText={(value) => handleInputChange('startTime', value)}
                  placeholder="09:00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}
              </View>
              
              <View style={[styles.inputGroup, styles.timeInput]}>
                <Text style={styles.label}>종료시간 *</Text>
                <TextInput
                  style={[styles.input, errors.endTime && styles.inputError]}
                  value={formData.endTime}
                  onChangeText={(value) => handleInputChange('endTime', value)}
                  placeholder="10:30"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
              </View>
            </View>

            {/* 시간 중복 에러 표시 */}
            {errors.timeConflict && (
              <View style={styles.timeConflictContainer}>
                <Text style={styles.timeConflictText}>{errors.timeConflict}</Text>
              </View>
            )}

            {/* 강의실 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>강의실 *</Text>
              <TextInput
                style={[styles.input, errors.classroom && styles.inputError]}
                value={formData.classroom}
                onChangeText={(value) => handleInputChange('classroom', value)}
                placeholder="예: 공학관 301호"
                placeholderTextColor="#9CA3AF"
              />
              {errors.classroom && <Text style={styles.errorText}>{errors.classroom}</Text>}
            </View>

            {/* 교수명 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>교수명 *</Text>
              <TextInput
                style={[styles.input, errors.professor && styles.inputError]}
                value={formData.professor}
                onChangeText={(value) => handleInputChange('professor', value)}
                placeholder="예: 김교수"
                placeholderTextColor="#9CA3AF"
              />
              {errors.professor && <Text style={styles.errorText}>{errors.professor}</Text>}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dayButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 0.48,
    marginBottom: 20,
  },
  timeConflictContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  timeConflictText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
});