import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utility/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExerciseSession = ({ route }) => {
  const { workoutId, sessionId, session, refresh } = route.params;
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!workoutId || !sessionId) {
      console.error('Workout ID or Session ID is missing');
      setError('Workout ID or Session ID is missing');
      return;
    }

    const fetchExercises = async () => {
      try {
        console.log('Fetching exercises for workoutId:', workoutId);
        const { data, error } = await supabase
          .from('workout_exercise')
          .select('*, exercises(name)')
          .eq('workout_id', workoutId);

        if (error) {
          throw error;
        } else {
          console.log('Fetched Exercises:', data);
          setExercises(data);
          const { data: progressData, error: progressError } = await supabase
            .from('workout_progress')
            .select('exercise_id')
            .eq('workout_session_id', sessionId);

          if (progressError) {
            throw progressError;
          } else {
            console.log('Fetched Completed Exercises:', progressData);
            setCompletedExercises(progressData.map(item => item.exercise_id));
          }
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setError(error.message);
      }
    };

    fetchExercises();
  }, [workoutId, sessionId]);

  const markExerciseCompleted = (exerciseId) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
  };

  const startExercise = (exerciseId, exerciseName) => {
    console.log('Starting exercise:', exerciseId, exerciseName);
    navigation.navigate('ExerciseWorkout', {
      exerciseId,
      exerciseName,
      sessionId,
      markExerciseCompleted,
      session,
    });
  };

  const handleFinishWorkout = () => {
    if (refresh) refresh();
    navigation.navigate('WorkoutProgress', { workoutId, sessionId, from: 'ExerciseSession' });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {error && <Text>Error: {error}</Text>}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => startExercise(item.exercise_id, item.exercises.name)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <Text style={{ fontSize: 18, textDecorationLine: completedExercises.includes(item.exercise_id) ? 'line-through' : 'none' }}>
                {item.exercises.name}
              </Text>
              {completedExercises.includes(item.exercise_id) && (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Finish Workout" onPress={handleFinishWorkout} />
    </View>
  );
};

export default ExerciseSession;
