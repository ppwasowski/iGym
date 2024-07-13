import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const FavoriteExercises = () => {
  const { user, loading: userLoading, error: userError } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteExercises = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching favorite exercises for user ID:', user.id);

        const { data, error } = await supabase
          .from('favorites')
          .select(`
            exercise_id,
            exercises (
              id,
              name
            )
          `)
          .eq('user_id', user.id);
          

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('No data found');
        } else {
          console.log('Fetched data:', data);
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
    
  }, [user]);

  if (userLoading || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (userError || error) {
    return <Text>Error: {userError || error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Exercises</Text>
      {favorites.length === 0 ? (
        <Text>No favorite exercises found.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.exercises.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
});

export default FavoriteExercises;
