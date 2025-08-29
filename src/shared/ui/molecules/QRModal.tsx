import { UserInfo } from '@/src/features/main/types';
import { getAvatarById } from '@/src/shared/data/avatars';
import { DEPARTMENTS } from '@/src/shared/data/departments';
import { SCHOOLS } from '@/src/shared/data/schools';
import { User } from '@/src/shared/types/auth';
import { Button, Text } from '@/src/shared/ui';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface StudentQRData {
  studentId: string;
  name: string;
  schoolId: string;
  departmentId: string;
  issueTime: number;
}

interface QRModalProps {
  visible: boolean;
  user: User;
  currentUser?: User | UserInfo; // 실제 표시할 사용자 정보
  onClose: () => void;
}

// QR 데이터 생성 함수
const generateQRData = (user: User, displayUser?: User | UserInfo): string => {
  const actualName = displayUser?.name || user.name;
  
  // 기본값은 user에서 가져오지만, displayUser가 있으면 우선 사용
  let actualDepartmentId = user.department.id;
  let actualSchoolId = user.school.id;
  
  if (displayUser && 'department' in displayUser && typeof displayUser.department === 'string') {
    // UserInfo 타입인 경우 (department가 문자열)
    // 실제 학과명으로 department ID 찾기
    const actualDepartment = DEPARTMENTS.find(dept => 
      dept.name === displayUser.department
    );
    
    // UserInfo 타입에서는 university 속성이 있음
    if ('university' in displayUser) {
      // 실제 학교명으로 school ID 찾기 (괄호 제거)
      const schoolName = displayUser.university.split(' (')[0];
      const actualSchool = SCHOOLS.find(school => 
        school.name.includes(schoolName)
      );
      
      if (actualSchool) {
        actualSchoolId = actualSchool.id;
      } else {
        console.warn('🔍 QR 생성 - 학교를 찾을 수 없습니다:', schoolName);
      }
      
      console.log('학교명:', schoolName);
      console.log('찾은 학교:', actualSchool);
    }
    
    // displayUser 정보가 있으면 반드시 사용 (user의 하드코딩된 값 무시)
    if (actualDepartment) {
      actualDepartmentId = actualDepartment.id;
    } else {
      console.warn('🔍 QR 생성 - 학과를 찾을 수 없습니다:', displayUser.department);
    }
    
    // console.log('🔍 QR 생성 - 실제 학과 찾기:');
    // console.log('학과명:', displayUser.department);
    // console.log('찾은 학과:', actualDepartment);
    // console.log('최종 department ID:', actualDepartmentId);
    // console.log('최종 school ID:', actualSchoolId);
  }
  
  const qrData: StudentQRData = {
    studentId: displayUser?.studentId || user.studentId,
    name: actualName,
    schoolId: actualSchoolId,
    departmentId: actualDepartmentId,
    issueTime: Date.now(),
  };
  
  console.log('🔍 최종 QR 데이터:', qrData);
  
  return JSON.stringify(qrData);
};

export const QRModal: React.FC<QRModalProps> = ({ visible, user, currentUser, onClose }) => {
  console.log('🔍 QRModal Debug:');
  console.log('user received:', user);
  console.log('currentUser received:', currentUser);
  console.log('user.name:', user?.name);
  console.log('currentUser.name:', currentUser?.name);
  
  // 표시용 사용자 정보 (currentUser 우선, 없으면 user)
  const displayUser = currentUser || user;
  
  const qrData = generateQRData(user, currentUser);
  const avatarImage = getAvatarById(user.avatarId);

  // 한글명만 추출 (괄호 앞 부분)
  const getKoreanName = (fullName: string) => {
    const koreanName = fullName.split(' (')[0];
    return koreanName;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            {/* 학생증 정보 섹션 */}
            <View style={styles.studentCardSection}>
              {/* 카드 헤더 */}
              <View style={styles.cardHeader}>
                <Text variant="body" style={styles.cardTitle}>
                  모바일 학생증
                </Text>
              </View>

              {/* 학생 정보 */}
              <View style={styles.studentInfo}>
                {/* 아바타 */}
                <View style={styles.avatarContainer}>
                  <Image
                    source={avatarImage}
                    style={styles.avatar}
                    contentFit="contain"
                  />
                </View>

                {/* 정보 텍스트 */}
                <View style={styles.infoContainer}>
                  <Text variant="body" style={styles.schoolInfo}>
                    {'university' in displayUser 
                      ? `${getKoreanName(displayUser.university)} / ${getKoreanName(displayUser.department)}`
                      : `${getKoreanName(displayUser.school.name)} / ${getKoreanName(displayUser.department.name)}`
                    }
                  </Text>
                  <Text variant="title" style={styles.nameInfo}>
                    {displayUser.name}({displayUser.studentId})
                  </Text>
                </View>
              </View>
            </View>
            
            {/* QR 코드 */}
            <View style={styles.qrContainer}>
              <QRCode
                value={qrData}
                size={200}
                backgroundColor="white"
                color="black"
                enableLinearGradient={false}
              />
            </View>
            
            {/* 유효시간 안내 */}
            <Text variant="caption" style={styles.validityText}>
              ⏰ 5분간 유효합니다
            </Text>
            
            {/* 닫기 버튼 */}
            <Button
              title="닫기"
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>
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
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
    borderWidth:1,
    borderColor:'#E5E7EB'
  },
  studentCardSection: {
    width: '100%',
    marginBottom: 12,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    flex: 1,
  },
  schoolInfo: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  nameInfo: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  validityText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  closeButton: {
    width: '100%',
  },
});