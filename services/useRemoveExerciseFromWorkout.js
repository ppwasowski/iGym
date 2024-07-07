import { useState } from 'react';
import { supabase } from '../utility/supabase';
import ToastShow from '../components/ToastShow';

const useRemoveExerciseFromWorkout = (workouts, setWorkouts) => {
  const [error, setError] = useState(null);

  const removeExerciseFromWorkout = async (workoutId, exerciseId) => {
    try {
      console.log('Removing exercise:', { workoutId, exerciseId });

      const { data, error } = await supabase.from('workout_exercise')
        .delete()
        .eq('workout_id', workoutId)
        .eq('exercise_id', exerciseId)
        .select('*'); // Ensure the response includes the deleted rows

      if (error) {
        throw error;
      }

      console.log('Deleted rows:', data);

      // Update the workouts state
      setWorkouts(workouts.map(workout =>
        workout.id === workoutId
          ? { ...workout, workout_exercise: workout.workout_exercise.filter(exercise => exercise.exercise_id !== exerciseId) }
          : workout
      ));

      ToastShow('success', 'Success', 'Exercise removed from workout');
    } catch (error) {
      console.error('Error removing exercise from workout:', error);
      setError('Error removing exercise from workout');
    }
  };

  return { removeExerciseFromWorkout, error, setError };
};

export default useRemoveExerciseFromWorkout;
