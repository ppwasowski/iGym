import React from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchExerciseProgress from '../hooks/useFetchExerciseProgress';
import useAddSet from '../hooks/useAddSet';
import useFinishExercise from '../hooks/useFinishExercise';

const ExerciseWorkout = ({ route }) => {
  const { exerciseId, exerciseName, sessionId, markExerciseCompleted } = route.params;
  const navigation = useNavigation();
  const { sets, setSets, error: fetchError } = useFetchExerciseProgress(sessionId, exerciseId);
  const { finishExercise, error: finishError } = useFinishExercise(sets, setSets);
  const { weight, setWeight, reps, setReps, addSet } = useAddSet(sets, setSets);

  const handleFinishExercise = async () => {
    await finishExercise(sessionId, exerciseId, markExerciseCompleted, navigation);
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 50 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Enter Set Details for {exerciseName}:</Text>
      {(fetchError || finishError) && <Text style={{ color: 'red' }}>{fetchError || finishError}</Text>}
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
        placeholder="Reps"
        keyboardType="numeric"
        value={reps}
        onChangeText={(text) => setReps(text)}
      />
      <Button title="Add Set" onPress={addSet} />
      
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        {sets.map((set, index) => (
          <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ marginRight: 10 }}>Set {set.setNumber}:</Text>
            <Text>Weight: {set.weight} kg, Reps: {set.reps}</Text>
          </View>
        ))}
      </ScrollView>

      <Button title="Finish Exercise" onPress={handleFinishExercise} disabled={sets.length === 0} />
    </View>
  );
};

export default ExerciseWorkout;
