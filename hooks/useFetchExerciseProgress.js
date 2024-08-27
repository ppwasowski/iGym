import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchExerciseProgress = (sessionId, exerciseId) => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!sessionId || !exerciseId) throw new Error('Session ID or Exercise ID is missing');

        const { data, error } = await supabase
          .from('workout_progress')
          .select('*')
          .eq('workout_session_id', sessionId)
          .eq('exercise_id', exerciseId);

        if (error) throw new Error('Error fetching exercise progress: ' + error.message);

        setSets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseProgress();
  }, [sessionId, exerciseId]);

  return { sets, setSets, loading, error };
};

export default useFetchExerciseProgress;
