import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';
import Toast from 'react-native-toast-message';

const useFetchExerciseProgress = (sessionId, exerciseId) => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId && exerciseId) {
      fetchProgress();
    }
  }, [sessionId, exerciseId]);

  return { sets, setSets, loading, error, refresh: fetchProgress };
};

export default useFetchExerciseProgress;
