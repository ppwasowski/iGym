import { useState } from 'react';
import { supabase } from '../utility/supabase';

const useFinishExercise = (sets, setSets) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const finishExercise = async (sessionId, workoutId, exerciseId, userId, markExerciseCompleted, navigation) => {
    setLoading(true);
    setError(null);

    try {
      if (!sessionId || !workoutId || !exerciseId || !userId) {
        throw new Error('Missing required parameters');
      }
      const { data: existingSets, error: existingSetsError } = await supabase
        .from('workout_progress')
        .select('sets, reps, weight, exercise_id, workout_session_id')
        .eq('workout_session_id', sessionId)
        .eq('exercise_id', exerciseId);

      if (existingSetsError) {
        throw new Error('Error fetching existing sets: ' + existingSetsError.message);
      }
      const newSets = sets.filter(set => 
        !existingSets.some(existingSet => 
          existingSet.sets === set.sets && 
          existingSet.reps === set.reps && 
          existingSet.weight === set.weight
        )
      );

      if (newSets.length === 0) {
        if (typeof markExerciseCompleted === 'function') {
          markExerciseCompleted(exerciseId);
        }
        navigation.navigate('ExerciseSession', { workoutId, sessionId });
        return;
      }
      const { data, error } = await supabase
        .from('workout_progress')
        .insert(newSets.map(set => ({
          workout_session_id: sessionId,
          exercise_id: exerciseId,
          user_id: userId,
          sets: set.sets,
          reps: set.reps,
          weight: set.weight,
          completed_at: new Date(),
        })));

      if (error) {
        throw new Error('Error inserting sets: ' + error.message);
      }
      setSets([]); 

      if (typeof markExerciseCompleted === 'function') {
        markExerciseCompleted(exerciseId);
      }

      navigation.navigate('ExerciseSession', { workoutId, sessionId });
    } catch (error) {
      setError(error.message || 'Error finishing exercise');
    } finally {
      setLoading(false);
    }
  };

  return { finishExercise, error, loading, setError };
};

export default useFinishExercise;
