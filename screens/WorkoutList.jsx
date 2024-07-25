import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';
import Toast from 'react-native-toast-message';
import Button from '../components/Button';
import { styled } from 'nativewind';
import Container from '../components/Container';


const WorkoutList = ({ route }) => {
  const { session } = route.params;
  const userId = session?.user?.id;
  const navigation = useNavigation();
  const { data: workouts, error, refresh } = useFetchExercisesForContext({ userId });

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return <Text className="text-Text">Error: {error}</Text>;
  }

  const refreshWorkouts = async () => {
    await refresh();
  };

  return (
    <Container>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.id, workoutName: item.name, userId })}
          >
            <Container className="p-5 border-b border-Separator">
              <Text className="text-Text text-lg">{item.name}</Text>
            </Container>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Workout" onPress={() => navigation.navigate('AddWorkout', { userId, refreshWorkouts })} />
    </Container>
  );
};

export default WorkoutList;
