import React from 'react';
import { Pressable, Text, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const CustomPressable = ({ onPress, title, imageSource, pressableStyle, textStyle, imageStyle, tintColor, ...props }) => {
  return (
    <StyledPressable onPress={onPress} className={`flex-col justify-between ${pressableStyle}`} {...props}>
      {imageSource && (
        <StyledImage source={imageSource} className={`mb-2 ${imageStyle}`} style={{ tintColor }} />
      )}
      <StyledText className={`text-center ${textStyle}`}>{title}</StyledText>
    </StyledPressable>
  );
};

export default CustomPressable;
