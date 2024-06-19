import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchExerciseProgress = (sessionId, exerciseId) => {
  const [sets, setSets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseProgress = async () => {
      try {
        console.log(`Fetching progress for sessionId: ${sessionId}, exerciseId: ${exerciseId}`);

        if (!sessionId || !exerciseId) {
          console.error('sessionId or exerciseId is undefined');
          return;
        }

        const { data, error } = await supabase
          .from('workout_progress')
          .select('*')
          .eq('workout_session_id', sessionId)
          .eq('exercise_id', exerciseId);

        if (error) {
          console.error('Error fetching exercise progress:', error);
          setError(error.message);
        } else {
          console.log('Fetched Progress:', data);
          setSets(data.map(item => ({
            id: item.id,
            setNumber: item.sets,
            weight: item.weight,
            reps: item.reps,
          })));
        }
      } catch (error) {
        console.error('Error fetching exercise progress:', error);
        setError(error.message);
      }
    };

    fetchExerciseProgress();
  }, [exerciseId, sessionId]);

  return { sets, setSets, error };
};

export default useFetchExerciseProgress;
