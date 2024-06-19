import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetchWorkouts from '../hooks/useFetchWorkouts';
import useAddExerciseToWorkout from '../hooks/useAddExerciseToWorkout';
import useRemoveExerciseFromWorkout from '../hooks/useRemoveExerciseFromWorkout';
import ToastShow from '../components/ToastShow';

const WorkoutSelection = ({ route }) => {
  const { exerciseId, session } = route.params;
  const userId = session.user.id; // Ensure this is correctly set
  const navigation = useNavigation();
  const { workouts, error: fetchError, setWorkouts } = useFetchWorkouts(userId);
  const { addExerciseToWorkout, error: addError } = useAddExerciseToWorkout(workouts, setWorkouts);
  const { removeExerciseFromWorkout, error: removeError } = useRemoveExerciseFromWorkout(workouts, setWorkouts);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {(fetchError || addError || removeError) && <Text>Error: {fetchError || addError || removeError}</Text>}
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Select Workout to Add/Remove Exercise</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isExerciseInWorkout = item.workout_exercise.some(we => we.exercise_id === exerciseId);
          return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              {isExerciseInWorkout ? (
                <TouchableOpacity onPress={() => removeExerciseFromWorkout(item.id, exerciseId)}>
                  <Ionicons name="remove-circle" size={24} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => addExerciseToWorkout(item.id, exerciseId)}>
                  <Ionicons name="add-circle" size={24} color="green" />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default WorkoutSelection;
