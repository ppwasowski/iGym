const checkAndUpdateGoals = async (userId, progress) => {
    try {
      // Step 1: Fetch all goals for this user
      const { data: goals, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);
  
      if (error) {
        console.error('Error fetching goals:', error);
        return;
      }
  
      // Step 2: Loop through goals and compare with workout progress
      for (const goal of goals) {
        let goalCompleted = false;
  
        // Check for different categories
        if (goal.metric_type === 'weight' && progress.exercise_id === goal.exercise_id) {
          // Compare weight progress
          if (progress.weight >= goal.target_value) {
            goalCompleted = true;
          }
        } else if (goal.metric_type === 'reps' && progress.exercise_id === goal.exercise_id) {
          // Compare reps progress
          if (progress.reps >= goal.target_value) {
            goalCompleted = true;
          }
        } else if (goal.category_id === workoutCompletionCategoryId) {
          if (progress.workoutCompleted) {
            goalCompleted = true;
          }
        }
        if (goalCompleted) {
          await supabase
            .from('goals')
            .update({ current_value: goal.target_value, completed: true })
            .eq('id', goal.id);
        }
      }
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };
  