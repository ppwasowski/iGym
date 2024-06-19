import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utility/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../utility/FavoriteContext';

const ExerciseDetails = ({ route }) => {
  const { exerciseId, workoutId } = route.params;
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseId)
          .single();
        if (error) {
          throw error;
        } else {
          setExerciseDetails(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExerciseDetails();
  }, [exerciseId]);

  const addExerciseToWorkout = async () => {
    navigation.navigate('WorkoutSelection', { exerciseId });
  };

  const isFavorite = favorites.includes(exerciseId);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {exerciseDetails ? (
        <>
          <Text style={{ fontSize: 24, margin: 20 }}>{exerciseDetails.name}</Text>
          <Text style={{ fontSize: 16 }}>Instructions: {exerciseDetails.desc}</Text>
          {workoutId ? (
            <Button
              title="Add to Workout"
              onPress={() => addExerciseToWorkout(exerciseId)}
            />
          ) : (
            <Button
              title="Add to Workout"
              onPress={() => navigation.navigate('WorkoutSelection', { exerciseId })}
            />
          )}
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="black"
            onPress={() => toggleFavorite(exerciseId)}
          />
          <Text>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</Text>
        </>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ExerciseDetails;
