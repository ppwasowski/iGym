import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';

const WorkoutProgress = ({ route }) => {
  const { sessionId } = route.params; // Ensure sessionId is passed in route params
  const navigation = useNavigation();
  const { progress, error } = useFetchWorkoutProgress(sessionId);

  if (error) {
    return <Text>{error}</Text>;
  }

  const navigateToWorkoutList = () => {
    navigation.navigate('WorkoutList'); // Navigate to the workout list to start a new workout
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={progress}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              Exercise: {item.exercises ? item.exercises.name : 'N/A'}
            </Text>
            <Text>Sets: {item.sets}</Text>
            <Text>Reps: {item.reps}</Text>
            <Text>Weight: {item.weight} kg</Text>
            <Text>Completed At: {item.completed_at ? new Date(item.completed_at).toLocaleString() : 'N/A'}</Text>
          </View>
        )}
      />
      <Button title="Finish" onPress={navigateToWorkoutList} />
    </View>
  );
};

export default WorkoutProgress;
