import { useState } from 'react';
import { supabase } from '../utility/supabase';
import { useNavigation } from '@react-navigation/native';

const useStartWorkout = (workoutId, userId) => {
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  

  const startWorkout = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{ workout_id: workoutId, user_id: userId, session_date: new Date() }])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Session creation failed');
      }

      navigation.navigate('ExerciseSession', { workoutId: data.workout_id, sessionId: data.id });
    } catch (error) {
      console.error('Error starting workout session:', error.message);
      setError('Error starting workout session');
    }
  };

  return { startWorkout, error };
};

export default useStartWorkout;
