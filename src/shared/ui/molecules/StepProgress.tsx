import { Text } from '@/src/shared/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const DashedLine: React.FC<{ isCompleted: boolean }> = ({ isCompleted }) => {
  const dots = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <View style={styles.dashedContainer}>
      {dots.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            isCompleted && styles.dotCompleted
          ]}
        />
      ))}
    </View>
  );
};

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
                <DashedLine isCompleted={isCompleted} />
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
    backgroundColor: '#3B82F6',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: 'white',
  },
  dashedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60,
    marginHorizontal: 8,
  },
  dot: {
    width: 3,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dotCompleted: {
    backgroundColor: '#3B82F6',
  },
});