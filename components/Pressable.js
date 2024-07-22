import React from 'react';
import { Pressable, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable, 'bg-Primary h-24 w-44 m-1 mt-2 rounded-lg justify-center items-center shadow-lg');
const StyledText = styled(Text, 'text-Text text-lg font-bold capitalize');

const CustomPressable = ({ onPress, title, textStyle, ...props}) => {
  return (
    <StyledPressable onPress={onPress}>
      <StyledText>{title}</StyledText>
    </StyledPressable>
  );
};

export default CustomPressable;
