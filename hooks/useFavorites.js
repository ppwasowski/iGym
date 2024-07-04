import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('exercise_id, exercises(name)')
          .eq('user_id', supabase.auth.user().id);
        if (error) throw error;

        const favoriteExercises = data.map((fav) => ({
          id: fav.exercise_id,
          name: fav.exercises.name,
        }));

        setFavorites(favoriteExercises);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return { favorites, loading, error };
};
