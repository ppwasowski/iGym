import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utility/supabase';

const useFetchWorkoutHistory = (userId) => {
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const fetchWorkoutHistory = useCallback(async () => {
    if (!userId) {
      setError('User ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          workout_id,
          session_date,
          workout (
            name
          )
        `)
        .eq('user_id', userId)
        .order('session_date', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData = data.map((session) => ({
        workout_session_id: session.id,
        date: new Date(session.session_date).toLocaleDateString(),
        workout_name: session.workout ? session.workout.name : 'Unknown Workout',
      }));

      setWorkoutSessions(formattedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWorkoutHistory();
  }, [userId, refreshFlag, fetchWorkoutHistory]);

  const refresh = () => setRefreshFlag((prev) => !prev);

  return { workoutSessions, loading, error, refresh };
};

export default useFetchWorkoutHistory;
