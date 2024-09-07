import { useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext'; // Import the UserContext

const useFetchGoals = () => {
  const { profile } = useContext(UserContext); // Access the profile from the UserContext
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals data
  const fetchGoals = useCallback(async () => {
    if (!profile || !profile.id) return; // Make sure profile is available

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
          exercises (name),
          workout (name)   // Fetch associated workout name
        `)
        .eq('user_id', profile.id); // Use profile.id from context

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

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Return fetchGoals so that it can be manually triggered
  return { goals, loading, error, setGoals, refreshGoals: fetchGoals };
};

export default useFetchGoals;
