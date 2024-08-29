import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Container from '../components/Container';
import LoadingScreen from '../components/LoadingScreen';
import Button from '../components/Button';
import useFetchGoals from '../hooks/useFetchGoals';
import { supabase } from '../utility/supabase';
import CustomAlert from '../components/CustomAlert'; // Import the CustomAlert

const Goals = ({ session }) => {
  const navigation = useNavigation();
  const { goals, loading, error, setGoals } = useFetchGoals(session.user.id);
  const [deleteMode, setDeleteMode] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const handleGoalAdded = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
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
      setAlertVisible(false); // Close alert after deletion
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
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 p-3 bg-gray-800 rounded-md flex-row justify-between">
            <View>
              <Text className="text-white">Category: {item.goal_categories.name}</Text>
              <Text className="text-white capitalize">Type: {item.metric_type}</Text>
              <Text className="text-white capitalize">
                Exercise: {item.exercises ? item.exercises.name : 'N/A'}
              </Text>
              <Text className="text-white">
                Progress: {item.current_value}/{item.target_value}
              </Text>
            </View>
            {deleteMode && (
              <Ionicons
                name="trash"
                size={24}
                color="red"
                onPress={() => confirmDelete(item.id)}
              />
            )}
          </View>
        )}
      />

      {!deleteMode && (
        <View className='mb-4'>
          <Button
            title="Add New Goal"
            onPress={() =>
              navigation.navigate('AddGoal', {
                session,
                onGoalAdded: handleGoalAdded,
              })
            }
            className="mb-4" // Add margin bottom for spacing
          />
        </View>
      )}

      <View>
        <Button
          title={deleteMode ? "Cancel Delete" : "Delete Goal"}
          onPress={() => setDeleteMode(!deleteMode)}
          className={!deleteMode ? "mt-2" : "mt-4"} // Add margin top for spacing when deleteMode is not active
        />
      </View>

      <CustomAlert
        visible={alertVisible}
        title="Delete Goal"
        message="Are you sure you want to delete this goal?"
        onConfirm={handleDeleteGoal}
        onCancel={() => setAlertVisible(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  );
};

export default Goals;
