import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utility/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import Container from '../components/Container';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';

const ExerciseItem = styled(View, 'flex-row items-center justify-between p-3 border-b border-Separator');
const ExerciseName = styled(Text, 'text-Text text-lg');
const IconButton = styled(Ionicons, 'text-2xl');

const ExerciseSession = ({ route }) => {
  const { workoutId, sessionId, session, refresh } = route.params;
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!workoutId || !sessionId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Workout ID or Session ID is missing',
      });
      setError('Workout ID or Session ID is missing');
      return;
    }

    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_exercise')
          .select('*, exercises(name)')
          .eq('workout_id', workoutId);

        if (error) {
          throw error;
        } else {
          setExercises(data);
          const { data: progressData, error: progressError } = await supabase
            .from('workout_progress')
            .select('exercise_id')
            .eq('workout_session_id', sessionId);

          if (progressError) {
            throw progressError;
          } else {
            setCompletedExercises(progressData.map(item => item.exercise_id));
          }
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error fetching exercises',
          text2: error.message,
        });
        setError(error.message);
      }
    };

    fetchExercises();
  }, [workoutId, sessionId]);

  const markExerciseCompleted = (exerciseId) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
  };

  const startExercise = (exerciseId, exerciseName) => {
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
    <Container className="flex-1 p-4">
      {error && <Toast />}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => startExercise(item.exercise_id, item.exercises.name)}>
            <ExerciseItem>
              <ExerciseName style={{ textDecorationLine: completedExercises.includes(item.exercise_id) ? 'line-through' : 'none' }}>
                {item.exercises.name}
              </ExerciseName>
              {completedExercises.includes(item.exercise_id) && (
                <IconButton name="checkmark-circle" color="green" />
              )}
            </ExerciseItem>
          </TouchableOpacity>
        )}
      />
      <Button title="Finish Workout" onPress={handleFinishWorkout} />
      <Toast />
    </Container>
  );
};

export default ExerciseSession;
