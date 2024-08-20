import { useState } from 'react';
import { supabase } from '../utility/supabase';

const useAddExerciseToWorkout = (workouts, setWorkouts) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const addExerciseToWorkout = async (workoutId, exerciseId) => {
    setLoading(true); // Set loading to true when the function starts
    setError(null);   // Reset error state before starting a new request

    try {
      const existingWorkout = workouts.find(workout => workout.id === workoutId);

      if (!existingWorkout) {
        const errorMessage = 'Workout not found';
        setError(errorMessage);
        setLoading(false); 
        return;
      }

      const isExerciseInWorkout = existingWorkout.workout_exercise.some(we => we.exercise_id === exerciseId);

      if (isExerciseInWorkout) {
        const errorMessage = 'Exercise is already in the workout';
        setError(errorMessage);
        setLoading(false); 
        return;
      }

      const { error } = await supabase.from('workout_exercise').insert([
        {
          workout_id: workoutId,
          exercise_id: exerciseId,
        },
      ]);

      if (error) {
        throw error;
      }
      
      setWorkouts(workouts.map(workout =>
        workout.id === workoutId
          ? { ...workout, workout_exercise: [...workout.workout_exercise, { exercise_id: exerciseId }] }
          : workout
      ));
    } catch (error) {
      const errorMessage = error.message || 'Error adding exercise to workout';
      console.error('Error adding exercise to workout:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { addExerciseToWorkout, error, loading };
};

export default useAddExerciseToWorkout;
