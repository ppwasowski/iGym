import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchExerciseProgress from '../hooks/useFetchExerciseProgress';
import useAddSet from '../services/useAddSet';
import useFinishExercise from '../services/useFinishExercise';
import Button from '../components/Button';
import Container from '../components/Container';
import Input from '../components/Input';
import InfoAlert from '../components/InfoAlert';  // Import your InfoAlert component
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';

const StyledText = styled(Text, 'text-Text text-lg px-3 mb-2 capitalize');
const SetContainer = styled(View, 'flex-row justify-between mb-4 border-b border-gray-400 pb-2');
const CenteredText = styled(Text, 'text-center text-Text text-lg mb-2 capitalize');

const ExerciseWorkout = ({ route }) => {
  const { exerciseId, exerciseName, sessionId, markExerciseCompleted, session } = route.params;
  const navigation = useNavigation();

  const [infoAlertVisible, setInfoAlertVisible] = useState(false);
  const [infoAlertMessage, setInfoAlertMessage] = useState('');  // This will store the alert message

  const { sets, setSets, loading: fetchLoading, error: fetchError } = useFetchExerciseProgress(sessionId, exerciseId);
  const { finishExercise, loading: finishLoading, error: finishError } = useFinishExercise(sets, setSets, setInfoAlertMessage, setInfoAlertVisible);
  const { weight, setWeight, reps, setReps, addSet, loading: addSetLoading, error: addSetError } = useAddSet(sessionId, exerciseId, sets, setSets, setInfoAlertMessage, setInfoAlertVisible);

  useEffect(() => {
    if (!sessionId) {
      setInfoAlertMessage('Session ID is missing.');
      setInfoAlertVisible(true);
      navigation.goBack();
    }
  }, [sessionId, navigation]);

  const handleAddSet = async () => {
    const success = await addSet();
    if (success) {
      setWeight('');
      setReps('');
    }
  };

  const handleFinishExercise = async () => {
    if (sessionId) {
      await finishExercise(
        sessionId,
        route.params.workoutId,
        exerciseId,
        session.user.id,
        markExerciseCompleted,
        navigation
      );
    } else {
      setInfoAlertMessage('Cannot finish exercise without a session ID.');
      setInfoAlertVisible(true);
    }
  };

  useEffect(() => {
    if (fetchError || finishError || addSetError) {
      setInfoAlertMessage(fetchError || finishError || addSetError);
      setInfoAlertVisible(true);
    }
  }, [fetchError, finishError, addSetError]);

  if (fetchLoading) {
    return <LoadingScreen message="Loading exercise data..." />;
  }

  return (
    <Container className="flex-1 p-4">
      <CenteredText>{exerciseName}:</CenteredText>
      <Input
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        className="mb-4"
      />
      <Input
        placeholder="Reps"
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
        className="mb-4"
      />
      <Button
        title={addSetLoading ? "Adding Set..." : "Add Set"}
        onPress={handleAddSet}
        disabled={addSetLoading}
        className="mb-4"
      />

      <ScrollView className="flex-1 mt-5">
        {sets.length > 0 ? (
          sets.map((set, index) => (
            <SetContainer key={index}>
              <StyledText className="font-bold mr-3">Set {index + 1}:</StyledText>
              <StyledText>Weight: {set.weight} kg, Reps: {set.reps}</StyledText>
            </SetContainer>
          ))
        ) : (
          <CenteredText>No sets recorded yet.</CenteredText>
        )}
      </ScrollView>
      <Button
        title={finishLoading ? "Finishing Exercise..." : "Finish Exercise"}
        onPress={handleFinishExercise}
        disabled={finishLoading}
      />

      {/* InfoAlert for displaying error or informational messages */}
      <InfoAlert
        visible={infoAlertVisible}
        title="Information"
        message={infoAlertMessage}
        onConfirm={() => setInfoAlertVisible(false)}  // Close the alert when confirmed
        confirmText="Close"
      />
    </Container>
  );
};

export default ExerciseWorkout;
