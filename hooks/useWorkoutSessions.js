import { useState, useEffect, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const useWorkoutSessions = () => {
  const { profile } = useContext(UserContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!profile) return;

      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', profile.id)
          .order('session_date', { ascending: false })
          .limit(1);

        if (error) throw error;

        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [profile]);
  return { sessions, loading, error };
};

export default useWorkoutSessions;
