import { useState, useEffect, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const useStats = () => {
  const { profile } = useContext(UserContext);
  const [stats, setStats] = useState({
    maxCarriedWeight: 0,
    totalWeightCarried: 0,
    maxRepsDone: 0,
    numberOfWorkouts: 0,
    maxWeightExercise: null,
    maxRepsExercise: null,
    maxWeightSessionId: null,
    maxRepsSessionId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);
        setError(null); // Reset error state

        // Fetch weight data along with session_id
        const { data: weightData, error: weightError } = await supabase
          .from('workout_progress')
          .select('exercise_id, weight, reps, workout_session_id')
          .eq('user_id', profile.id);

        if (weightError) throw weightError;

        let maxCarriedWeight = 0;
        let totalWeightCarried = 0;
        let maxRepsDone = 0;
        let maxWeightExercise = null;
        let maxRepsExercise = null;
        let maxWeightSessionId = null;
        let maxRepsSessionId = null;

        weightData.forEach((record) => {
          totalWeightCarried += record.weight * record.reps;

          if (record.weight > maxCarriedWeight) {
            maxCarriedWeight = record.weight;
            maxWeightExercise = record.exercise_id;
            maxWeightSessionId = record.workout_session_id;
          }

          if (record.reps > maxRepsDone) {
            maxRepsDone = record.reps;
            maxRepsExercise = record.exercise_id;
            maxRepsSessionId = record.workout_session_id;
          }
        });

        const { data: workoutData, error: workoutError } = await supabase
          .from('workout_sessions')
          .select('id')
          .eq('user_id', profile.id);

        if (workoutError) throw workoutError;

        const numberOfWorkouts = workoutData.length;

        setStats({
          maxCarriedWeight,
          totalWeightCarried,
          maxRepsDone,
          numberOfWorkouts,
          maxWeightExercise,
          maxRepsExercise,
          maxWeightSessionId,
          maxRepsSessionId,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile]);

  return { stats, loading, error };
};

export default useStats;
