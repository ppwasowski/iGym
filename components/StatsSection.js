import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StatsContainer = styled(View, 'flex-wrap flex-row justify-between items-center w-full');
const StatBlock = styled(TouchableOpacity, 'bg-background p-4 m-2 rounded-md w-[47%] items-left');
const StatTitle = styled(Text, 'text-lg text-Primary font-bold');
const StatText = styled(Text, 'text-lg text-white font-bold');
const Separator = styled(View, 'bg-Separator h-[1px] w-full my-4');

export default function StatsSection({ stats, handleNavigation }) {
  return (
    <StatsContainer>
      <View className="flex-row w-full justify-between">
        <StatBlock onPress={() => handleNavigation(stats?.maxWeightSessionId)}>
          <StatTitle>Max Weight</StatTitle>
          <StatText>{stats?.maxCarriedWeight ? `${stats.maxCarriedWeight} kg` : 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <StatTitle>Total Weight</StatTitle>
          <StatText>{stats?.totalWeightCarried ? `${stats.totalWeightCarried} kg` : 'N/A'}</StatText>
        </StatBlock>
      </View>
      <Separator />
      <View className="flex-row w-full justify-between">
        <StatBlock onPress={() => handleNavigation(stats?.maxRepsSessionId)}>
          <StatTitle>Max Reps</StatTitle>
          <StatText>{stats?.maxRepsDone ?? 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <StatTitle>Workouts Done</StatTitle>
          <StatText>{stats?.numberOfWorkouts ?? 'N/A'}</StatText>
        </StatBlock>
      </View>
    </StatsContainer>
  );
}
