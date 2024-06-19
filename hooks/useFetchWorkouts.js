import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchWorkouts = (userId) => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workout')
          .select('*, workout_exercise(exercise_id)')
          .eq('user_id', userId);

        if (workoutsError) {
          throw workoutsError;
        } else {
          setWorkouts(workoutsData);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (userId) {
      fetchWorkouts();
    } else {
      console.error('User ID is undefined');
      setError('User ID is undefined');
    }
  }, [userId]);

  return { workouts, error, setWorkouts, setError };
};

export default useFetchWorkouts;
