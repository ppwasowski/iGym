import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchGoals = (userId) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
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
    };

    fetchGoals();
  }, [userId]);

  return { goals, loading, error, setGoals };
};

export default useFetchGoals;
