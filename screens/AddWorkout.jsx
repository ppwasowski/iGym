import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import useAddWorkout from '../hooks/useAddWorkout';

const AddWorkout = ({ navigation, route }) => {
  const [workoutName, setWorkoutName] = useState('');
  const { refreshWorkouts } = route.params;
  const { addWorkout, error } = useAddWorkout();

  const handleAddWorkout = async () => {
    await addWorkout(workoutName, refreshWorkouts);
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Add New Workout</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
      />
      <Button title="Add Workout" onPress={handleAddWorkout} />
    </View>
  );
};

export default AddWorkout;
