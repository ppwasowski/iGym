import { supabase } from '../utility/supabase';

export const checkAndUpdateGoals = async (userId, progress) => {
  try {
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('achieved', false);

    if (goalsError) {
      console.error('Error fetching goals:', goalsError);
      return;
    }
    const { data: workoutProgress, error: workoutError } = await supabase
      .from('workout_progress')
      .select('*')
      .eq('user_id', userId);
    if (workoutError) {
      console.error('Error fetching workout progress:', workoutError);
      return;
    }

    const { data: workoutSessions, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true);

    if (sessionError) {
      console.error('Error fetching workout sessions:', sessionError);
      return;
    }

    const updates = [];  // To store all updates for bulk updating later

    // Loop through goals and compare with workout progress and workout session data
    for (const goal of goals) {
      let goalAchieved = false;
      let updatedValue = goal.current_value;  // Default to current value

      // Compare workout progress with goals for max weight and reps
      for (const progressItem of workoutProgress) {
        if (goal.exercise_id === progressItem.exercise_id) {
          // Check if goal is based on weight progress
          if (goal.metric_type === 'weight') {
            updatedValue = Math.max(updatedValue, progressItem.weight);
            if (updatedValue >= goal.target_value) {
              updatedValue = goal.target_value;  // Cap at target value
              goalAchieved = true;
            }
          }
          // Check if goal is based on reps progress
          else if (goal.metric_type === 'reps') {
            updatedValue = Math.max(updatedValue, progressItem.reps);
            if (updatedValue >= goal.target_value) {
              updatedValue = goal.target_value;  // Cap at target value
              goalAchieved = true;
            }
          }
        }
      }

      if (goal.workout_id) {
        const completedSessions = workoutSessions.filter(
          session => session.workout_id === goal.workout_id
        ).length;

        // Update the goal's current value with the number of completed sessions
        updatedValue = Math.min(completedSessions, goal.target_value);

        // If target is met or exceeded, mark the goal as achieved
        if (updatedValue >= goal.target_value) {
          updatedValue = goal.target_value;  // Cap at target value
          goalAchieved = true;
        }
      }

      if (updatedValue !== goal.current_value || goalAchieved) {
        updates.push({
          id: goal.id,
          current_value: updatedValue,
          achieved: goalAchieved,
        });
      }
    }

    // Bulk update all goals that have changed
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('goals')
        .upsert(updates, { onConflict: ['id'] }); 

      if (updateError) {
        console.error('Error updating goals:', updateError);
      } else {
        console.log('Goals updated successfully!');
      }
    }

  } catch (error) {
    console.error('Error processing goals:', error);
  }
};
