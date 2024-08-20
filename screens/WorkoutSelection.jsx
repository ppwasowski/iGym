import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetchWorkouts from '../hooks/useFetchWorkouts';
import useAddExerciseToWorkout from '../services/useAddExerciseToWorkout';
import useRemoveExerciseFromWorkout from '../services/useRemoveExerciseFromWorkout';
import ToastShow from '../components/ToastShow';
import Button from '../components/Button';
import Container from '../components/Container';
import LoadingScreen from '../components/LoadingScreen'; // Importing LoadingScreen correctly
import { styled } from 'nativewind';

const Title = styled(Text, 'text-Text text-xl mb-4');
const WorkoutItem = styled(View, 'flex-row items-center justify-between p-3 border-b border-Separator');
const WorkoutName = styled(Text, 'text-Text text-lg');
const IconButton = styled(Ionicons, 'text-2xl');

const WorkoutSelection = ({ route }) => {
  const { exerciseId, session } = route.params;
  const userId = session.user.id;
  const navigation = useNavigation();
  const { workouts, error: fetchError, loading: loadingWorkouts, setWorkouts } = useFetchWorkouts(userId);
  const { addExerciseToWorkout, error: addError, loading: addingExercise } = useAddExerciseToWorkout(workouts, setWorkouts);
  const { removeExerciseFromWorkout, error: removeError, loading: removingExercise } = useRemoveExerciseFromWorkout(workouts, setWorkouts);

  if (loadingWorkouts || addingExercise || removingExercise) {
    return <LoadingScreen message="Processing..." />; // Use the correctly imported LoadingScreen
  }

  return (
    <Container className="flex-1 p-4">
      {(fetchError || addError || removeError) && (
        <ToastShow type="error" text1="Error" text2={fetchError || addError || removeError} />
      )}
      <Title>Select Workout to Add/Remove Exercise</Title>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isExerciseInWorkout = item.workout_exercise.some(we => we.exercise_id === exerciseId);
          return (
            <WorkoutItem>
              <WorkoutName>{item.name}</WorkoutName>
              {isExerciseInWorkout ? (
                <IconButton
                  name="remove-circle"
                  onPress={() => removeExerciseFromWorkout(item.id, exerciseId)}
                  color="red"
                />
              ) : (
                <IconButton
                  name="add-circle"
                  onPress={() => addExerciseToWorkout(item.id, exerciseId)}
                  color="green"
                />
              )}
            </WorkoutItem>
          );
        }}
      />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </Container>
  );
};

export default WorkoutSelection;
