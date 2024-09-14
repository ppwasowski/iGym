import { useState } from 'react';
import { supabase } from '../utility/supabase';

const useAddWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addWorkout = async ({ workoutName, iconName, iconColor }, refreshWorkouts) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not found');
      }

      const { data, error } = await supabase
        .from('workout')
        .insert([
          { 
            name: workoutName, 
            user_id: user.id, 
            icon_name: iconName,
            icon_color: iconColor
          }
        ])
        .single();

      if (error) {
        throw error;
      }

      if (refreshWorkouts) {
        refreshWorkouts(data);
      }

      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addWorkout, loading, error };
};

export default useAddWorkout;
