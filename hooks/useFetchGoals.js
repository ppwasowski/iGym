import { useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const useFetchGoals = () => {
  const { profile } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchGoals = useCallback(async () => {
    if (!profile || !profile.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .select(`
          id,
          metric_type,
          target_value,
          current_value,
          achieved,
          goal_categories (name),
          exercises (name),
          workout (name)   // Fetch associated workout name
        `)
        .eq('user_id', profile.id);
      if (error) {
        setError(error.message);
      } else {
        setGoals(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, loading, error, setGoals, refreshGoals: fetchGoals };
};

export default useFetchGoals;
