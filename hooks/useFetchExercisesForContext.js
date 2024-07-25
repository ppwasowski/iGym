import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';
import Toast from 'react-native-toast-message';

const useFetchExercisesForContext = ({ userId, bodypartId, workoutId }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      let result;

      if (bodypartId) {
        result = await supabase
          .from('exercises')
          .select('*')
          .eq('bodypart_id', bodypartId);
      } else if (workoutId) {
        result = await supabase
          .from('workout_exercise')
          .select('*, exercises(name)')
          .eq('workout_id', workoutId);
      } else if (userId) {
        result = await supabase
          .from('workout')
          .select('*, workout_exercise(exercise_id)')
          .eq('user_id', userId);
      } else {
        const errorMessage = 'Either userId, bodypartId, or workoutId must be provided';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
        });
        return;
      }

      const { data, error } = result;

      if (error) {
        throw error;
      } else {
        setData(data);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching data',
        text2: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, bodypartId, workoutId]);

  return { data, error, setData, setError, refresh: fetchData };
};

export default useFetchExercisesForContext;
