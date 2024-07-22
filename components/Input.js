// components/CustomInput.js
import React from 'react';
import { TextInput } from 'react-native';
import { styled } from 'nativewind';

const CustomInput = styled(TextInput);

const Input = (props) => {
  return (
    <CustomInput
      className="border border-Secondary bg-background text-Text placeholder-Text rounded-md px-4 py-2"
      placeholderTextColor="#FFFFFF"
      {...props}
    />
  );
};

export default Input;
