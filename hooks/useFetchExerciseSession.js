import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchExerciseSession = (workoutId, sessionId) => {
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!workoutId || !sessionId) {
        setError('Workout ID or Session ID is missing');
        setLoading(false);
        return;
      }

      try {
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('workout_exercise')
          .select('*, exercises(name)')
          .eq('workout_id', workoutId);

        if (exercisesError) {
          throw exercisesError;
        }

        const { data: progressData, error: progressError } = await supabase
          .from('workout_progress')
          .select('exercise_id')
          .eq('workout_session_id', sessionId);

        if (progressError) {
          throw progressError;
        }

        setExercises(exercisesData);
        setCompletedExercises(progressData.map(item => item.exercise_id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [workoutId, sessionId]);

  return { exercises, completedExercises, loading, error };
};

export default useFetchExerciseSession;
