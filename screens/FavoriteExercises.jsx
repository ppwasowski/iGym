import React, { useState } from 'react';
import { Text, FlatList, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoriteContext';
import Container from '../components/Container';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';
import Button from '../components/Button';
import CustomAlert from '../components/CustomAlert';

const Item = styled(TouchableOpacity, 'flex-row justify-between text-capitalize items-center p-4 my-2 border-b border-gray-400 bg-background rounded-md w-full');
const ItemText = styled(Text, 'text-Text text-base capitalize');
const NoFavoritesText = styled(Text, 'text-Text text-center mt-4');

const FavoriteExercises = () => {
  const { favorites, toggleFavorite, loading, error } = useFavorites();
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleToggleFavorite = (exerciseId) => {
    toggleFavorite(exerciseId);
    setAlertVisible(false);
    setSelectedFavorite(null);
  };

  const confirmDelete = (exerciseId) => {
    setSelectedFavorite(exerciseId);
    setAlertVisible(true);
  };

  if (loading) {
    return <LoadingScreen message="Loading favorites..." />;
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
            <Item onPress={() => deleteMode ? confirmDelete(item.exercise_id) : null}>
              <ItemText>{item.exercises.name}</ItemText>
              {deleteMode ? (
                <Ionicons name="trash" size={24} color="red" />
              ) : (
                <Ionicons name="heart" size={24} color="#00C87C" />
              )}
            </Item>
          )}
        />
      )}

      <View className="w-full mt-4">
        <Button
          title={deleteMode ? "Cancel Delete" : "Delete Favorites"}
          onPress={toggleDeleteMode}
          className="mb-4"
        />
      </View>
      <Toast />
      <CustomAlert
        visible={alertVisible}
        title="Remove Favorite"
        message="Are you sure you want to remove this exercise from your favorites?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={() => handleToggleFavorite(selectedFavorite)}
        onCancel={() => {
          setAlertVisible(false);
          setSelectedFavorite(null);
        }}
      />
    </Container>
  );
};

export default FavoriteExercises;
