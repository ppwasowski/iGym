import { useState } from 'react';
import { supabase } from '../utility/supabase';

const useFinishExercise = (sets, setSets) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const finishExercise = async (sessionId, exerciseId, userId, markExerciseCompleted, navigation) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Finish Exercise Inputs:', { sessionId, exerciseId, userId });
      console.log('Sets to insert:', sets);

      if (!sessionId) throw new Error('Session ID is required');
      if (!exerciseId) throw new Error('Exercise ID is required');
      if (!userId) throw new Error('User ID is required');

      const { data: existingSets, error: existingSetsError } = await supabase
        .from('workout_progress')
        .select('*')
        .eq('workout_session_id', sessionId)
        .eq('exercise_id', exerciseId);

      if (existingSetsError) throw new Error('Error fetching existing sets: ' + existingSetsError.message);

      const newSets = sets.filter(set => 
        !existingSets.some(existingSet => 
          existingSet.sets === set.sets && 
          existingSet.reps === set.reps && 
          existingSet.weight === set.weight
        )
      );

      console.log('New sets to insert:', newSets);

      if (newSets.length === 0) {
        console.log('No new sets to insert.');
        if (typeof markExerciseCompleted === 'function') {
          markExerciseCompleted(exerciseId);
        }
        navigation.navigate('ExerciseSession', { sessionId });
        return;
      }

      const { data, error } = await supabase
        .from('workout_progress')
        .insert(
          newSets.map(set => ({
            workout_session_id: sessionId,
            exercise_id: exerciseId,
            user_id: userId,
            sets: set.sets,
            reps: set.reps,
            weight: set.weight,
            completed_at: new Date(),
          }))
        );

      if (error) throw new Error('Error inserting sets: ' + error.message);

      console.log('Exercise Finished!', data);
      setSets([]);
      if (typeof markExerciseCompleted === 'function') {
        markExerciseCompleted(exerciseId);
      }
      navigation.navigate('ExerciseSession', { sessionId });
    } catch (error) {
      console.error('Error in finishExercise:', error.message);
      setError(error.message || 'Error finishing exercise');
    } finally {
      setLoading(false);
    }
  };

  return { finishExercise, error, loading, setError };
};

export default useFinishExercise;
