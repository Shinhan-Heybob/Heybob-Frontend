import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useChatStore } from '../../model/chatStore';
import type { CurrentUser, ChatMessage } from '../../model/types';

interface AiChatbotProps {
  roomId: string;
  currentUser: CurrentUser;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({ roomId, currentUser }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    connectionStatus,
    sendAiQuestion,
    addMessage,
  } = useChatStore();

  // AI 관련 메시지만 필터링
  const aiMessages = messages.filter(msg => 
    msg.messageType === 'AI_BOT_REQUEST' || msg.messageType === 'AI_BOT_RESPONSE'
  );

  // 새 메시지 시 스크롤 하단으로
  useEffect(() => {
    if (aiMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [aiMessages]);

  // 메시지 수신 감지하여 로딩 상태 관리
  useEffect(() => {
    const lastMessage = aiMessages[aiMessages.length - 1];
    if (lastMessage?.messageType === 'AI_BOT_RESPONSE') {
      setIsLoading(false);
    }
  }, [aiMessages]);

  // AI 질문 전송
  const handleSendQuestion = () => {
    if (!inputText.trim() || isLoading) return;

    const question = inputText.trim();
    
    try {
      // AI 질문 전송만 하고 메시지는 WebSocket을 통해 수신
      sendAiQuestion(question);
      setInputText('');
      setIsLoading(true);
      
    } catch (error) {
      Alert.alert('오류', 'AI 질문 전송에 실패했습니다');
      setIsLoading(false);
    }
  };

  // 질문 예시
  const questionExamples = [
    '매운 음식 추천해줘',
    '다이어트할 때 좋은 메뉴는?',
    '비 오는 날 먹기 좋은 음식',
    '간단하게 먹을 수 있는 메뉴',
  ];

  const handleExamplePress = (example: string) => {
    setInputText(example);
  };

  // 메시지 렌더링
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.senderId === currentUser.userId;
    const isAiResponse = item.messageType === 'AI_BOT_RESPONSE';
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.otherMessage,
        isAiResponse && styles.aiResponse,
      ]}>
        {!isMyMessage && (
          <Text style={styles.senderName}>
            {isAiResponse ? '🤖 AI 메뉴추천봇' : item.senderName}
          </Text>
        )}
        <Text style={[
          styles.messageText,
          isMyMessage ? styles.myMessageText : styles.otherMessageText,
          isAiResponse && styles.aiResponseText,
        ]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  const isConnected = connectionStatus === 'connected';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI 메뉴 추천봇</Text>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: isConnected ? '#10B981' : '#EF4444' }
        ]} />
      </View>

      {/* 메시지 목록 */}
      <FlatList
        ref={flatListRef}
        data={aiMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.messageId}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 로딩 표시 */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loadingText}>AI가 추천을 생성하고 있어요...</Text>
        </View>
      )}

      {/* 질문 예시 */}
      {aiMessages.length === 0 && (
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>💡 질문 예시:</Text>
          {questionExamples.map((example, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleButton}
              onPress={() => handleExamplePress(example)}
            >
              <Text style={styles.exampleText}>"{example}"</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 입력 영역 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="AI에게 메뉴를 물어보세요..."
          multiline
          maxLength={500}
          editable={isConnected && !isLoading}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          style={[
            styles.sendButton, 
            { opacity: (isConnected && inputText.trim() && !isLoading) ? 1 : 0.5 }
          ]}
          onPress={handleSendQuestion}
          disabled={!isConnected || !inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>🚀</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#7C3AED',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aiResponse: {
    backgroundColor: '#0EA5E9',
    borderWidth: 0,
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1F2937',
  },
  aiResponseText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#2563EB',
    fontSize: 14,
  },
  examplesContainer: {
    padding: 16,
    backgroundColor: '#F0F8FF',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  exampleButton: {
    backgroundColor: '#DBEAFE',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  exampleText: {
    color: '#1E40AF',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 18,
  },
});