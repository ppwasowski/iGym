import { useState, useEffect, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const useFetchGoalsAdding = () => {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user profile data from UserContext
  const { profile, loading: profileLoading, error: profileError } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile || profileLoading || profileError) {
        return;
      }
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('goal_categories')
          .select('*');

        if (categoriesError) throw categoriesError;

        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*');

        if (exercisesError) throw exercisesError;

        const { data: bodyPartsData, error: bodyPartsError } = await supabase
          .from('bodypart')
          .select('*');

        if (bodyPartsError) throw bodyPartsError;

        setCategories(categoriesData);
        setExercises(exercisesData);
        setBodyParts(bodyPartsData);

        // Fetch workouts specific to the logged-in user
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workout')
          .select('*')
          .eq('user_id', profile.id)  // Access user_id from context profile
          .neq('deleted', true);  // Exclude rows where 'deleted' is true

        if (workoutsError) {
          console.warn('Workouts table not found, skipping workouts:', workoutsError);
        } else {
          setWorkouts(workoutsData);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, profileLoading, profileError]); // Re-run the hook when profile or its state changes

  return { categories, exercises, bodyParts, workouts, loading, error };
};

export default useFetchGoalsAdding;
