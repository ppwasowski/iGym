import React from 'react';
import { FlatList, Pressable, View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../context/FavoriteContext';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';
import useAddExerciseToWorkout from '../services/useAddExerciseToWorkout';
import Container from '../components/Container';
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';


const ExerciseItem = styled(View, 'flex-row justify-between items-center p-4 border-b border-gray-400');
const ExerciseText = styled(Text, 'capitalize text-lg text-white');
const AddText = styled(Text, 'text-Primary');

const ExercisesList = ({ route }) => {
  const { bodypartId, workoutId } = route.params;
  const navigation = useNavigation();
  const { data: exercises, loading, error } = useFetchExercisesForContext({ bodypartId, workoutId });
  const { addExerciseToWorkout, error: addError } = useAddExerciseToWorkout();
  const { favorites, toggleFavorite } = useFavorites();

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.exercise_id === item.id);

    return (
      <ExerciseItem>
        <Pressable onPress={() => navigation.navigate('ExerciseDetails', { exerciseId: item.id, workoutId })}>
          <ExerciseText>{item.name}</ExerciseText>
        </Pressable>
        {workoutId && (
          <Pressable onPress={() => addExerciseToWorkout(workoutId, item.id, navigation)}>
            <AddText>Add to Workout</AddText>
          </Pressable>
        )}
        <Pressable onPress={() => toggleFavorite(item.id)}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="white" />
        </Pressable>
      </ExerciseItem>
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading exercises..." />;
  }

  if (error || addError) {
    return <Text>Error: {error || addError}</Text>;
  }

  return (
    <Container>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </Container>
  );
};

export default ExercisesList;
