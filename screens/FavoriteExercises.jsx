import React from 'react';
import { Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoriteContext';
import Container from '../components/Container';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';

const Item = styled(TouchableOpacity, 'flex-row justify-between text-capitalize items-center p-4 my-2 border-b border-gray-400 bg-background rounded-md w-full');
const ItemText = styled(Text, 'text-Text text-base');
const NoFavoritesText = styled(Text, 'text-Text text-center mt-4');

const FavoriteExercises = () => {
  const { favorites, toggleFavorite, loading, error } = useFavorites();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  return (
    <Container className="p-4 items-center">
      {favorites.length === 0 ? (
        <NoFavoritesText>No favorite exercises found.</NoFavoritesText>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item }) => (
            <Item onPress={() => toggleFavorite(item.exercise_id)}>
              <ItemText>{item.exercises.name}</ItemText>
              <Ionicons name="heart" size={24} color="white" />
            </Item>
          )}
        />
      )}
      <Toast />
    </Container>
  );
};

export default FavoriteExercises;
