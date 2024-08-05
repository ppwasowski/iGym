import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import useAddWorkout from '../services/useAddWorkout';
import Button from '../components/Button';
import Input from '../components/Input'; // Import your custom Input component

const Container = styled(View, 'flex-1 p-5 bg-background');
const Title = styled(Text, 'text-3xl text-Text mb-4');

const AddWorkout = ({ navigation, route }) => {
  const [workoutName, setWorkoutName] = useState('');
  const { refreshWorkouts } = route.params;
  const { addWorkout, error } = useAddWorkout();

  const handleAddWorkout = async () => {
    await addWorkout(workoutName, refreshWorkouts);
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <Container>
      {error && <Title className="text-red-500">{error}</Title>}
      <Input
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
        className="mb-5"
      />
      <Button title="Add Workout" onPress={handleAddWorkout} />
    </Container>
  );
};

export default AddWorkout;
