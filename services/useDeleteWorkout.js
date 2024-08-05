import { useState } from 'react';
import { supabase } from '../utility/supabase';
import Toast from 'react-native-toast-message';

const useDeleteWorkout = () => {
  const [error, setError] = useState(null);

  const deleteWorkout = async (workoutId, refreshWorkouts) => {
    try {
      const { error } = await supabase
        .from('workout')
        .delete()
        .eq('id', workoutId);

      if (error) {
        throw error;
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Workout deleted successfully',
      });

      if (refreshWorkouts) {
        refreshWorkouts();
      }
    } catch (error) {
      setError(error.message);
      Toast.show({
        type: 'error',
        text1: 'Error deleting workout',
        text2: error.message,
      });
    }
  };

  return { deleteWorkout, error };
};

export default useDeleteWorkout;
