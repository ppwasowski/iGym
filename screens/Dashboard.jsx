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
import Icon from '../components/Icon'; // Import the Icon component

// Styled components using nativewind
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

  const handleNavigation = (sessionId) => {
    if (sessionId) {
      navigation.navigate('Workouts', {
        screen: 'WorkoutProgress',
        params: { sessionId },
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
      <Image
        source={require('../assets/images/logo.png')}
        className="w-[250px] h-[100px] mb-5"
      />
      <Title className='text-Text font-md mr-10'>Hi!</Title>
      <Title className='text-Alter font-semibold mt-[-20px] ml-20'> {profile?.first_name || 'Guest'}</Title>
      
      <View className='bg-Secondary p-6 m-4 rounded-lg w-[94%]'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-Text text-md font-bold'>
            Consistency: <Text className={`${workoutMessage.color} font-xl`}>{workoutMessage.consistency}</Text>
          </Text>
          <Icon name="bulb" color="Alter" style="mr-2" />
        </View>
        <Reminder>{workoutMessage.reminder}</Reminder>
        <Message>Your last workout was: <Text className='text-Primary'>{workoutMessage.diffDays} day ago</Text></Message>
      </View>

      <Separator />
      <StatsSection stats={stats} handleNavigation={handleNavigation} />
    </Container>
  );
}
