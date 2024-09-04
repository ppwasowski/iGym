import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';
import Container from '../components/Container';
import Button from '../components/Button';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import LoadingScreen from '@/components/LoadingScreen';
import { CommonActions } from '@react-navigation/native';

const StyledText = styled(Text, 'text-Text text-lg mb-2 capitalize');
const ExerciseItem = styled(Pressable, 'flex-row justify-between items-center p-4 border-b border-gray-400');

const WorkoutProgress = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, from, session } = route.params;
  const { progress, error } = useFetchWorkoutProgress(sessionId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progress?.length > 0 || error) {
      setLoading(false);
    }
  }, [progress, error]);
  
  const handleClose = () => {
    const tabNavigation = navigation.getParent();
  
    if (from === 'WorkoutHistory') {
      tabNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Profile', params: { screen: 'WorkoutHistory' } }],
        })
      );
    } else if (from === 'Dashboard') {
      tabNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }], 
        })
      );
    } else {
      navigation.goBack();
    }
  };
  
  
  
  
  

  const navigateToExerciseProgress = (exerciseId, exerciseName) => {
    navigation.navigate('ExerciseProgress', { sessionId, exerciseId, exerciseName });
  };

  if (loading) {
    return <LoadingScreen message="Fetching workout data..." />;
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }
  const exercises = [...new Map(progress?.map(item => [item.exercises?.id, item.exercises?.name]))];

  return (
    <Container className="flex-1 p-4">
      <ScrollView className="flex-1">
        {exercises.length > 0 ? (
          exercises.map(([exerciseId, exerciseName], index) => (
            <ExerciseItem
              key={index}
              onPress={() => navigateToExerciseProgress(exerciseId, exerciseName)}>
              <StyledText>{exerciseName}</StyledText>
            </ExerciseItem>
          ))
        ) : (
          <StyledText>No records to display</StyledText>
        )}
      </ScrollView>
      
      <View className="mb-4">
        <Button title="Close" onPress={handleClose} />
      </View>
      
      <Toast />
    </Container>
  );
};

export default WorkoutProgress;
