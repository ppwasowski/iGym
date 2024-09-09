import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import Icon from './Icon';

const Container = styled(View, 'flex-wrap flex-row justify-between items-center w-full');
const StatsContainer = styled(View, 'flex-row justify-between bg-Secondary  rounded-lg w-full my-3');
const StatBlock = styled(View, 'p-4 rounded-md w-[47%] items-left');
const StatTitle = styled(Text, 'text-md text-Text font-bold');
const StatText = styled(Text, 'text-md text-Primary font-bold');
const Separator = styled(View, 'bg-Separator h-[1px] w-full my-4');

export default function ExerciseStatsSection({ maxReps, maxWeight, numberOfSets }) {
  return (
    <Container>
      <StatsContainer>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Max Weight</StatTitle>
            <Icon name="barbell" color="Alter" style="ml-auto" />
          </View>
          <StatText>{maxWeight ? `${maxWeight} kg` : 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Best Weight</StatTitle>
            <Icon name="trophy" color="Alter" style="ml-auto" />
          </View>
          <StatText>{maxWeight ?? 'N/A'}</StatText>
        </StatBlock>
      </StatsContainer>
      <StatsContainer>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Reps Count</StatTitle>
            <Icon name="repeat" color="Alter" style="ml-auto" />
          </View>
          <StatText>{maxReps ?? 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Best Reps</StatTitle>
            <Icon name="trophy" color="Alter" style="ml-auto" />
          </View>
          <StatText>{maxReps ?? 'N/A'}</StatText>
        </StatBlock>
      </StatsContainer>
      <StatsContainer>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Total Sets</StatTitle>
            <Icon name="layers" color="Alter" style="ml-auto" />
          </View>
          <StatText>{numberOfSets ?? 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Max Sets</StatTitle>
            <Icon name="trophy" color="Alter" style="ml-auto" />
          </View>
          <StatText>{numberOfSets ?? 'N/A'}</StatText>
        </StatBlock>
      </StatsContainer>
    </Container>
  );
}
