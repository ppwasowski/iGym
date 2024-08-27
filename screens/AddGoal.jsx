import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Picker, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utility/supabase'; // Assume supabase is set up here
import Container from '../components/Container';
import LoadingScreen from '../components/LoadingScreen';

const AddGoal = ({ session }) => {
  const [goalName, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategoriesAndExercises = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('goal_categories')
        .select('*');

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*');

      if (categoriesError || exercisesError) {
        console.error('Error fetching data:', categoriesError || exercisesError);
      } else {
        setCategories(categoriesData);
        setExercises(exercisesData);
        const uniqueBodyParts = [...new Set(exercisesData.map(ex => ex.body_part))];
        setBodyParts(uniqueBodyParts);
      }
      setLoading(false);
    };

    fetchCategoriesAndExercises();
  }, []);

  const handleAddGoal = async () => {
    const { data, error } = await supabase.from('goals').insert([
      {
        user_id: session.user.id,
        name: goalName,
        description,
        category_id: selectedCategory,
        exercise_id: selectedExercise,
        target_value: targetValue,
        current_value: 0,
      },
    ]);

    if (error) {
      console.error('Error adding goal:', error);
    } else {
      navigation.goBack(); // Go back to the goals list
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading categories and exercises..." />;
  }

  return (
    <Container className="p-4">
      <TextInput
        placeholder="Goal Name"
        value={goalName}
        onChangeText={setGoalName}
        className="mb-4 p-2 bg-gray-800 rounded-md text-white"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        className="mb-4 p-2 bg-gray-800 rounded-md text-white"
      />
      <TextInput
        placeholder="Target Value"
        value={targetValue}
        onChangeText={setTargetValue}
        keyboardType="numeric"
        className="mb-4 p-2 bg-gray-800 rounded-md text-white"
      />
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        className="mb-4 p-2 bg-gray-800 rounded-md text-white"
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>

      {selectedCategory === "Exercise" && (
        <>
          <Picker
            selectedValue={selectedBodyPart}
            onValueChange={(itemValue) => setSelectedBodyPart(itemValue)}
            className="mb-4 p-2 bg-gray-800 rounded-md text-white"
          >
            <Picker.Item label="Select Body Part" value="" />
            {bodyParts.map((part) => (
              <Picker.Item key={part} label={part} value={part} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedExercise}
            onValueChange={(itemValue) => setSelectedExercise(itemValue)}
            className="mb-4 p-2 bg-gray-800 rounded-md text-white"
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

      <Button title="Add Goal" onPress={handleAddGoal} />
    </Container>
  );
};

export default AddGoal;
