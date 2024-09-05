import React, { useContext, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
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
import CustomAlert from '../components/CustomAlert';
import CustomPressable from '../components/Pressable';

const ListContainer = styled(View, 'border-b border-Separator p-4 flex-row justify-between items-center bg-background');
const ItemText = styled(Text, 'text-Primary text-xl font-bold flex-1 text-start'); // Center the text

const EmptyText = styled(Text, 'text-Text text-lg text-center mt-4');

const WorkoutList = () => {
  const { profile, loading: userLoading, error: userError } = useContext(UserContext);
  const userId = profile?.id;
  const navigation = useNavigation();
  const { data: workouts, error, loading: workoutsLoading, refresh } = useFetchExercisesForContext({ userId });
  const { deleteWorkout, error: deleteError } = useDeleteWorkout();

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleDeleteWorkout = async (workoutId) => {
    try {
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

  const confirmDelete = (workout_id) => {
    setSelectedWorkout(workout_id);
    setAlertVisible(true);
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
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
      {workouts && workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListContainer>
              <CustomPressable
                onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.id, workoutName: item.name, userId })}
                pressableStyle="bg-Secondary p-4 m-1 items-center flex-row rounded-lg w-[94%]"
              >
                <Ionicons 
                  name={item.icon_name || 'fitness'} 
                  size={24} 
                  color={item.icon_color || '#000'} 
                  style={{ marginRight: 10 }}
                />
                <ItemText>{item.name}</ItemText>
                
              </CustomPressable>
              {deleteMode && (
                <CustomPressable onPress={() => confirmDelete(item.id)}>
                  <Ionicons name="trash" size={24} color="red" />
                </CustomPressable>
              )}
            </ListContainer>
          )}
        />
      ) : (
        <EmptyText>No workouts found. Please add a new workout.</EmptyText>
      )}
      {!deleteMode && (
        <View className="mb-4">
          <Button
            title="Add New Workout"
            customStyle='bg-SecAlter'  
            onPress={() => navigation.navigate('AddWorkout', { userId, refreshWorkouts: refresh })}
          />
        </View>
      )}
      <View>
        <Button
          title={deleteMode ? "Cancel Delete" : "Delete Workouts"}
          customStyle='bg-Alter'  
          onPress={toggleDeleteMode}
        />
      </View>
      <CustomAlert
        visible={alertVisible}
        title="Delete Workout"
        message="Are you sure you want to delete this workout?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          handleDeleteWorkout(selectedWorkout);
          setAlertVisible(false);
          setSelectedWorkout(null);
        }}
        onCancel={() => {
          setAlertVisible(false);
          setSelectedWorkout(null);
        }}
      />
    </Container>
  );
};

export default WorkoutList;
