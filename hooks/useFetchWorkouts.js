import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchWorkouts = (userId) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true); 
      try {
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workout')
          .select('*, workout_exercise(exercise_id)')
          .eq('user_id', userId)
          .eq('deleted', false);

        if (workoutsError) {
          throw workoutsError;
        } else {
          setWorkouts(workoutsData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWorkouts();
    } else {
      console.error('User ID is undefined');
      setError('User ID is undefined');
      setLoading(false);
    }
  }, [userId]);

  return { workouts, loading, error, setWorkouts, setError };
};

export default useFetchWorkouts;
