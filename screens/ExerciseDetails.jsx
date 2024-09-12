import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../context/FavoriteContext';
import useExerciseDetails from '../hooks/useExerciseDetails';
import Container from '../components/Container';
import Button from '../components/Button';
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';

const Title = styled(Text, 'text-Text font-bold text-lg mb-3');
const FavoriteContainer = styled(View, 'flex-row items-center mb-2 ml-4');
const InstructionTitle = styled(Text, 'text-Text text-lg mb-2 border-b border-gray-400');
const InstructionText = styled(Text, 'text-white text-base mb-1');
const InstructionItem = styled(View, 'mb-1');
const BottomContainer = styled(View, 'flex-row items-center justify-center p-4 bg-background');

const ExerciseDetails = ({ route }) => {
  const { exerciseId } = route.params;
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
    const instructions = desc.match(/(\d+):\s*(.*?)\s*(?=\d+:|$)/gs);
  
    if (instructions) {
      return instructions.map((instruction, index) => {
        const [_, number, text] = instruction.match(/(\d+):\s*(.*)/) || [];
        
        if (number && text) {
          return (
            <InstructionItem key={index}>
              <Text className="text-white">
                <Text className="text-Primary font-bold">{parseInt(number) + 1}.</Text> {text.trim().replace(/"/g, '')}
              </Text>
            </InstructionItem>
          );
        }
        return null;
      });
    }
    return <InstructionText>{desc}</InstructionText>;
  };
  
  

  if (loading) {
    return <LoadingScreen message="Loading exercise..." />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <Container className="flex-1 p-4 justify-between">
      {exerciseDetails ? (
        <>
          <View className="flex-1">
            <Title>{exerciseDetails.name.toUpperCase()}</Title>
            <InstructionTitle>Instructions:</InstructionTitle>
            <View className="self-stretch">
              {formatDescription(exerciseDetails.desc)}
            </View>
          </View>
          <BottomContainer>
            <Button title="Add to Workout" onPress={addExerciseToWorkout} />
            <FavoriteContainer>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color="#00C87C"
                className="mr-2"
                onPress={handleToggleFavorite}
              />
              <Text className="text-lg ml-2 text-white">
                {isFavorite ? "Favorites(-)" : "Favorites(+)"}
              </Text>
            </FavoriteContainer>
          </BottomContainer>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Container>
  );
};

export default ExerciseDetails;
