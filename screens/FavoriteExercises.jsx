import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../utility/supabase';

const FavoriteExercises = ({ route }) => {
  const { session } = route.params;
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*, exercises(*)')
          .eq('user_id', session.user.id);

        if (error) throw error;
        setFavorites(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFavorites();
  }, [session.user.id]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.exercises.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FavoriteExercises;
