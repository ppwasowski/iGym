// components/CustomInput.js
import React from 'react';
import { TextInput } from 'react-native';
import { styled } from 'nativewind';

const CustomInput = styled(TextInput);

const Input = (props) => {
  return (
    <CustomInput
      className="border border-Secondary bg-white text-black placeholder-black rounded-md px-4 py-2"
      placeholderTextColor="black"
      {...props}
    />
  );
};

export default Input;
