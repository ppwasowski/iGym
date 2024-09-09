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
import LoadingScreen from '../components/LoadingScreen';
import CustomPressable from '../components/Pressable';
import { styled } from 'nativewind';

const WorkoutItem = styled(View, 'flex-row items-center justify-between p-3 border-b border-Separator bg-Secondary p-3 m-2 rounded-lg w-[94%]');
const WorkoutNameContainer = styled(View, 'flex-1 items-center ');
const WorkoutName = styled(Text, 'text-Text text-xl font-bold text-center ');
const IconButton = styled(Ionicons, 'text-2xl');

const WorkoutSelection = ({ route }) => {
  const { exerciseId, session } = route.params;
  const userId = session.user.id;
  const navigation = useNavigation();
  const { workouts, error: fetchError, loading: loadingWorkouts, setWorkouts } = useFetchWorkouts(userId);
  const { addExerciseToWorkout, error: addError, loading: addingExercise } = useAddExerciseToWorkout(workouts, setWorkouts);
  const { removeExerciseFromWorkout, error: removeError, loading: removingExercise } = useRemoveExerciseFromWorkout(workouts, setWorkouts);

  if (loadingWorkouts || addingExercise || removingExercise) {
    return <LoadingScreen message="Processing..." />;
  }

  return (
    <Container className="flex-1 p-4">
      {(fetchError || addError || removeError) && (
        <ToastShow type="error" text1="Error" text2={fetchError || addError || removeError} />
      )}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isExerciseInWorkout = item.workout_exercise.some(we => we.exercise_id === exerciseId);
          return (
            <WorkoutItem>
              <Ionicons 
                name={item.icon_name || 'fitness'} 
                size={24} 
                color={item.icon_color || '#000'} 
                style={{ marginRight: 10 }}
              />
              <WorkoutNameContainer>
                <WorkoutName>{item.name}</WorkoutName>
              </WorkoutNameContainer>
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
                  color="#00C87C"
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
