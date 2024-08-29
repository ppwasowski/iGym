import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useFetchGoalsAdding = () => {
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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

        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workout')
          .select('*');

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
  }, []);

  return { categories, exercises, bodyParts, workouts, loading, error };
};

export default useFetchGoalsAdding;
