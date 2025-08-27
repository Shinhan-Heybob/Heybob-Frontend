import { QRModal } from '@/src/shared/ui/molecules/QRModal';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../../model/userStore';

export const StudentCardSection: React.FC = () => {
  const [showQRModal, setShowQRModal] = useState(false);
  const { profile } = useUserStore();

  const handleShowStudentCard = () => {
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>학생증 / 지갑정보</Text>
      
      <View style={styles.card}>
        {/* 내 학생증 버튼 */}
        <TouchableOpacity 
          style={styles.studentCardButton}
          onPress={handleShowStudentCard}
        >
          <Text style={styles.studentCardText}>모바일 학생증</Text>
          <Text style={styles.studentCardIcon}>›</Text>
        </TouchableOpacity>
      </View>

      {/* QR 모달 */}
      {showQRModal && profile && (
        <QRModal
          visible={showQRModal}
          onClose={handleCloseQRModal}
          user={{
            id: profile.id,
            name: profile.name,
            studentId: profile.studentId,
            avatarId: profile.profileImage,
            school: { id: '1', name: '싸피대학교' },
            department: { id: 'dept_01', name: '컴퓨터공학과', schoolId: '1' }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  studentCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
  },
  studentCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  studentCardIcon: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
});