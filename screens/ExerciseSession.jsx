import React, { useState, useEffect } from 'react';  
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetchExerciseSession from '../hooks/useFetchExerciseSession'; 
import Button from '../components/Button';
import Container from '../components/Container';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';

const ExerciseItem = styled(View, 'flex-row items-center justify-between p-3 border-b border-Separator');
const ExerciseName = styled(Text, 'text-Text text-lg capitalize');
const IconButton = styled(Ionicons, 'text-2xl');

const ExerciseSession = ({ route }) => {
  const { workoutId, sessionId, session, refresh } = route.params;
  const navigation = useNavigation();

  const [completedExercises, setCompletedExercises] = useState([]);

  // Validate the presence of required IDs
  useEffect(() => {
    if (!workoutId || !sessionId) {
      console.error('Workout ID or Session ID is missing:', { workoutId, sessionId });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Workout ID or Session ID is missing. Please try again.',
      });
    }
  }, [workoutId, sessionId]);

  const { exercises, loading, error } = useFetchExerciseSession(workoutId, sessionId);

  const markExerciseCompleted = (exerciseId) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
  };

  const startExercise = (exerciseId, exerciseName) => {
    navigation.navigate('ExerciseWorkout', {
    workoutId,
    exerciseId,
    exerciseName,
    sessionId,
    markExerciseCompleted,
    session,
    });
  };

  const handleFinishWorkout = () => {
    if (refresh) refresh();
    navigation.navigate('WorkoutProgress', { workoutId, sessionId, from: 'ExerciseSession' });
  };

  if (loading) {
    return (
      <Container className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-Text text-base mt-4">Loading exercises...</Text>
      </Container>
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
    <Container className="flex-1 p-4">
      {exercises.length === 0 ? (
        <Text className="text-Text text-base mt-4">No exercises found.</Text>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => startExercise(item.exercise_id, item.exercises.name)}>
              <ExerciseItem>
                <ExerciseName style={{ textDecorationLine: completedExercises.includes(item.exercise_id) ? 'line-through' : 'none' }}>
                  {item.exercises.name}
                </ExerciseName>
                {completedExercises.includes(item.exercise_id) && (
                  <IconButton name="checkmark-circle" color="green" />
                )}
              </ExerciseItem>
            </TouchableOpacity>
          )}
        />
      )}
      <Button title="Finish Workout" onPress={handleFinishWorkout} />
      <Toast />
    </Container>
  );
};

export default ExerciseSession;
