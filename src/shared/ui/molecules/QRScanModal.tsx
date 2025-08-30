import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';

interface QRFriendData {
  userId: string;
  name: string;
  studentId: string;
  schoolId: string;
  departmentId: string;
  issueTime: number;
}

interface QRScanModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (data: QRFriendData) => void;
}

export const QRScanModal: React.FC<QRScanModalProps> = ({
  visible,
  onClose,
  onScanSuccess,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
      setScanned(false);
    }
  }, [visible]);

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      const parsedData = JSON.parse(data);
      
      // QR 데이터 검증 (QR 생성 형식: userId, studentId, name, schoolId, departmentId, issueTime)
      if (parsedData.userId && parsedData.name && parsedData.studentId && parsedData.schoolId && parsedData.departmentId) {
        onScanSuccess({
          userId: parsedData.userId,
          name: parsedData.name,
          studentId: parsedData.studentId,
          schoolId: parsedData.schoolId,
          departmentId: parsedData.departmentId,
          issueTime: parsedData.issueTime
        });
        onClose();
      } else {
        Alert.alert('오류', '올바른 QR 코드가 아닙니다.', [
          { text: '확인', onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      Alert.alert('오류', '올바른 QR 코드가 아닙니다.', [
        { text: '확인', onPress: () => setScanned(false) }
      ]);
    }
  };

  if (!visible) return null;

  if (hasPermission === null) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>QR 코드 스캔</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.centerContainer}>
            <Text style={styles.messageText}>카메라 권한을 요청 중...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (hasPermission === false) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>QR 코드 스캔</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.centerContainer}>
            <Text style={styles.messageText}>카메라 권한이 필요합니다</Text>
            <Text style={styles.subMessageText}>설정에서 카메라 권한을 허용해주세요</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR 코드 스캔</Text>
          <View style={styles.placeholder} />
        </View>

        {/* QR 스캐너 */}
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        
        {/* 오버레이 */}
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>
            친구의 QR 코드를 스캔하세요
          </Text>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.subInstructionText}>
            QR 코드를 프레임 안에 맞춰주세요
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  subMessageText: {
    color: '#ccc',
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  subInstructionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 30,
    textAlign: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#7BBBFB',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});