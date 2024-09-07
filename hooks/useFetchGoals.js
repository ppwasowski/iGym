import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utility/supabase';

const useFetchGoals = (userId) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals data
  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .select(`
          id,
          metric_type,
          target_value,
          current_value,
          goal_categories (name),
          exercises (name)
        `)
        .eq('user_id', userId);

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
  }, [userId]);

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Return fetchGoals so that it can be manually triggered
  return { goals, loading, error, setGoals, refreshGoals: fetchGoals };
};

export default useFetchGoals;
