import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';
import useRemoveExerciseFromWorkout from '../services/useRemoveExerciseFromWorkout';
import useStartWorkout from '../services/useStartWorkout';
import useFetchWorkoutHistory from '../hooks/useFetchWorkoutHistory';
import ToastShow from '../components/ToastShow';
import Button from '../components/Button';
import Container from '../components/Container';
import { styled } from 'nativewind';

const ExerciseItem = styled(View, 'flex-row items-center justify-between p-3 border-b border-Separator');
const ExerciseName = styled(Text, 'text-Text text-lg');
const IconButton = styled(Ionicons, 'text-2xl');

const WorkoutDetails = ({ route, navigation }) => {
  const { workoutId, session } = route.params;
  const userId = session.user.id;
  const { data: exercises, error: fetchError, setData: setExercises, setError: setFetchError, refresh: refreshExercises } = useFetchExercisesForContext({ workoutId });
  const { removeExerciseFromWorkout, error: removeError, setError: setRemoveError } = useRemoveExerciseFromWorkout(workoutId, exercises, setExercises);
  const { workoutSessions, error: historyError, refresh: refreshHistory } = useFetchWorkoutHistory(userId);
  const { startWorkout, error: startError } = useStartWorkout(workoutId, userId);

  const handleStartWorkout = async () => {
    const data = await startWorkout();
    if (data) {
      refreshExercises(); // Refresh the exercises list
      refreshHistory(); // Refresh the workout history
      navigation.navigate('ExerciseSession', { workoutId: data.workout_id, sessionId: data.id, session, refresh: refreshExercises });
    }
  };

  return (
    <Container className="flex-1 p-4">
      {(fetchError || removeError || startError || historyError) && (
        <ToastShow type="error" text1="Error" text2={fetchError || removeError || startError || historyError} />
      )}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.exercise_id.toString()}
        renderItem={({ item }) => (
          <ExerciseItem>
            <ExerciseName>{item.exercises.name}</ExerciseName>
            <IconButton
              name="remove-circle"
              onPress={() => removeExerciseFromWorkout(item.exercise_id)}
              color="red"
            />
          </ExerciseItem>
        )}
      />
      <Button title="Start Workout" onPress={handleStartWorkout} />
    </Container>
  );
};

export default WorkoutDetails;
