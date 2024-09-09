import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Container from '../components/Container';
import Button from '../components/Button';
import LoadingScreen from '../components/LoadingScreen';
import DropDownPicker from 'react-native-dropdown-picker';
import useFetchGoalsAdding from '../hooks/useFetchGoalsAdding';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { supabase } from '@/utility/supabase';

const AddGoal = ({ navigation, route }) => {
  const { session, onGoalAdded, refreshGoals } = route.params; // Destructure refreshGoals from route params
  const [targetValue, setTargetValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [metricType, setMetricType] = useState("");
  const { profile } = useContext(UserContext);
  const [dropdowns, setDropdowns] = useState({
    categoryOpen: false,
    bodyPartOpen: false,
    exerciseOpen: false,
    workoutOpen: false,
    metricOpen: false,
  });

  const { categories, exercises, bodyParts, workouts, loading, error } = useFetchGoalsAdding();

  const exerciseCategoryId = categories.find(category => category.name === 'Exercise')?.id;
  const isConsistencyOrCompletion = ['Consistency', 'Workout Completion'].includes(
    categories.find(category => category.id === selectedCategory)?.name
  );
  // Close all dropdowns except the one
  const toggleDropdown = (dropdownKey) => {
    setDropdowns((prevState) => ({
      categoryOpen: false,
      bodyPartOpen: false,
      exerciseOpen: false,
      workoutOpen: false,
      metricOpen: false,
      [dropdownKey]: !prevState[dropdownKey], // Toggle the specific dropdown
    }));
  };

  useEffect(() => {
    setSelectedBodyPart(null);
    setSelectedExercise(null);
    setSelectedWorkout(null);
    setMetricType(null);
  }, [selectedCategory]);

  const handleAddGoal = async () => {
    const goalDetails = {
      user_id: profile?.id || '',
      category_id: selectedCategory,
      target_value: targetValue,
      current_value: 0,
      ...(metricType && { metric_type: metricType }),
      ...(selectedExercise && { exercise_id: selectedExercise }),
      ...(selectedWorkout && { workout_id: selectedWorkout }),
    };
  
    console.log('Goal Details:', goalDetails);
  
    try {
      const { data, error } = await supabase.from('goals').insert([goalDetails]);
  
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
  
      if (data && onGoalAdded) {
        onGoalAdded(data[0]);
      }
      if (refreshGoals) {
        refreshGoals();
      }
  
      navigation.goBack();
    } catch (err) {
      console.error('Error adding goal:', err.message);
      alert(`Failed to add goal: ${err.message}`);
    }
  };

  const filteredExercises = exercises.filter(ex => ex.bodypart_id === selectedBodyPart);

  return (
    <Container className="p-4">
      <View style={{ zIndex: dropdowns.categoryOpen ? 5000 : 1 }}> 
        {/* Category*/}
        <DropDownPicker
          open={dropdowns.categoryOpen}
          value={selectedCategory}
          items={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          setOpen={() => toggleDropdown('categoryOpen')}
          setValue={setSelectedCategory}
          placeholder="Select Category"
          className="mb-3 bg-white"
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Consistency/Workout Completion*/}
      {isConsistencyOrCompletion && (
        <View style={{ zIndex: dropdowns.workoutOpen ? 3000 : 1 }}>
          <DropDownPicker
            open={dropdowns.workoutOpen}
            value={selectedWorkout}
            items={workouts.map((workout) => ({
              label: workout.name,
              value: workout.id,
            }))}
            setOpen={() => toggleDropdown('workoutOpen')}
            setValue={setSelectedWorkout}
            placeholder="Select Workout"
            className="mb-3 bg-white"
            listMode="SCROLLVIEW"
          />
        </View>
      )}

      {/* Exercise */}
      {selectedCategory === exerciseCategoryId && (
        <>
          <View style={{ zIndex: dropdowns.bodyPartOpen ? 4000 : 1 }}>
            <DropDownPicker
              open={dropdowns.bodyPartOpen}
              value={selectedBodyPart}
              items={bodyParts.map((part) => ({
                label: part.name,
                value: part.id,
              }))}
              setOpen={() => toggleDropdown('bodyPartOpen')}
              setValue={setSelectedBodyPart}
              placeholder="Select Body Part"
              className="mb-3 bg-white"
              listMode="SCROLLVIEW"
            />
          </View>

          <View style={{ zIndex: dropdowns.exerciseOpen ? 3000 : 1 }}>
            <DropDownPicker
              open={dropdowns.exerciseOpen}
              value={selectedExercise}
              items={filteredExercises.map((exercise) => ({
                label: exercise.name,
                value: exercise.id,
              }))}
              setOpen={() => toggleDropdown('exerciseOpen')}
              setValue={setSelectedExercise}
              placeholder="Select Exercise"
              className="mb-3 bg-white"
              listMode="SCROLLVIEW"
            />
          </View>

          <View style={{ zIndex: dropdowns.metricOpen ? 2000 : 1 }}>
            <DropDownPicker
              open={dropdowns.metricOpen}
              value={metricType}
              items={[
                { label: 'Reps', value: 'reps' },
                { label: 'Weight', value: 'weight' },
              ]}
              setOpen={() => toggleDropdown('metricOpen')}
              setValue={setMetricType}
              placeholder="Select Metric"
              className="mb-3 bg-white"
            />
          </View>
        </>
      )}

      <TextInput
        placeholder="Target Value"
        value={targetValue}
        onChangeText={setTargetValue}
        keyboardType="numeric"
        className="mb-3 p-3 bg-gray-300 rounded-md"
      />

      <View className="flex-row justify-between">
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Add Goal" onPress={handleAddGoal} />
      </View>
    </Container>
  );
};

export default AddGoal;
