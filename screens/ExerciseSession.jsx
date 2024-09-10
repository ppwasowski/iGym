import React, { useState, useEffect, useContext } from 'react';  
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetchExerciseSession from '../hooks/useFetchExerciseSession'; 
import Button from '../components/Button';
import Container from '../components/Container';
import Toast from 'react-native-toast-message';
import { UserContext } from '../context/UserContext';
import { checkAndUpdateGoals } from '../components/CheckAndUpdateGoals';
import { supabase } from '@/utility/supabase';
import { styled } from 'nativewind';

const ExerciseItem = styled(View, 'flex-row items-center justify-between p-3 border-b border-Separator');
const ExerciseName = styled(Text, 'text-Text text-lg capitalize');
const IconButton = styled(Ionicons, 'text-2xl');

const ExerciseSession = ({ route }) => {
  const { workoutId, sessionId, session, refresh } = route.params;
  const navigation = useNavigation();
  const { profile } = useContext(UserContext); 
  const userId = profile?.id;

  const [completedExercises, setCompletedExercises] = useState([]);
  const [goalAchievedModalVisible, setGoalAchievedModalVisible] = useState(false); 
  const [achievedGoal, setAchievedGoal] = useState(null);

  useEffect(() => {
    if (!workoutId || !sessionId) {
      console.error('Workout ID or Session ID is missing:', { workoutId, sessionId });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Workout ID or Session ID is missing. Please try again.',
      });
    }
  }, [workoutId, sessionId]);

  const { exercises, loading, error } = useFetchExerciseSession(workoutId, sessionId);

  const markExerciseCompleted = (exerciseId) => {
    setCompletedExercises(prev => [...prev, exerciseId]);
  };

  const startExercise = (exerciseId, exerciseName) => {
    navigation.navigate('ExerciseWorkout', {
      workoutId,
      exerciseId,
      exerciseName,
      sessionId,
      markExerciseCompleted,
      session,
    });
  };

  const handleFinishWorkout = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({ completed: true })
        .eq('id', sessionId);
  
      if (error) {
        console.error('Error updating workout session:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to mark workout as complete. Please try again.',
        });
        return;
      }
  
      if (refresh) {
        refresh();
      }
  
      const workoutProgress = {
        workoutCompleted: true,
        exercises: completedExercises.map(exerciseId => ({
          exercise_id: exerciseId,
          weight: 0,
          reps: 0,
        })),
      };
  
      const goalAchieved = await checkAndUpdateGoals(userId, workoutProgress);
  
      // Navigate to WorkoutProgress, passing the achieved goal if any
      navigation.navigate('WorkoutProgress', {
        workoutId,
        sessionId,
        from: 'ExerciseSession',
        goalAchieved, // Pass the achieved goal data
      });
    } catch (error) {
      console.error('Error completing workout:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to finish workout. Please try again.',
      });
    }
  };

  const handleModalClose = () => {
    setGoalAchievedModalVisible(false);
    navigation.navigate('WorkoutProgress', { workoutId, sessionId, from: 'ExerciseSession' });
  };

  if (loading) {
    return (
      <Container className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-Text text-base mt-4">Loading exercises...</Text>
      </Container>
    );
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  return (
    <Container className="flex-1 p-4">
      {exercises.length === 0 ? (
        <Text className="text-Text text-base mt-4">No exercises found.</Text>
      ) : (
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
      )}
      <Button title="Finish Workout" onPress={handleFinishWorkout} />

      

      <Toast />
    </Container>
  );
};

export default ExerciseSession;
