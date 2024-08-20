import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchWorkoutHistory from '../hooks/useFetchWorkoutHistory';
import Container from '../components/Container';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import LoadingScreen from '@/components/LoadingScreen';

const SessionItem = styled(View, 'py-3 px-4 my-2 bg-Secondary rounded-md');
const SessionText = styled(Text, 'text-Text text-base');

const WorkoutHistory = ({ session }) => {
  const { workoutSessions, loading, error } = useFetchWorkoutHistory(session.user.id);
  const navigation = useNavigation();

  const navigateToWorkoutProgress = (sessionId, workoutName) => {
    navigation.navigate('WorkoutProgress', { sessionId, workoutName, from: 'WorkoutHistory' });
  };

  if (loading) {
    return (
      <LoadingScreen message="Loading history..." />
    );
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  return (
    <Container className="flex-1 p-5">
      <FlatList
        data={workoutSessions}
        keyExtractor={(item) => item.workout_session_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigateToWorkoutProgress(item.workout_session_id, item.workout_name)}
          >
            <SessionItem>
              <SessionText>"{item.workout_name}" {item.date}</SessionText>
            </SessionItem>
          </TouchableOpacity>
        )}
      />
      <Toast />
    </Container>
  );
};

export default WorkoutHistory;
