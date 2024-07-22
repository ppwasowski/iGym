// ExerciseDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../context/FavoriteContext';
import useExerciseDetails from '../hooks/useExerciseDetails';
import Container from '../components/Container'; // Ensure correct import
import Button from '../components/Button';
import { styled } from 'nativewind';

const Title = styled(Text, 'text-Text font-bold text-lg mb-3');
const FavoriteContainer = styled(View, 'flex-row items-center mb-2');
const InstructionTitle = styled(Text, 'text-Text text-lg mb-2');
const InstructionText = styled(Text, 'text-white text-base mb-1');
const InstructionItem = styled(View, 'mb-1');

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

  const formatDescription = (desc) => {
    const instructions = desc.match(/(\d+):"(.*?)"/g);
    if (instructions) {
      return instructions.map((instruction, index) => {
        const [_, number, text] = instruction.match(/(\d+):"(.*?)"/);
        return (
          <InstructionItem key={index}>
            <Text className="text-white">
              <Text className="text-Primary font-bold">{parseInt(number) + 1}.</Text> {text}
            </Text>
          </InstructionItem>
        );
      });
    }
    return <InstructionText>{desc}</InstructionText>;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <Container className=" p-4">
      {exerciseDetails ? (
        <>
          <Title>{exerciseDetails.name.toUpperCase()}</Title>
          <FavoriteContainer>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="white"
              onPress={handleToggleFavorite}
              className="mr-2"
            />
            <Text className="text-lg text-white">{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</Text>
          </FavoriteContainer>
          <InstructionTitle>Instructions:</InstructionTitle>
          <View className="self-stretch">
            {formatDescription(exerciseDetails.desc)}
          </View>
          <View className="flex-row items-center mt-4">
            <Button
              title="Add to Workout"
              onPress={addExerciseToWorkout}
            />
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Container>
  );
};

export default ExerciseDetails;
