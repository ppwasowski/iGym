import { useState } from 'react';
import { supabase } from '../utility/supabase';
import ToastShow from '../components/ToastShow';

const useAddExerciseToWorkout = (workouts, setWorkouts) => {
  const [error, setError] = useState(null);

  const addExerciseToWorkout = async (workoutId, exerciseId) => {
    try {
      console.log('Workouts:', workouts);
      const existingWorkout = workouts.find(workout => workout.id === workoutId);

      if (!existingWorkout) {
        setError('Workout not found');
        ToastShow('error', 'Error', 'Workout not found');
        return;
      }

      const isExerciseInWorkout = existingWorkout.workout_exercise.some(we => we.exercise_id === exerciseId);

      if (isExerciseInWorkout) {
        ToastShow('error', 'Error', 'Exercise is already in the workout');
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

      ToastShow('success', 'Success', 'Exercise added to workout');
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
      setError('Error adding exercise to workout');
    }
  };

  return { addExerciseToWorkout, error };
};

export default useAddExerciseToWorkout;
