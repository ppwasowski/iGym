import { supabase } from '../utility/supabase';
import ToastShow from '../components/ToastShow';

export const getUserId = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return session ? session.user.id : null;
};

export const toggleFavorite = async (exerciseId) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    // Check if the exercise is already in favorites
    const { data: existingFavorites, error: fetchError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId);

    if (fetchError) {
      throw fetchError;
    }

    if (existingFavorites.length > 0) {
      // Remove from favorites
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId);

      if (deleteError) {
        throw deleteError;
      }

      ToastShow('error','Exercise removed from favorites');
    } else {
      // Add to favorites
      const { data, error: insertError } = await supabase.from('favorites').insert([
        { user_id: userId, exercise_id: exerciseId }
      ]);

      if (insertError) {
        throw insertError;
      }

      ToastShow('success','Exercise added to favorites');
    }
  } catch (error) {
    console.error('Error toggling exercise favorite:', error.message);
  }
};

export const isFavorite = async (exerciseId) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return false;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId);

    if (error) {
      throw error;
    }

    return data.length > 0;
  } catch (error) {
    console.error('Error checking if exercise is favorite:', error.message);
    return false;
  }
};
