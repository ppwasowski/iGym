import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';
import Toast from 'react-native-toast-message';

const useFetchWorkoutProgress = (sessionId) => {
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        Toast.show({
          type: 'info',
          text1: 'Fetching',
          text2: `Fetching progress for sessionId: ${sessionId}`,
        });

        if (!sessionId) {
          throw new Error('sessionId is undefined');
        }

        const { data, error } = await supabase
          .from('workout_progress')
          .select(`
            id,
            workout_session_id,
            exercise_id,
            sets,
            reps,
            weight,
            completed_at,
            exercises (
              id,
              name
            )
          `)
          .eq('workout_session_id', sessionId);

        if (error) {
          throw error;
        }

        setProgress(data);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Progress fetched successfully',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error fetching progress',
          text2: error.message,
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [sessionId]);

  return { progress, error, loading };
};

export default useFetchWorkoutProgress;
