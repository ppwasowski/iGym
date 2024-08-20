import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StatsContainer = styled(View, 'flex-wrap flex-row justify-between items-center w-full');
const StatBlock = styled(View, 'bg-background p-4 m-2 rounded-md w-[47%] items-left');
const StatTitle = styled(Text, 'text-lg text-Primary font-bold');
const StatText = styled(Text, 'text-lg text-white font-bold');
const Separator = styled(View, 'bg-Separator h-[1px] w-full my-4');

export default function ExerciseStatsSection({ maxReps, maxWeight, numberOfSets }) {
  return (
    <StatsContainer>
      <View className="flex-row w-full justify-between">
        <StatBlock>
          <StatTitle>Max Weight</StatTitle>
          <StatText>{maxWeight ? `${maxWeight} kg` : 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <StatTitle>Best Max Weight</StatTitle>
          <StatText>{maxReps ?? 'N/A'}</StatText>
        </StatBlock>
      </View>
      <Separator/>
      <View className="flex-row w-full justify-between">
        <StatBlock>
          <StatTitle>Reps Count</StatTitle>
          <StatText>{maxReps ?? 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <StatTitle>Best Reps Count</StatTitle>
          <StatText>{maxReps ?? 'N/A'}</StatText>
        </StatBlock>
      </View>
      <Separator />
      <View className="flex-row w-full justify-between">
        <StatBlock>
          <StatTitle>Total Sets</StatTitle>
          <StatText>{numberOfSets ?? 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <StatTitle>Max Sets Count</StatTitle>
          <StatText>{numberOfSets ?? 'N/A'}</StatText>
        </StatBlock>
      </View>
    </StatsContainer>
  );
}
