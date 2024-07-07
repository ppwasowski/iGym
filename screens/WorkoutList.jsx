import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';

const WorkoutList = ({ route }) => {
  const { session } = route.params;
  const userId = session?.user?.id;
  const navigation = useNavigation();
  const { data: workouts, error } = useFetchExercisesForContext({ userId });

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('WorkoutDetails',{ workoutId: item.id, workoutName: item.name, userId })}>
            <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Workout" onPress={() => navigation.navigate('AddWorkout', { userId })} />
    </View>
  );
};

export default WorkoutList;
