import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const FavoriteExercisesList = ({ favorites, loading, error }) => {
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
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

export default FavoriteExercisesList;
