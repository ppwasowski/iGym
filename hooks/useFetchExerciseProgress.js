import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';
import Toast from 'react-native-toast-message';

const useFetchExerciseProgress = (sessionId, exerciseId) => {
  const [sets, setSets] = useState([]);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_progress')
        .select('id, sets, reps, weight')
        .eq('workout_session_id', sessionId)
        .eq('exercise_id', exerciseId)
        .order('sets', { ascending: true });

      if (error) throw error;

      setSets(data);
    } catch (error) {
      setError(error.message);
      Toast.show({
        type: 'error',
        text1: 'Error fetching progress',
        text2: error.message,
      });
    }
  };

  useEffect(() => {
    if (sessionId && exerciseId) {
      fetchProgress();
    }
  }, [sessionId, exerciseId]);

  return { sets, setSets, error, refresh: fetchProgress };
};

export default useFetchExerciseProgress;
