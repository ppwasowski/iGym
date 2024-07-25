import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchExerciseProgress from '../hooks/useFetchExerciseProgress';
import useAddSet from '../services/useAddSet';
import useFinishExercise from '../services/useFinishExercise';
import Button from '../components/Button';
import Container from '../components/Container';
import Input from '../components/Input';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';

const StyledText = styled(Text, 'justify-center text-Text text-lg mb-2 text-capitalize ');
const SetContainer = styled(View, 'justify-center flex-row mb-4 border-b border-gray-400');
const CenteredText = styled(Text, 'text-center text-Text text-lg mb-2 text-capitalize');

const ExerciseWorkout = ({ route }) => {
  const { exerciseId, exerciseName, sessionId, markExerciseCompleted, session } = route.params;
  const navigation = useNavigation();
  const { sets, setSets, error: fetchError } = useFetchExerciseProgress(sessionId, exerciseId);
  const { finishExercise, error: finishError } = useFinishExercise(sets, setSets);
  const { weight, setWeight, reps, setReps, addSet } = useAddSet(sets, setSets);

  const handleFinishExercise = async () => {
    await finishExercise(sessionId, exerciseId, session.user.id, markExerciseCompleted, navigation);
  };

  return (
    <Container className="flex-1 p-4">
      <CenteredText>{exerciseName}:</CenteredText>
      {(fetchError || finishError) && (
        <Toast 
          type="error" 
          text1="Error" 
          text2={fetchError || finishError} 
        />
      )}
      <Input
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
        className="mb-4"
      />
      <Input
        placeholder="Reps"
        keyboardType="numeric"
        value={reps}
        onChangeText={(text) => setReps(text)}
        className="mb-4"
      />
      <Button title="Add Set" onPress={addSet} className="mb-4" />

      <ScrollView className="flex-1 mt-5">
        {sets.map((set, index) => (
          <SetContainer key={index}>
            <StyledText className="font-bold mr-3">Set {set.setNumber}:</StyledText>
            <StyledText>Weight: {set.weight} kg, Reps: {set.reps}</StyledText>
          </SetContainer>
        ))}
      </ScrollView>

      <Button title="Finish Exercise" onPress={handleFinishExercise} />
      <Toast />
    </Container>
  );
};

export default ExerciseWorkout;
