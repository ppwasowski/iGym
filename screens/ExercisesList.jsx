import React from 'react';
import { FlatList, Pressable, View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../context/FavoriteContext';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';
import useAddExerciseToWorkout from '../services/useAddExerciseToWorkout';

const ExercisesList = ({ route }) => {
  const { bodypartId, workoutId } = route.params;
  const navigation = useNavigation();
  const { data: exercises, loading, error } = useFetchExercisesForContext({ bodypartId, workoutId });
  const { addExerciseToWorkout, error: addError } = useAddExerciseToWorkout();
  const { favorites, toggleFavorite } = useFavorites();

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.exercise_id === item.id);

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <Pressable onPress={() => navigation.navigate('ExerciseDetails', { exerciseId: item.id, workoutId })}>
          <Text style={{ fontSize: 18 }}>{item.name}</Text>
        </Pressable>
        {workoutId && (
          <Pressable onPress={() => addExerciseToWorkout(workoutId, item.id, navigation)}>
            <Text>Add to Workout</Text>
          </Pressable>
        )}
        <Pressable onPress={() => toggleFavorite(item.id)}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="black" />
        </Pressable>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error || addError) {
    return <Text>Error: {error || addError}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default ExercisesList;
