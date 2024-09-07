import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { UserContext } from '../context/UserContext';
import useWorkoutSessions from '../hooks/useWorkoutSessions';
import useStats from '../hooks/useStats';
import getWorkoutMessage from '../components/getWorkoutMessage';
import { styled } from 'nativewind';
import Container from '../components/Container';
import { useNavigation } from '@react-navigation/native';
import StatsSection from '../components/StatsSection';
import LoadingScreen from '../components/LoadingScreen';
import Icon from '../components/Icon';

const Title = styled(Text, 'text-3xl mb-2');
const Message = styled(Text, 'text-Text text-lg text-center my-2');
const Separator = styled(View, 'bg-Separator h-[1px] w-full my-4');
const Reminder = styled(Text, 'text-Alter text-center text-xl mt-4 font-bold');

export default function HomeScreen() {
  const { profile, loading: profileLoading, error: profileError } = useContext(UserContext);
  const { sessions, loading: sessionsLoading, error: sessionsError } = useWorkoutSessions();
  const { stats, loading: statsLoading, error: statsError } = useStats(profile?.id);
  const navigation = useNavigation();

  const isLoading = profileLoading || sessionsLoading || statsLoading;
  const hasError = profileError || sessionsError || statsError;

  const lastWorkoutDate = sessions?.length > 0 ? sessions[0].session_date : null;
  const workoutMessage = lastWorkoutDate ? getWorkoutMessage(lastWorkoutDate) : {
    message: "You haven't started a workout yet.",
    consistency: "",
    reminder: "",
    color: "text-gray-500",
    diffDays: 0
  };

  const handleNavigation = (sessionId, from) => {
    if (sessionId) {
      navigation.navigate('Workout Plans', {
        screen: 'WorkoutProgress',
        params: { sessionId, from:'Dashboard' },
      });
    } else {
      console.warn("Invalid sessionId passed to handleNavigation:", sessionId);
    }
  };
  

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (hasError) {
    return <Text className="text-Text">Error: {profileError || sessionsError || statsError}</Text>;
  }

  return (
    <Container className="justify-center items-center p-4">
  <View className="relative w-full items-center mt-10">
    <Image
      source={require('../assets/images/logo.png')}
      className="w-[250px] h-[100px] mb-5"
      style={{
        position: 'absolute', 
        top: -40, 
        zIndex: 1, 
      }}
    />
  </View>
  
  <View className='bg-Secondary p-6 m-4 rounded-lg w-full mt-10'>
    <View className='flex-row items-center justify-between'>
      <Text className='text-Text text-xl'>
        Consistency: <Text className={`${workoutMessage.color} font-xl font-bold`}>{workoutMessage.consistency}</Text>
      </Text>
      <Icon name="bulb" color="SecAlter" style="mr-2" />
    </View>
    <Reminder>{workoutMessage.reminder}</Reminder>
    <Message>Your last workout was: <Text className={`${workoutMessage.color} font-xl`}>{workoutMessage.diffDays} day ago</Text></Message>
  </View>

  <Separator />

  
  
  <StatsSection stats={stats} handleNavigation={handleNavigation} />
</Container>

  );
  
}
