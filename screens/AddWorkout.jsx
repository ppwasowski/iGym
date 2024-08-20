import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import useAddWorkout from '../services/useAddWorkout';
import Button from '../components/Button';
import Input from '../components/Input'; // Import your custom Input component

const Container = styled(View, 'flex-1 p-5 bg-background');
const Title = styled(Text, 'text-3xl text-Text mb-4');

const AddWorkout = ({ navigation, route }) => {
  const [workoutName, setWorkoutName] = useState('');
  const { refreshWorkouts } = route.params;
  const { addWorkout, loading, error } = useAddWorkout();

  const handleAddWorkout = async () => {
    const success = await addWorkout(workoutName, refreshWorkouts);
    if (success) {
      navigation.goBack(); // Navigate back to the previous screen
    }
  };

  return (
    <Container>
      {error && <Title className="text-red-500">{error}</Title>}
      <Input
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
        className="mb-5"
        editable={!loading} // Disable input while loading
      />
      <Button title="Add Workout" onPress={handleAddWorkout} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#00C87C" />}
    </Container>
  );
};

export default AddWorkout;
