// components/CustomHeader.js
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const CustomHeaderContainer = styled(View, 'bg-Navigation flex-row justify-center items-center pb-2 border-Separator border-b-2' );
const HeaderTitle = styled(Text, 'text-Text text-lg font-bold');
const StyledSafeAreaView = styled(SafeAreaView, 'bg-Navigation');

const CustomHeader = ({ title }) => {
  return (
    <StyledSafeAreaView edges={['top']}>
      <CustomHeaderContainer>
        <HeaderTitle>{title}</HeaderTitle>
      </CustomHeaderContainer>
    </StyledSafeAreaView>
  );
};

export default CustomHeader;
