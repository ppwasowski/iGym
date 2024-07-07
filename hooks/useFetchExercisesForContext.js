import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchExercisesForContext = ({ userId, bodypartId, workoutId }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      let result;

      if (bodypartId) {
        console.log('Fetching exercises for bodypartId:', bodypartId);
        result = await supabase
          .from('exercises')
          .select('*')
          .eq('bodypart_id', bodypartId);
      } else if (workoutId) {
        console.log('Fetching exercises for workoutId:', workoutId);
        result = await supabase
          .from('workout_exercise')
          .select('*, exercises(name)')
          .eq('workout_id', workoutId);
      } else if (userId) {
        console.log('Fetching workouts for userId:', userId);
        result = await supabase
          .from('workout')
          .select('*, workout_exercise(exercise_id)')
          .eq('user_id', userId);
      } else {
        console.error('Either userId, bodypartId, or workoutId must be provided');
        setError('Either userId, bodypartId, or workoutId must be provided');
        return;
      }

      const { data, error } = result;

      if (error) {
        throw error;
      } else {
        console.log('Fetched Data:', data);
        setData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, bodypartId, workoutId]);

  return { data, error, setData, setError, refresh: fetchData };
};

export default useFetchExercisesForContext;
