import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utility/supabase';
import Toast from 'react-native-toast-message';
import { UserContext } from './UserContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { profile } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
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
        console.error('Error fetching favorites:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [profile]);

  const toggleFavorite = async (exerciseId) => {
    if (!profile) {
      console.error('No user profile found');
      return;
    }

    try {
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
        Toast.show({
          type: 'error',
          text1: 'Exercise removed from favorites',
        });
      } else {
        const { error } = await supabase.from('favorites').insert([
          { user_id: profile.id, exercise_id: exerciseId },
        ]);

        if (error) {
          throw error;
        }

        const { data: exerciseData } = await supabase
          .from('exercises')
          .select('id, name')
          .eq('id', exerciseId)
          .single();

        setFavorites([...favorites, { exercise_id: exerciseId, exercises: exerciseData }]);
        Toast.show({
          type: 'success',
          text1: 'Exercise added to favorites',
        });
      }
    } catch (error) {
      console.error('Error toggling exercise favorite:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, loading, error }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
