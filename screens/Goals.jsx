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
const GoalContainer = styled(View, 'border-b border-Separator p-4 flex-row justify-between items-center bg-background');
const GoalBlock = styled(TouchableOpacity, 'bg-Secondary p-4 m-2 mb-4 rounded-lg w-[47%] flex-row justify-between items-center');
const GoalTitle = styled(Text, 'text-md text-Primary font-bold capitalize');
const GoalText = styled(Text, 'text-sm text-Text font-bold flex-1');

const Goals = ({ session }) => {
  const navigation = useNavigation();
  const { goals, loading, error, setGoals, refreshGoals } = useFetchGoals(session.user.id);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

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
    <Container className="flex-1 p-4">
      <Text className='text-center text-Text text-xl font-bold mb-2'>Active Goals</Text>
      
      {/* FlatList wrapped in a View with flex: 1 */}
      <FlatList
        data={goals}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GoalBlock>
            <View style={{ flex: 1 }}>
              <GoalTitle>
                {item.exercises ? item.exercises.name : item.workout ? item.workout.name : 'N/A'}
              </GoalTitle>
              <GoalText className='text-Alter'>Category: {item.goal_categories.name}</GoalText>
              <GoalText>{item.metric_type ? `Type: ${item.metric_type}` : null}</GoalText>
              <GoalText className='text-SecAlter text-center mt-2'>
                Progress: {item.current_value}/{item.target_value}
              </GoalText>
            </View>
            {deleteMode && (
              <Ionicons
                name="trash"
                size={24}
                color="red"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  padding: 10,
                  borderRadius: 50,
                }}
                onPress={() => confirmDelete(item.id)}
              />
            )}
          </GoalBlock>
        )}
      />


        {!deleteMode && (
          <View className='mb-4'>
            <Button
              title="Add Goal"
              customStyle='bg-SecAlter'  
              onPress={() =>
                navigation.navigate('AddGoal', {
                  session,
                  onGoalAdded: handleGoalAdded,
                  refreshGoals,
                })
              }
            />
          </View>
        )}

        <View>
          <Button
            title={deleteMode ? 'Cancel Delete' : 'Delete Goal'}
            customStyle='bg-Alter'  
            onPress={() => setDeleteMode(!deleteMode)}
          />
        </View>

      {/* Custom Alert for deleting goals */}
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
