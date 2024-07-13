import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoriteContext';

const FavoriteExercises = () => {
  const { favorites, toggleFavorite, loading, error } = useFavorites();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text>No favorite exercises found.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.exercises.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item.exercise_id)}>
                <Ionicons name="heart" size={24} color="black" />
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
  },
});

export default FavoriteExercises;
