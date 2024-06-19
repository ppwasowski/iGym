import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchWorkoutProgress = (sessionId) => {
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        console.log('Fetching progress for sessionId:', sessionId);

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

        console.log('Fetched Progress:', data);
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setError(error.message);
      }
    };

    fetchProgress();
  }, [sessionId]);

  return { progress, error };
};

export default useFetchWorkoutProgress;
