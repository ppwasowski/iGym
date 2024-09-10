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
import GoalAchievedModal from '../components/GoalAchievedModal'; 

const StyledText = styled(Text, 'text-Text text-lg mb-2 capitalize');
const ExerciseItem = styled(Pressable, 'flex-row justify-between items-center p-4 border-b border-gray-400');

const WorkoutProgress = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, from, goalAchieved } = route.params || {}; // Added default destructure
  const { progress, error } = useFetchWorkoutProgress(sessionId);
  const [loading, setLoading] = useState(true);
  const [goalAchievedModalVisible, setGoalAchievedModalVisible] = useState(false);

  useEffect(() => {
    if (goalAchieved) {
      setGoalAchievedModalVisible(true);
    }
  }, [goalAchieved]);

  const handleModalClose = () => {
    setGoalAchievedModalVisible(false);
  };

  useEffect(() => {
    if (progress?.length > 0 || error) {
      setLoading(false);
    }
  }, [progress, error]);

  const handleClose = () => {
    const tabNavigation = navigation.getParent();

    if (from === 'WorkoutHistory') {
      tabNavigation.navigate('Profile', {
        screen: 'Profile',
        params: { screen: 'WorkoutHistory' },
      });
    } else if (from === 'Dashboard' || from === 'ExerciseSession' || from === 'ExerciseProgress') {
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

  // Creating an array of unique exercises with Map
  const exercises = [...new Map(progress?.map(item => [item.exercises?.id, item.exercises?.name])).entries()];

  return (
    <Container className="flex-1 p-4">
      <ScrollView className="flex-1">
        {exercises.length > 0 ? (
          exercises.map(([exerciseId, exerciseName], index) => (
            <ExerciseItem
              key={index}
              onPress={() => navigateToExerciseProgress(exerciseId, exerciseName)}
            >
              <StyledText>{exerciseName}</StyledText>
            </ExerciseItem>
          ))
        ) : (
          <StyledText>No records to display</StyledText>
        )}
      </ScrollView>

      {/* Goal Achieved Modal */}
      {goalAchieved && (
        <GoalAchievedModal
          visible={goalAchievedModalVisible}
          onClose={handleModalClose}
          goal={goalAchieved}  // Pass goal data to modal
        />
      )}

      <View className="mb-4">
        <Button title="Close" onPress={handleClose} />
      </View>
      
      <Toast />
    </Container>
  );
};

export default WorkoutProgress;
