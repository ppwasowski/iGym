import { supabase } from "@/utility/supabase";

export const checkAndUpdateGoals = async (userId, progress) => {
  try {
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('achieved', false);

    if (goalsError) {
      console.error('Error fetching goals:', goalsError);
      return null;
    }
    
    const { data: workoutProgress, error: workoutError } = await supabase
      .from('workout_progress')
      .select('*')
      .eq('user_id', userId);

    if (workoutError) {
      console.error('Error fetching workout progress:', workoutError);
      return null;
    }

    const { data: workoutSessions, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true);

    if (sessionError) {
      console.error('Error fetching workout sessions:', sessionError);
      return null;
    }

    let achievedGoal = null;
    const updates = [];

    for (const goal of goals) {
      let goalAchieved = false;
      let updatedValue = goal.current_value;

      for (const progressItem of workoutProgress) {
        if (goal.exercise_id === progressItem.exercise_id) {
          if (goal.metric_type === 'weight') {
            updatedValue = Math.max(updatedValue, progressItem.weight);
            if (updatedValue >= goal.target_value) {
              updatedValue = goal.target_value;
              goalAchieved = true;
            }
          } else if (goal.metric_type === 'reps') {
            updatedValue = Math.max(updatedValue, progressItem.reps);
            if (updatedValue >= goal.target_value) {
              updatedValue = goal.target_value;
              goalAchieved = true;
            }
          }
        }
      }

      if (goal.workout_id) {
        const completedSessions = workoutSessions.filter(
          session => session.workout_id === goal.workout_id
        ).length;

        updatedValue = Math.min(completedSessions, goal.target_value);

        if (updatedValue >= goal.target_value) {
          updatedValue = goal.target_value;
          goalAchieved = true;
        }
      }

      if (goalAchieved && !achievedGoal) {
        achievedGoal = goal;  
      }

      if (updatedValue !== goal.current_value || goalAchieved) {
        updates.push({
          id: goal.id,
          current_value: updatedValue,
          achieved: goalAchieved,
        });
      }
    }

    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('goals')
        .upsert(updates, { onConflict: ['id'] });

      if (updateError) {
        console.error('Error updating goals:', updateError);
        return null;
      }
    }

    return achievedGoal;
  } catch (error) {
    console.error('Error processing goals:', error);
    return null;
  }
};
