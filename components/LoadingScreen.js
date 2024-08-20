import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styled } from 'nativewind';

const LoadingContainer = styled(View, 'flex-1 justify-center items-center bg-background');
const LoadingText = styled(Text, 'text-Text text-lg font-bold mt-4');

const LoadingScreen = ({ message = 'Loading...'}) => {
  return (
    <LoadingContainer>
      <ActivityIndicator size="large" color='#00C87C' />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen;
