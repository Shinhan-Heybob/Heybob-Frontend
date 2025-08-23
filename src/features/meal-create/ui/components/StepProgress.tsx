import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/src/shared/ui';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              {/* 단계 원 */}
              <View style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}>
                <Text style={[
                  styles.stepNumber,
                  (isActive || isCompleted) && styles.stepNumberActive,
                ]}>
                  {stepNumber}
                </Text>
              </View>
              
              {/* 연결선 (마지막 단계가 아닐 때만) */}
              {stepNumber < totalSteps && (
                <View style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineCompleted,
                ]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#3B82F6',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
});