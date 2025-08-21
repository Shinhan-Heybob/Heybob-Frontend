import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from '../atoms/Text';

interface FormCardProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  children,
  className = '',
  ...props
}) => {
  return (
    <View className={`bg-white ${className}`} {...props}>
      {title && (
        <Text variant="title" className="mb-6 text-center">
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};