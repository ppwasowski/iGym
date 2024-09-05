import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Container from '../components/Container';
import Button from '../components/Button';
import LoadingScreen from '../components/LoadingScreen';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker
import useFetchGoalsAdding from '../hooks/useFetchGoalsAdding';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { supabase } from '@/utility/supabase';


const AddGoal = ({ navigation, route }) => {
  const { session, onGoalAdded } = route.params;
  const [goalName, setGoalName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [metricType, setMetricType] = useState(null);
  const { profile } = useContext(UserContext);


  // DropDownPicker open/close states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [bodyPartOpen, setBodyPartOpen] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [metricOpen, setMetricOpen] = useState(false);

  const { categories, exercises, bodyParts, workouts, loading, error } = useFetchGoalsAdding();

  const exerciseCategoryId = categories.find(category => category.name === 'Exercise')?.id;
  const isConsistencyOrCompletion = ['Consistency', 'Workout Completion'].includes(
    categories.find(category => category.id === selectedCategory)?.name
  );

  useEffect(() => {
    setSelectedBodyPart(null);
    setSelectedExercise(null);
    setSelectedWorkout(null);
    setMetricType(null);
  }, [selectedCategory]);

  const handleAddGoal = async () => {
    console.log('Goal Details:', {
      user_id: profile.id,
      name: goalName,
      category_id: selectedCategory,
      exercise_id: selectedExercise || null,
      workout_id: selectedWorkout || null,
      target_value: targetValue,
      current_value: 0,
      metric_type: metricType,
    });
    try {
      const { data, error } = await supabase.from('goals').insert([
        {
          user_id: profile.id,
          category_id: selectedCategory,
          exercise_id: selectedExercise || null,
          workout_id: selectedWorkout || null,
          target_value: targetValue,
          current_value: 0,
          metric_type: metricType,
        },
      ]);

      if (error) throw new Error(error.message);

      if (onGoalAdded) {
        onGoalAdded(data[0]);
      }
      navigation.goBack();
    } catch (err) {
      console.error('Error adding goal:', err);
      alert(`Failed to add goal: ${err.message}`);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading data..." />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const filteredExercises = exercises.filter(ex => ex.bodypart_id === selectedBodyPart);

  return (
    <Container className="p-4">
      {/* Category Dropdown */}
      <View style={{ zIndex: categoryOpen ? 5000 : 1 }}> 
        <DropDownPicker
          open={categoryOpen}
          value={selectedCategory}
          items={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          setOpen={() => {
            setCategoryOpen(!categoryOpen); // Toggle between open/close
            setBodyPartOpen(false);
            setExerciseOpen(false);
            setWorkoutOpen(false);
            setMetricOpen(false);
          }}
          setValue={setSelectedCategory}
          placeholder="Select Category"
          className="mb-3 bg-white"
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Render Workout dropdown if category is 'Consistency' or 'Workout Completion' */}
      {isConsistencyOrCompletion && (
        <View style={{ zIndex: workoutOpen ? 3000 : 1 }}>
          <DropDownPicker
            open={workoutOpen}
            value={selectedWorkout}
            items={workouts.map((workout) => ({
              label: workout.name,
              value: workout.id,
            }))}
            setOpen={() => {
              setCategoryOpen(false);
              setBodyPartOpen(false);
              setExerciseOpen(false);
              setWorkoutOpen(!workoutOpen); // Toggle between open/close
              setMetricOpen(false);
            }}
            setValue={setSelectedWorkout}
            placeholder="Select Workout"
            className="mb-3 bg-white"
            listMode="SCROLLVIEW"
          />
        </View>
      )}

      {/* Render Exercise related fields if Exercise category is selected */}
      {selectedCategory === exerciseCategoryId && (
        <>
            <DropDownPicker
              style={{ zIndex: bodyPartOpen ? 4000 : 1 }}
              open={bodyPartOpen}
              value={selectedBodyPart}
              items={bodyParts.map((part) => ({
                label: part.name,
                value: part.id,
              }))}
              setOpen={() => {
                setCategoryOpen(false);
                setBodyPartOpen(!bodyPartOpen); // Toggle between open/close
                setExerciseOpen(false);
                setWorkoutOpen(false);
                setMetricOpen(false);
              }}
              setValue={setSelectedBodyPart}
              placeholder="Select Body Part"
              className="mb-3 bg-white"
              listMode="SCROLLVIEW"
            />
            <DropDownPicker
              style={{ zIndex: exerciseOpen ? 3000 : 1 }}
              open={exerciseOpen}
              value={selectedExercise}
              items={filteredExercises.map((exercise) => ({
                label: exercise.name,
                value: exercise.id,
              }))}
              setOpen={() => {
                setCategoryOpen(false);
                setBodyPartOpen(false);
                setExerciseOpen(!exerciseOpen); // Toggle between open/close
                setWorkoutOpen(false);
                setMetricOpen(false);
              }}
              setValue={setSelectedExercise}
              placeholder="Select Exercise"
              className="mb-3 bg-white"
              listMode="SCROLLVIEW"
            />
            <DropDownPicker
              style={{ zIndex: metricOpen ? 2000 : 1 }}
              open={metricOpen}
              value={metricType}
              items={[
                { label: 'Reps', value: 'reps' },
                { label: 'Weight', value: 'weight' },
              ]}
              setOpen={() => {
                setCategoryOpen(false);
                setBodyPartOpen(false);
                setExerciseOpen(false);
                setWorkoutOpen(false);
                setMetricOpen(!metricOpen); // Toggle between open/close
              }}
              setValue={setMetricType}
              placeholder="Select Metric"
              className="mb-3 bg-white"
            />
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
