import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useFetchExercisesForContext from '../hooks/useFetchExercisesForContext';
import useDeleteWorkout from '../services/useDeleteWorkout';
import Toast from 'react-native-toast-message';
import Button from '../components/Button';
import { styled } from 'nativewind';
import Container from '../components/Container';
import { UserContext } from '../context/UserContext';
import LoadingScreen from '../components/LoadingScreen';

const ListContainer = styled(View, 'border-b border-Separator p-4 flex-row justify-between items-center bg-background');
const ItemText = styled(Text, 'text-Text text-lg');
const EmptyText = styled(Text, 'text-Text text-lg text-center mt-4');

const WorkoutList = () => {
  const { profile, loading: userLoading, error: userError } = useContext(UserContext);
  const userId = profile?.id;
  const navigation = useNavigation();
  const { data: workouts, error, loading: workoutsLoading, refresh } = useFetchExercisesForContext({ userId });
  const { deleteWorkout, error: deleteError } = useDeleteWorkout();

  const handleDeleteWorkout = async (workoutId) => {
    try {
      // Perform a soft delete by setting the 'deleted' column to true
      await deleteWorkout(workoutId);
      refresh(); // Refresh the workout list after deletion
      Toast.show({
        type: 'success',
        text1: 'Workout Deleted',
        text2: 'The workout has been successfully deleted.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  if (userLoading || workoutsLoading) {
    return <LoadingScreen message="Loading workouts..." />;
  }

  if (userError) {
    return <Text>Error loading user data: {userError}</Text>;
  }

  if (error || deleteError) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error || deleteError,
    });
    return <EmptyText>Error: {error || deleteError}</EmptyText>;
  }

  return (
    <Container className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {workouts && workouts.length > 0 ? (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ListContainer>
                <TouchableOpacity
                  onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.id, workoutName: item.name, userId })}
                  style={{ flex: 1 }}
                >
                  <ItemText>{item.name}</ItemText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteWorkout(item.id)}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </ListContainer>
            )}
          />
        ) : (
          <EmptyText>No workouts found. Please add a new workout.</EmptyText>
        )}
      </ScrollView>
      <Button title="Add Workout" onPress={() => navigation.navigate('AddWorkout', { userId, refreshWorkouts: refresh })} />
    </Container>
  );
};

export default WorkoutList;
