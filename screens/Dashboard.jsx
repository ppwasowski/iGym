import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import useWorkoutSessions from '../hooks/useWorkoutSessions';
import useStats from '../hooks/useStats';
import getWorkoutMessage from '../components/getWorkoutMessage';
import { styled } from 'nativewind';
import Container from '../components/Container';
import { useNavigation } from '@react-navigation/native';

// Styled components using nativewind
const Title = styled(Text, 'text-Text text-3xl font-bold mb-2');
const Message = styled(Text, 'text-Text text-lg text-center my-5 text-Primary');
const StatsContainer = styled(View, 'flex-wrap flex-row justify-between items-center w-full');
const StatBlock = styled(TouchableOpacity, 'bg-background p-4 m-2 rounded-md w-[47%] items-left');
const StatTitle = styled(Text, 'text-lg text-Primary font-bold');
const StatText = styled(Text, 'text-lg text-white font-bold');
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
      navigation.navigate('WorkoutProgress', { sessionId });
    } else {
      console.warn("Invalid sessionId passed to handleNavigation:", sessionId);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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
    </Container>
  );
}
