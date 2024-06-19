import { useState } from 'react';
import { supabase } from '../utility/supabase';

const useFinishExercise = (sets, setSets) => {
  const [error, setError] = useState(null);

  const finishExercise = async (sessionId, exerciseId, markExerciseCompleted, navigation) => {
    try {
      console.log('Inserting sets:', sets);

      if (!sessionId || !exerciseId) {
        console.error('sessionId or exerciseId is undefined');
        return;
      }

      const { data: existingSets, error: existingSetsError } = await supabase
        .from('workout_progress')
        .select('*')
        .eq('workout_session_id', sessionId)
        .eq('exercise_id', exerciseId);

      if (existingSetsError) {
        console.error('Error fetching existing sets:', existingSetsError);
        return;
      }

      const newSets = sets.filter(set => 
        !existingSets.some(existingSet => 
          existingSet.sets === set.setNumber && 
          existingSet.reps === set.reps && 
          existingSet.weight === set.weight
        )
      );

      if (newSets.length === 0) {
        console.log('No new sets to insert.');
        markExerciseCompleted(exerciseId);
        navigation.goBack();
        return;
      }

      const { data, error } = await supabase
        .from('workout_progress')
        .insert(
          newSets.map(set => ({
            workout_session_id: sessionId,
            exercise_id: exerciseId,
            sets: set.setNumber,
            reps: set.reps,
            weight: set.weight,
            completed_at: new Date(),
          }))
        );

      if (error) {
        console.error('Error finishing exercise:', error.details || error.message || error);
      } else {
        console.log('Exercise Finished!', data);
        setSets([]);
        markExerciseCompleted(exerciseId); // Mark exercise as completed
        navigation.goBack(); // Navigate back to ExerciseSession screen
      }
    } catch (error) {
      console.error('Error finishing exercise (catch block):', error.details || error.message || error);
      setError(error.message || 'Error finishing exercise');
    }
  };

  return { finishExercise, error, setError };
};

export default useFinishExercise;
