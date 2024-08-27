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


// Styled components using nativewind
const Title = styled(Text, 'text-Text text-3xl font-bold mb-2');
const Message = styled(Text, 'text-Text text-lg text-center my-5 text-Primary');
const Separator = styled(View, 'bg-Separator h-[1px] w-full my-4');

export default function HomeScreen() {
  const { profile, loading: profileLoading, error: profileError } = useContext(UserContext);
  const { sessions, loading: sessionsLoading, error: sessionsError } = useWorkoutSessions();
  const { stats, loading: statsLoading, error: statsError } = useStats(profile?.id);
  const navigation = useNavigation();

  const isLoading = profileLoading || sessionsLoading || statsLoading;
  const hasError = profileError || sessionsError || statsError;

  const lastWorkoutDate = sessions?.length > 0 ? sessions[0].session_date : null;
  const message = lastWorkoutDate ? getWorkoutMessage(lastWorkoutDate) : "You haven't started a workout yet.";

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
        style={{ width: 250, height: 100, marginBottom: 20 }}
      />
      <Title>Welcome back, {profile?.first_name || 'Guest'}!</Title>
      <Message>{message}</Message>
      <Separator />
      <StatsSection stats={stats} handleNavigation={handleNavigation} />
    </Container>
  );
}
