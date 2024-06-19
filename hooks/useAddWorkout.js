import { useState } from 'react';
import { supabase } from '../utility/supabase';

const useAddWorkout = () => {
  const [error, setError] = useState(null);

  const addWorkout = async (workoutName, refreshWorkouts) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not found');
        setError('User not found');
        return;
      }

      const { data, error } = await supabase
        .from('workout')
        .insert([
          { name: workoutName, user_id: user.id },
        ])
        .single();

      if (error) {
        throw error;
      }

      console.log('Workout added:', data);
      refreshWorkouts(); // Refresh the workouts list
    } catch (error) {
      console.error('Error adding workout:', error);
      setError(error.message);
    }
  };

  return { addWorkout, error };
};

export default useAddWorkout;
