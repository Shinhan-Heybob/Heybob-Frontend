import { Text } from '@/src/shared/ui';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text as RNText, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTimetableStore } from '../../model/timetableStore';
import { Lecture, LectureCreateRequest, LectureUpdateRequest } from '../../types';
import { CreateLectureModal } from '../components/CreateLectureModal';
import { EditLectureModal } from '../components/EditLectureModal';
import { LectureDetailModal } from '../components/LectureDetailModal';
import { TimetableGrid } from '../components/TimetableGrid';

export const TimetableDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const timetableId = id ? parseInt(id) : 1; // 기본값을 1로 설정

  const {
    currentTimetable,
    isLoadingCurrent,
    isCreatingLecture,
    isUpdatingLecture,
    error,
    fetchCurrentTimetable,
    createLecture,
    updateLecture,
    clearError,
  } = useTimetableStore();

  const [showCreateLectureModal, setShowCreateLectureModal] = useState(false);
  const [showEditLectureModal, setShowEditLectureModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    if (timetableId) {
      fetchCurrentTimetable(timetableId);
    }
  }, [timetableId]);

  // EditLectureModal을 열기 위한 글로벌 함수 설정
  useEffect(() => {
    (global as any).openEditLectureModal = (lecture: Lecture) => {
      setEditingLecture(lecture);
      setShowEditLectureModal(true);
    };

    return () => {
      delete (global as any).openEditLectureModal;
    };
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('오류', error, [
        { text: '확인', onPress: clearError }
      ]);
    }
  }, [error]);

  const handleBackPress = () => {
    router.back();
  };

  const handleCreateLecture = async (data: LectureCreateRequest) => {
    const success = await createLecture(timetableId, data);
    if (success) {
      setShowCreateLectureModal(false);
      Alert.alert('성공', '강의가 성공적으로 추가되었습니다.');
    }
  };

  const handleEditLecture = async (lectureId: number, data: LectureUpdateRequest) => {
    const success = await updateLecture(lectureId, data);
    if (success) {
      setShowEditLectureModal(false);
      setEditingLecture(null);
      Alert.alert('성공', '강의가 성공적으로 수정되었습니다.');
    }
  };

  if (isLoadingCurrent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>시간표를 불러오는 중...</Text>
      </View>
    );
  }

  if (!currentTimetable) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>시간표를 찾을 수 없습니다</Text>
        <Text style={styles.errorSubtitle}>시간표 정보를 불러올 수 없습니다</Text>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>목록으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 고정 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <RNText style={styles.backButtonText}>‹</RNText>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text variant="title" style={styles.headerTitle}>{currentTimetable.timeTableName}</Text>
          <Text variant="body" style={styles.headerSubtitle}>
            총 {currentTimetable.lectures.length}개 강의
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateLectureModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 시간표 그리드 */}
      <View style={styles.gridContainer}>
        {currentTimetable.lectures.length > 0 ? (
          <TimetableGrid lectures={currentTimetable.lectures} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="body" style={styles.emptyTitle}>등록된 강의가 없습니다</Text>
            <Text variant="body" style={styles.emptySubtitle}>
              + 버튼을 눌러 강의를 추가해보세요
            </Text>
          </View>
        )}
      </View>

      {/* 강의 상세 모달 */}
      <LectureDetailModal />

      {/* 강의 생성 모달 */}
      <CreateLectureModal
        visible={showCreateLectureModal}
        timetableId={timetableId}
        onClose={() => setShowCreateLectureModal(false)}
        onSubmit={handleCreateLecture}
      />

      {/* 강의 수정 모달 */}
      <EditLectureModal
        visible={showEditLectureModal}
        lecture={editingLecture}
        onClose={() => {
          setShowEditLectureModal(false);
          setEditingLecture(null);
        }}
        onSubmit={handleEditLecture}
      />

      {/* 강의 생성 로딩 오버레이 */}
      {isCreatingLecture && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.loadingOverlayText}>강의 추가 중...</Text>
          </View>
        </View>
      )}

      {/* 강의 수정 로딩 오버레이 */}
      {isUpdatingLecture && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.loadingOverlayText}>강의 수정 중...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  // backButton: {
  //   width: 40,
  //   height: 40,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // backButtonText: {
  //   fontSize: 24,
  //   color: '#374151',
  //   fontWeight: '300',
  // },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#787FEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
  },
  gridContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F9FAFB',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#615d5dff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  loadingOverlayText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
});