import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Container from '../components/Container';
import Button from '../components/Button';
import useFetchGoals from '../hooks/useFetchGoals';
import { supabase } from '../utility/supabase';
import CustomAlert from '../components/CustomAlert';
import { styled } from 'nativewind';
import LoadingScreen from '@/components/LoadingScreen';

// Define your styled components
const GoalContainer = styled(View, 'flex-wrap flex-row justify-between items-center w-full');
const GoalBlock = styled(TouchableOpacity, 'bg-Secondary p-4 m-2 rounded-lg w-[47%] items-left');
const GoalTitle = styled(Text, 'text-md text-Primary font-bold capitalize');
const GoalText = styled(Text, 'text-sm text-Text font-bold');

const Goals = ({ session }) => {
  const navigation = useNavigation(); // Initialize navigation
  const { goals, loading, error, setGoals, refreshGoals } = useFetchGoals(session.user.id);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  // Ensure the goals are refreshed after adding or deleting
  useEffect(() => {
    refreshGoals();
  }, [refreshGoals]);

  const handleGoalAdded = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    refreshGoals();
  };

  const handleDeleteGoal = async () => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', selectedGoalId);

      if (error) {
        throw error;
      }

      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== selectedGoalId));
      setAlertVisible(false);
      refreshGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const confirmDelete = (goalId) => {
    setSelectedGoalId(goalId);
    setAlertVisible(true);
  };

  if (loading) {
    return <LoadingScreen message="Loading goals..." />;
  }

  if (error) {
    return (
      <Container className="p-4">
        <Text className="text-red-500">{`Error: ${error}`}</Text>
      </Container>
    );
  }

  return (
    <Container className="p-4">
      <GoalContainer>
        <FlatList
          data={goals}
          numColumns={2} // Two-column layout
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GoalBlock>
              <GoalTitle>
                {item.exercises ? item.exercises.name : item.workout ? item.workout.name : 'N/A'}
              </GoalTitle>
              <GoalText className='text-Alter'>Category: {item.goal_categories.name}</GoalText>
              <GoalText>Type: {item.metric_type}</GoalText>
              <GoalText className='text-SecAlter'>
                Progress: {item.current_value}/{item.target_value}
              </GoalText>
              {deleteMode && (
                <Ionicons
                  name="trash"
                  size={24}
                  color="red"
                  onPress={() => confirmDelete(item.id)}
                />
              )}
            </GoalBlock>
          )}
        />
      </GoalContainer>

      {!deleteMode && (
        <View className="mb-4">
          <Button
            title="Add New Goal"
            onPress={() =>
              navigation.navigate('AddGoal', {
                session,
                onGoalAdded: handleGoalAdded,
                refreshGoals, // Pass the refresh function to the AddGoal component
              })
            }
            className="mb-4"
          />
        </View>
      )}

      <Button
        title={deleteMode ? 'Cancel Delete' : 'Delete Goal'}
        onPress={() => setDeleteMode(!deleteMode)}
        className={!deleteMode ? 'mt-2' : 'mt-4'}
      />

      <CustomAlert
        visible={alertVisible}
        title="Delete Goal"
        message="Are you sure you want to delete this goal?"
        onConfirm={handleDeleteGoal}
        onCancel={() => setAlertVisible(false)}
      />
    </Container>
  );
};

export default Goals;
