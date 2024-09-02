import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Container from '../components/Container';
import Button from '../components/Button';
import LoadingScreen from '../components/LoadingScreen';
import { Picker } from '@react-native-picker/picker';  // Correctly import Picker
import useFetchGoalsAdding from '../hooks/useFetchGoalsAdding';  

const AddGoal = ({ navigation, route }) => {
  const { session, onGoalAdded } = route.params;
  const [goalName, setGoalName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [metricType, setMetricType] = useState('');

  const { categories, exercises, bodyParts, workouts, loading, error } = useFetchGoalsAdding();

  useEffect(() => {
    setSelectedBodyPart('');
    setSelectedExercise('');
    setSelectedWorkout('');
    setMetricType('');
  }, [selectedCategory]);

  const handleAddGoal = async () => {
    try {
      const { data, error } = await supabase.from('goals').insert([
        {
          user_id: session.user.id,
          name: goalName,
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

  const selectedCategoryName = categories.find(category => category.id === selectedCategory)?.name;
  const filteredExercises = exercises.filter(ex => ex.bodypart_id === selectedBodyPart);

  return (
    <Container className="p-4">
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

      {selectedCategoryName === 'Exercise' && (
        <>
          <Picker
            selectedValue={selectedBodyPart}
            onValueChange={(itemValue) => setSelectedBodyPart(itemValue)}
            style={{ marginBottom: 10 }}
          >
            <Picker.Item label="Select Body Part" value="" />
            {bodyParts.map((part) => (
              <Picker.Item key={part.id} label={part.name} value={part.id} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedExercise}
            onValueChange={(itemValue) => setSelectedExercise(itemValue)}
            style={{ marginBottom: 10 }}
          >
            <Picker.Item label="Select Exercise" value="" />
            {filteredExercises.map((exercise) => (
              <Picker.Item key={exercise.id} label={exercise.name} value={exercise.id} />
            ))}
          </Picker>

          <Picker
            selectedValue={metricType}
            onValueChange={(itemValue) => setMetricType(itemValue)}
            style={{ marginBottom: 10 }}
          >
            <Picker.Item label="Select Metric" value="" />
            <Picker.Item label="Reps" value="reps" />
            <Picker.Item label="Weight" value="weight" />
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
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Add Goal" onPress={handleAddGoal} />
      </View>
    </Container>
  );
};

export default AddGoal;
