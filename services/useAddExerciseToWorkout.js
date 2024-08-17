import { useState } from 'react';
import { supabase } from '../utility/supabase';

const useAddExerciseToWorkout = (workouts, setWorkouts) => {
  const [error, setError] = useState(null);

  const addExerciseToWorkout = async (workoutId, exerciseId) => {
    try {
      const existingWorkout = workouts.find(workout => workout.id === workoutId);

      if (!existingWorkout) {
        const errorMessage = 'Workout not found';
        setError(errorMessage);
        return;
      }

      const isExerciseInWorkout = existingWorkout.workout_exercise.some(we => we.exercise_id === exerciseId);

      if (isExerciseInWorkout) {
        const errorMessage = 'Exercise is already in the workout';
        setError(errorMessage);
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

      // Update the workouts state
      setWorkouts(workouts.map(workout =>
        workout.id === workoutId
          ? { ...workout, workout_exercise: [...workout.workout_exercise, { exercise_id: exerciseId }] }
          : workout
      ));
    } catch (error) {
      const errorMessage = error.message || 'Error adding exercise to workout';
      console.error('Error adding exercise to workout:', errorMessage);
      setError(errorMessage);
    }
  };

  return { addExerciseToWorkout, error };
};

export default useAddExerciseToWorkout;
