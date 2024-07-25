import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';

const ButtonContainer = styled(TouchableOpacity);
const ButtonText = styled(Text);

const Button = ({ title, onPress, disabled }) => {
  return (
    <ButtonContainer
      className={`bg-Primary rounded-md py-2 px-4 flex justify-center items-center ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled}
    >
      <ButtonText className="text-Text text-base font-semibold">{title}</ButtonText>
    </ButtonContainer>
  );
};

export default Button;
