import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Icon from './Icon';

const StatsContainer = styled(View, 'flex-wrap flex-row justify-between items-center w-full');
const StatBlock = styled(TouchableOpacity, 'bg-Secondary p-4 my-2 rounded-lg w-[47%] items-left');
const StatTitle = styled(Text, 'text-md text-white font-bold');
const StatText = styled(Text, 'text-lg text-Primary font-bold');

export default function StatsSection({ stats, handleNavigation }) {
  return (
    <StatsContainer>
      <View className="flex-row w-full justify-between">
        <StatBlock onPress={() => handleNavigation(stats?.maxWeightSessionId)}>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Max Weight</StatTitle>
            <Icon name="analytics" color="Alter" style="mr-2" />
          </View>
          <StatText>{stats?.maxCarriedWeight ? `${stats.maxWeightExerciseName,stats.maxCarriedWeight} kg` : 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Total Weight</StatTitle>
            <Icon name="barbell" color="Alter" style="mr-2" /> 
          </View>
          <StatText>{stats?.totalWeightCarried ? `${stats.totalWeightCarried} kg` : 'N/A'}</StatText>
        </StatBlock>
      </View>
      <View className="flex-row w-full justify-between">
        <StatBlock onPress={() => handleNavigation(stats?.maxRepsSessionId)}>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Max Reps</StatTitle>
            <Icon name="analytics" color="Alter" style="mr-2" />
          </View>
          <StatText>{stats?.maxRepsDone ?? 'N/A'}</StatText>
        </StatBlock>
        <StatBlock>
          <View className='flex-row items-center justify-between'>
            <StatTitle>Workouts Done</StatTitle>
            <Icon name="pulse" color="Alter" style="mr-2" />
          </View>
          <StatText className='text-'>{stats?.numberOfWorkouts ? `${stats.numberOfWorkouts}` : 'N/A'}</StatText>
        </StatBlock>
      </View>
    </StatsContainer>
  );
}
