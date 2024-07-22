import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, Button, Image } from 'react-native';
import { UserContext } from '../context/UserContext';
import useWorkoutSessions from '../hooks/useWorkoutSessions';
import getWorkoutMessage from '../components/getWorkoutMessage';
import { styled } from 'nativewind';
import Container from '../components/Container'; // Ensure correct import

const Title = styled(Text, 'text-Text text-3xl font-bold mb-2');
const Quote = styled(Text, 'text-Secondary text-base text-center mb-5');
const Message = styled(Text, 'text-Text text-lg text-center my-5 text-Primary');
const OptionsContainer = styled(View, 'flex-row justify-between items-center w-4/5');
const Option = styled(Text, 'text-base text-center border border-gray-400 p-2 rounded-md w-1/3');

export default function HomeScreen() {
  const { profile, loading: profileLoading, error: profileError } = useContext(UserContext);
  const { sessions, loading: sessionsLoading, error: sessionsError } = useWorkoutSessions();

  if (profileLoading || sessionsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (profileError) {
    return <Text>Error: {profileError}</Text>;
  }

  if (sessionsError) {
    return <Text>Error: {sessionsError}</Text>;
  }

  const lastWorkoutDate = sessions.length > 0 ? sessions[0].session_date : null;
  const message = lastWorkoutDate ? getWorkoutMessage(lastWorkoutDate) : "You haven't started a workout yet.";

  return (
    <Container className="justify-center items-center">
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: 250, height: 100, marginBottom: 20 }}
      />
      <Title>Welcome back, {profile.first_name || 'Guest'}!</Title>
      <Quote>
        “I never dreamed about success. I worked for it.” —Estée Lauder
      </Quote>
      <Message>{message}</Message>
      <OptionsContainer>
        <Option>Last workout</Option>
        <Option>Graphs</Option>
        <Button title="Log" onPress={() => console.log(profile)} />
      </OptionsContainer>
    </Container>
  );
}
