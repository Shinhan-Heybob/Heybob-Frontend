import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'body' | 'caption' | 'link';
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  className = '',
  children,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'title':
        return 'text-2xl font-bold text-gray-900';
      case 'body':
        return 'text-base text-gray-700';
      case 'caption':
        return 'text-sm text-gray-500';
      case 'link':
        return 'text-base text-[#7BBBFB] font-medium';
      default:
        return 'text-base text-gray-700';
    }
  };

  return (
    <RNText 
      className={`${getVariantClasses()} ${className}`}
      {...props}
    >
      {children}
    </RNText>
  );
};