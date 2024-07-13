// ExerciseDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../context/FavoriteContext';
import useExerciseDetails from '../hooks/useExerciseDetails';

const ExerciseDetails = ({ route }) => {
  const { exerciseId, workoutId } = route.params;
  const { exerciseDetails, loading, error } = useExerciseDetails(exerciseId);
  const { favorites, toggleFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setIsFavorite(favorites.some(fav => fav.exercise_id === exerciseId));
  }, [favorites, exerciseId]);

  const addExerciseToWorkout = () => {
    navigation.navigate('WorkoutSelection', { exerciseId });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(exerciseId);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {exerciseDetails ? (
        <>
          <Text style={{ fontSize: 24, margin: 20 }}>{exerciseDetails.name}</Text>
          <Text style={{ fontSize: 16 }}>Instructions: {exerciseDetails.desc}</Text>
          <Button
            title="Add to Workout"
            onPress={addExerciseToWorkout}
          />
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="black"
            onPress={handleToggleFavorite}
          />
          <Text>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ExerciseDetails;
