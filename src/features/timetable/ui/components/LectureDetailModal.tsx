import React, { useState } from 'react';
import { 
  View, 
  Text as RNText, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Text } from '@/src/shared/ui';
import { Lecture } from '../../types';
import { useTimetableStore } from '../../model/timetableStore';

export const LectureDetailModal: React.FC = () => {
  const { 
    selectedLecture, 
    setSelectedLecture, 
    deleteLecture, 
    isDeletingLecture,
    error 
  } = useTimetableStore();
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setSelectedLecture(null);
  };

  const handleDeleteLecture = () => {
    if (!selectedLecture) return;

    Alert.alert(
      '강의 삭제',
      `'${selectedLecture.lectureName}' 강의를 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            const success = await deleteLecture(selectedLecture.lectureId);
            setIsDeleting(false);
            
            if (success) {
              Alert.alert('성공', '강의가 삭제되었습니다.', [
                { text: '확인', onPress: handleClose }
              ]);
            } else {
              Alert.alert('오류', error || '강의 삭제 중 오류가 발생했습니다.');
            }
          }
        }
      ]
    );
  };

  if (!selectedLecture) {
    return null;
  }

  return (
    <Modal
      visible={!!selectedLecture}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              {/* 헤더 */}
              <View style={styles.modalHeader}>
                <Text variant="title" style={styles.modalTitle}>강의 정보</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                  <RNText style={styles.closeButtonText}>✕</RNText>
                </TouchableOpacity>
              </View>

              {/* 강의 정보 */}
              <View style={styles.contentContainer}>
                {/* 강의명 - 메인 정보 */}
                <View style={styles.mainInfoContainer}>
                  <Text variant="title" style={styles.lectureTitle}>{selectedLecture.lectureName}</Text>
                  <Text variant="caption" style={styles.subjectCode}>{selectedLecture.subjectCode}</Text>
                </View>

                {/* 세부 정보 카드들 */}
                <View style={styles.detailCards}>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoEmoji}>👨‍🏫</Text>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardLabel}>교수님</Text>
                      <Text style={styles.cardValue}>{selectedLecture.professor}</Text>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.infoEmoji}>📍</Text>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardLabel}>강의실</Text>
                      <Text style={styles.cardValue}>{selectedLecture.classroom}</Text>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.infoEmoji}>⏰</Text>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardLabel}>시간</Text>
                      <Text style={styles.cardValue}>
                        {selectedLecture.dayOfWeek}요일 {selectedLecture.startTime} - {selectedLecture.endTime}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* 버튼 영역 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteLecture}
                  activeOpacity={0.8}
                  disabled={isDeleting || isDeletingLecture}
                >
                  {(isDeleting || isDeletingLecture) ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    handleClose();
                    // EditLectureModal을 열기 위한 콜백 호출
                    if (selectedLecture && (global as any).openEditLectureModal) {
                      (global as any).openEditLectureModal(selectedLecture);
                    }
                  }}
                  activeOpacity={0.8}
                  disabled={isDeleting || isDeletingLecture}
                >
                  <Text style={styles.editButtonText}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    margin: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '400',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  infoRow: {
    marginBottom: 20,
  },
  mainInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lectureTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subjectCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7BBBFB',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailCards: {
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: -0.2,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#7BBBFB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF5050',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});