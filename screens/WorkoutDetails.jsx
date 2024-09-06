import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';
import useRemoveExerciseFromWorkout from '../services/useRemoveExerciseFromWorkout';
import useStartWorkout from '../services/useStartWorkout';
import useFetchWorkoutHistory from '../hooks/useFetchWorkoutHistory';
import ToastShow from '../components/ToastShow';
import Button from '../components/Button';
import Container from '../components/Container';
import LoadingScreen from '../components/LoadingScreen';
import { styled } from 'nativewind';

const ExerciseItem = styled(View, 'flex-row items-center justify-between p-3 border-b border-Separator');
const ExerciseName = styled(Text, 'text-Text text-lg capitalize');
const IconButton = styled(Ionicons, 'text-2xl');
const TitleBlock = styled(View, 'bg-Secondary p-4 my-1 rounded-lg w-full items-center flex-row');
const WorkoutTitle = styled(Text, 'text-lg text-white font-bold ml-3'); // Left margin for spacing next to icon

const WorkoutDetails = ({ route, navigation }) => {
  const { workoutId, workoutName, icon_name, icon_color, session  } = route.params;
  const userId = session.user.id;
  const [deleteMode, setDeleteMode] = useState(false);

  const {
    data: exercises,
    error: fetchError,
    loading: exercisesLoading,
    setData: setExercises,
    setError: setFetchError,
    refresh: refreshExercises,
  } = useFetchExercisesForContext({ workoutId });

  const {
    removeExerciseFromWorkout,
    error: removeError,
    loading: removeLoading,
    setError: setRemoveError,
  } = useRemoveExerciseFromWorkout(workoutId, exercises, setExercises);

  const {
    workoutSessions,
    error: historyError,
    loading: historyLoading,
    refresh: refreshHistory,
  } = useFetchWorkoutHistory(userId);

  const { startWorkout, error: startError, loading: startLoading } = useStartWorkout(workoutId, userId);

  const handleStartWorkout = async () => {
    const data = await startWorkout();
    if (data) {
      refreshExercises();
      refreshHistory();
      navigation.navigate('ExerciseSession', { workoutId: data.workout_id, sessionId: data.id, session, refresh: refreshExercises });
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  if (exercisesLoading || removeLoading || historyLoading || startLoading) {
    return <LoadingScreen message="Loading workout details..." />;
  }

  return (
    <Container className="flex-1 p-4">
      <TitleBlock>
        <Ionicons 
          name={icon_name || 'fitness'} 
          size={24} 
          color={icon_color || '#000'} />
        <WorkoutTitle>{workoutName}</WorkoutTitle> 
      </TitleBlock>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.exercise_id.toString()}
        renderItem={({ item }) => (
          <ExerciseItem>
            <ExerciseName>{item.exercises.name}</ExerciseName>
            {deleteMode && (
              <IconButton
                name="remove-circle"
                onPress={() => removeExerciseFromWorkout(item.exercise_id)}
                color="red"
              />
            )}
          </ExerciseItem>
        )}
      />

      {!deleteMode && (
        <Button title="Start Workout" onPress={handleStartWorkout} />
      )}
      <View className="mt-4">
        <Button
          title={deleteMode ? "Confirm" : "Delete Exercises"}
          onPress={toggleDeleteMode}
          className="mb-4"
        />
      </View>
    </Container>
  );
};

export default WorkoutDetails;
