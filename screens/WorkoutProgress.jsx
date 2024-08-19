import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';
import Container from '../components/Container';
import Button from '../components/Button';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';

const StyledText = styled(Text, 'text-Text text-lg mb-2 ');
const ExerciseItem = styled(Pressable, 'flex-row justify-between items-center p-4 border-b border-gray-400');

const WorkoutProgress = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, from } = route.params;
  const { progress, error } = useFetchWorkoutProgress(sessionId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progress?.length > 0 || error) {
      setLoading(false);
    }
  }, [progress, error]);

  const handleClose = () => {
    if (from === 'WorkoutHistory') {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      );
    }
  };

  const navigateToExerciseProgress = (exerciseId, exerciseName) => {
    navigation.navigate('ExerciseProgress', { sessionId, exerciseId, exerciseName });
  };

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

  // Extract exercises with both exerciseId and exerciseName
  const exercises = [...new Map(progress?.map(item => [item.exercises?.id, item.exercises?.name]))];

  return (
    <Container className="flex-1 p-4">
      <ScrollView className="flex-1">
        {exercises.length > 0 ? (
          exercises.map(([exerciseId, exerciseName], index) => (
            <ExerciseItem
              key={index}
              onPress={() => navigateToExerciseProgress(exerciseId, exerciseName)}>
              <StyledText className='text-capitalize'>{exerciseName}</StyledText>
            </ExerciseItem>
          ))
        ) : (
          <StyledText>No records to display</StyledText>
        )}
      </ScrollView>
      
      {/* The button is placed within a View that's placed at the bottom */}
      <View className="mb-4">
        <Button title="Close" onPress={handleClose} />
      </View>
      
      <Toast />
    </Container>
  );
};

export default WorkoutProgress;
