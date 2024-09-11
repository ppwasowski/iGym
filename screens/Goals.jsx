import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';  // Ensure TouchableOpacity is imported
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Container from '../components/Container';
import Button from '../components/Button';
import useFetchGoals from '../hooks/useFetchGoals';
import { supabase } from '../utility/supabase';
import CustomAlert from '../components/CustomAlert';
import LoadingScreen from '@/components/LoadingScreen';
import { checkAndUpdateGoals } from '../components/CheckAndUpdateGoals';
import { UserContext } from '../context/UserContext';
import { styled } from 'nativewind';
import DropDownPicker from 'react-native-dropdown-picker';  // import the dropdown picker

// Define your styled components
const GoalBlock = styled(TouchableOpacity, 'bg-Secondary p-3 mr-6 mb-4 rounded-lg w-[47%] flex-row justify-between items-center');
const GoalTitle = styled(Text, 'text-base text-Text font-bold capitalize');
const GoalText = styled(Text, 'text-sm text-Text flex-1 capitalize');

const Goals = () => {
  const { profile } = useContext(UserContext);
  const navigation = useNavigation();
  const { goals, loading, error, setGoals, refreshGoals } = useFetchGoals(profile.id);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isUpdatingGoals, setIsUpdatingGoals] = useState(false);

  const [filterValue, setFilterValue] = useState('active');  // This state will manage which goals to show (active/achieved)
  const [open, setOpen] = useState(false);  // Manages the dropdown visibility
  
  // Options for dropdown
  const filterOptions = [
    { label: 'Active Goals', value: 'active' },
    { label: 'Achieved Goals', value: 'achieved' }
  ];

  useEffect(() => {
    const updateGoalsOnLoad = async () => {
      setIsUpdatingGoals(true);
      try {
        await checkAndUpdateGoals(profile.id, { workoutCompleted: true });
        refreshGoals();
      } catch (error) {
        console.error('Error checking and updating goals:', error);
      } finally {
        setIsUpdatingGoals(false);
      }
    };
  
    updateGoalsOnLoad();
  }, [profile.id]);

  if (isUpdatingGoals || loading) {
    return <LoadingScreen message="Loading goals..." />;
  }

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

  const filteredGoals = goals.filter(goal => {
    return filterValue === 'active' ? !goal.achieved : goal.achieved;
  });

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
      <View className='w-full items-center justify-center mb-4'>
      <DropDownPicker
        open={open}
        value={filterValue}
        items={filterOptions}
        setOpen={setOpen}
        setValue={setFilterValue}
        style={{ marginBottom: 20 }}
      />
      </View>
      <FlatList
        data={filteredGoals}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GoalBlock>
            <View style={{ flex: 1 }}>
              <GoalTitle>
                {item.exercises ? item.exercises.name : item.workout ? item.workout.name : 'N/A'}
              </GoalTitle>
              <GoalText className='text-SecAlter mt-1'>{item.goal_categories.name}</GoalText>
              <GoalText className='text-Alter'>{item.metric_type ? `${item.metric_type}` : null}</GoalText>
              <GoalText className='text-Primary text-center mt-2 font-bold'>
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
                  top: 50,
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
