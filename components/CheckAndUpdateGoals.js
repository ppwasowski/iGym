import { supabase } from '../utility/supabase';

export const checkAndUpdateGoals = async (userId, progress) => {
  try {
    // Step 1: Fetch all incomplete goals for this user
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('achieved', false);  // Only fetch incomplete goals

    if (goalsError) {
      console.error('Error fetching goals:', goalsError);
      return;
    }

    // Step 2: Fetch workout progress for this user
    const { data: workoutProgress, error: workoutError } = await supabase
      .from('workout_progress')
      .select('*')
      .eq('user_id', userId);  // Fetch workout progress for the user

    if (workoutError) {
      console.error('Error fetching workout progress:', workoutError);
      return;
    }

    // Step 3: Fetch workout session completions for this user
    const { data: workoutSessions, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true);  // Only fetch completed workout sessions

    if (sessionError) {
      console.error('Error fetching workout sessions:', sessionError);
      return;
    }

    const updates = [];  // To store all updates for bulk updating later

    // Step 4: Loop through goals and compare with workout progress and workout session data
    for (const goal of goals) {
      let goalAchieved = false;
      let updatedValue = goal.current_value;  // Default to current value

      // Step 5: Compare workout progress with goals for max weight and reps
      for (const progressItem of workoutProgress) {
        if (goal.exercise_id === progressItem.exercise_id) {
          // Check if goal is based on weight progress
          if (goal.metric_type === 'weight') {
            // Update to the maximum weight lifted, not cumulative
            updatedValue = Math.max(updatedValue, progressItem.weight);
            if (updatedValue >= goal.target_value) {
              updatedValue = goal.target_value;  // Cap at target value
              goalAchieved = true;
            }
          }
          // Check if goal is based on reps progress
          else if (goal.metric_type === 'reps') {
            // Update to the maximum reps, not cumulative
            updatedValue = Math.max(updatedValue, progressItem.reps);
            if (updatedValue >= goal.target_value) {
              updatedValue = goal.target_value;  // Cap at target value
              goalAchieved = true;
            }
          }
        }
      }

      // Step 6: Handle workout completion or consistency goals
      if (goal.workout_id) {
        // Count completed workout sessions for the goal's workout
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

      // Step 7: Add to the update list if there's new progress
      if (updatedValue !== goal.current_value || goalAchieved) {
        updates.push({
          id: goal.id,
          current_value: updatedValue,
          achieved: goalAchieved,
        });
      }
    }

    // Step 8: Bulk update all goals that have changed
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('goals')
        .upsert(updates, { onConflict: ['id'] });  // Use upsert to update multiple rows

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
