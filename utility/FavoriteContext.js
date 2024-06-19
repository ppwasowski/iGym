// FavoriteContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utility/supabase';
import ToastShow from '../components/ToastShow';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = await getUserId();
      if (userId) {
        const { data, error } = await supabase
          .from('favorites')
          .select('exercise_id')
          .eq('user_id', userId);
        if (!error) {
          setFavorites(data.map(fav => fav.exercise_id));
        }
      }
    };

    fetchFavorites();
  }, []);

  const getUserId = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return session ? session.user.id : null;
  };

  const toggleFavorite = async (exerciseId) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      if (favorites.includes(exerciseId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('exercise_id', exerciseId);

        if (error) {
          throw error;
        }

        setFavorites(favorites.filter(id => id !== exerciseId));
        ToastShow('error','Exercise removed from favorites');
      } else {
        // Add to favorites
        const { data, error } = await supabase.from('favorites').insert([
          { user_id: userId, exercise_id: exerciseId }
        ]);

        if (error) {
          throw error;
        }

        setFavorites([...favorites, exerciseId]);
        ToastShow('success','Exercise added to favorites');
      }
    } catch (error) {
      console.error('Error toggling exercise favorite:', error.message);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
