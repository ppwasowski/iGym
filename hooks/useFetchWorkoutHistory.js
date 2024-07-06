import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchWorkoutHistory = (userId) => {
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    const fetchWorkoutHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('id, workout_id, session_date')
          .eq('user_id', userId)
          .order('session_date', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedData = data.map((session) => ({
          workout_session_id: session.id,
          date: new Date(session.session_date).toLocaleDateString(),
        }));

        setWorkoutSessions(formattedData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchWorkoutHistory();
  }, [userId]);

  return { workoutSessions, error };
};

export default useFetchWorkoutHistory;
