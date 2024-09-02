import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';

const colorMap = {
  Primary: '#00C87C',  
  Alter: '#ff9a03',
};

const StyledIonicons = styled(Ionicons);

const Icon = ({ name = "bulb", color = 'Primary', style }) => {
  const resolvedColor = colorMap[color] || color;

  return <StyledIonicons name={name} size={24} color={resolvedColor} style={style} />;
};

export default Icon;
