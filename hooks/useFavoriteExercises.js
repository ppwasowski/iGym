// hooks/useFavoriteExercises.js
import { useState, useEffect, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const useFavoriteExercises = () => {
  const { profile } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteExercises = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            exercise_id,
            exercises (
              id,
              name
            )
          `)
          .eq('user_id', profile.id);
          
        if (error) {
          throw error;
        }

        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorite exercises:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteExercises();
    
  }, [profile]);

  const toggleFavorite = async (exerciseId) => {
    try {
      if (!profile) {
        console.error('No user ID found');
        return;
      }

      const existingFavorite = favorites.find(fav => fav.exercise_id === exerciseId);

      if (existingFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', profile.id)
          .eq('exercise_id', exerciseId);

        if (error) {
          throw error;
        }

        setFavorites(favorites.filter(fav => fav.exercise_id !== exerciseId));
        ToastShow('error','Exercise removed from favorites');
      } else {
        const { data, error } = await supabase.from('favorites').insert([
          { user_id: profile.id, exercise_id: exerciseId }
        ]);

        if (error) {
          throw error;
        }

        setFavorites([...favorites, { exercise_id: exerciseId, exercises: data[0] }]);
        ToastShow('success','Exercise added to favorites');
      }
    } catch (error) {
      console.error('Error toggling exercise favorite:', error.message);
    }
  };

  return { favorites, loading, error, toggleFavorite };
};

export default useFavoriteExercises;
