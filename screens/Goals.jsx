import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../utility/supabase';
import Container from '../components/Container';
import LoadingScreen from '../components/LoadingScreen';
import Button from '../components/Button';

const Goals = ({ session }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*, goal_categories(name)')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching goals:', error);
      } else {
        setGoals(data);
      }
      setLoading(false);
    };

    const fetchCategoriesAndExercises = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('goal_categories')
        .select('*');

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*');

      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*');

      if (categoriesError || exercisesError || workoutsError) {
        console.error('Error fetching data:', categoriesError || exercisesError || workoutsError);
      } else {
        setCategories(categoriesData);
        setExercises(exercisesData);
        setWorkouts(workoutsData);

        const uniqueBodyParts = [...new Set(exercisesData.map(ex => ex.body_part))];
        setBodyParts(uniqueBodyParts);
      }
    };

    fetchGoals();
    fetchCategoriesAndExercises();
  }, [session.user.id]);

  const handleAddGoal = async () => {
    const { data, error } = await supabase.from('goals').insert([
      {
        user_id: session.user.id,
        name: goalName,
        category_id: selectedCategory,
        exercise_id: selectedExercise || null,
        workout_id: selectedWorkout || null,
        target_value: targetValue,
        current_value: 0,
      },
    ]);

    if (error) {
      console.error('Error adding goal:', error);
    } else {
      setGoals([...goals, ...data]);
      setModalVisible(false); // Close the modal
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading goals..." />;
  }

  const selectedCategoryName = categories.find(category => category.id === selectedCategory)?.name;

  return (
    <Container className="p-4">
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 p-3 bg-gray-800 rounded-md">
            <Text className="text-white text-lg font-bold">{item.name}</Text>
            <Text className="text-white">{item.description}</Text>
            <Text className="text-white">Category: {item.goal_categories.name}</Text>
            <Text className="text-white">
              Progress: {item.current_value}/{item.target_value}
            </Text>
          </View>
        )}
      />
      <Button title="Add New Goal" onPress={() => setModalVisible(true)} />
      
      {/* Modal for adding a new goal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <TextInput
              placeholder="Goal Name"
              value={goalName}
              onChangeText={setGoalName}
              style={{ marginBottom: 10, padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}
            />
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={{ marginBottom: 10 }}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>

            {/* Conditional rendering based on the selected category name */}
            {selectedCategoryName === 'Exercise' && (
              <>
                <Picker
                  selectedValue={selectedBodyPart}
                  onValueChange={(itemValue) => setSelectedBodyPart(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select Body Part" value="" />
                  {bodyParts.map((part) => (
                    <Picker.Item key={part} label={part} value={part} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={selectedExercise}
                  onValueChange={(itemValue) => setSelectedExercise(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select Exercise" value="" />
                  {exercises
                    .filter((ex) => ex.body_part === selectedBodyPart)
                    .map((exercise) => (
                      <Picker.Item key={exercise.id} label={exercise.name} value={exercise.id} />
                    ))}
                </Picker>
              </>
            )}

            {selectedCategoryName === 'Workout' && (
              <Picker
                selectedValue={selectedWorkout}
                onValueChange={(itemValue) => setSelectedWorkout(itemValue)}
                style={{ marginBottom: 10 }}
              >
                <Picker.Item label="Select Workout" value="" />
                {workouts.map((workout) => (
                  <Picker.Item key={workout.id} label={workout.name} value={workout.id} />
                ))}
              </Picker>
            )}

            <TextInput
              placeholder="Target Value"
              value={targetValue}
              onChangeText={setTargetValue}
              keyboardType="numeric"
              style={{ marginBottom: 10, padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add Goal" onPress={handleAddGoal} />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default Goals;
