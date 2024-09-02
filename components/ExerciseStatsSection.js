import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import Icon from './Icon'; // Import the Icon component

const StatsContainer = styled(View, 'flex-wrap flex-row justify-between items-center w-full');
const StatBlock = styled(View, 'p-4 m-2 rounded-md w-[47%] items-left');
const StatTitle = styled(Text, 'text-md text-Text font-bold');
const StatText = styled(Text, 'text-md text-Primary font-bold');
const Separator = styled(View, 'bg-Separator h-[1px] w-full my-4');

export default function ExerciseStatsSection({ maxReps, maxWeight, numberOfSets }) {
  return (
    <StatsContainer>
      <View className="flex-row justify-between bg-Secondary pr-6 m-4 rounded-lg w-[94%]">
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
      </View>
      <View className="flex-row justify-between bg-Secondary pr-6 m-4 rounded-lg w-[94%]">
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
      </View>
      <View className="flex-row justify-between bg-Secondary pr-6 m-4 rounded-lg w-[94%]">
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
      </View>
    </StatsContainer>
  );
}
