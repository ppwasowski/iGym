import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';
import useRemoveExerciseFromWorkout from '../services/useRemoveExerciseFromWorkout';
import useStartWorkout from '../services/useStartWorkout';
import useFetchWorkoutHistory from '../hooks/useFetchWorkoutHistory';

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
    <View style={{ flex: 1, padding: 20 }}>
      {(fetchError || removeError || startError || historyError) && <Text>Error: {fetchError || removeError || startError || historyError}</Text>}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.exercise_id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
            <Text style={{ fontSize: 18 }}>{item.exercises.name}</Text>
            <TouchableOpacity onPress={() => removeExerciseFromWorkout(item.exercise_id)}>
              <Ionicons name="remove-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Start Workout" onPress={handleStartWorkout} />
    </View>
  );
};

export default WorkoutDetails;
