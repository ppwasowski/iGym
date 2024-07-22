import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';

const CustomView = styled(View);

const Container = (props) => {
  return (
    <CustomView
      className="bg-background flex-1 p-4 px-5"
      {...props}
    />
  );
};

export default Container;
