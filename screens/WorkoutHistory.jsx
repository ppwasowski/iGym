import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchWorkoutHistory from '../hooks/useFetchWorkoutHistory';

const WorkoutHistory = ({ session }) => {
  const { workoutSessions, error } = useFetchWorkoutHistory(session.user.id);
  const navigation = useNavigation();

  const navigateToWorkoutProgress = (sessionId) => {
    console.log('Navigating to WorkoutProgress from WorkoutHistory with sessionId:', sessionId);
    navigation.navigate('WorkoutProgress', { sessionId, from: 'WorkoutHistory' });
  };

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutSessions}
        keyExtractor={(item) => item.workout_session_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToWorkoutProgress(item.workout_session_id)}>
            <View style={styles.sessionItem}>
              <Text style={styles.sessionText}>Workout Date: {item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sessionItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  sessionText: {
    fontSize: 16,
  },
});

export default WorkoutHistory;
