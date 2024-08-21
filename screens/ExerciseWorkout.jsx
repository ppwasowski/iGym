import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFetchExerciseProgress from '../hooks/useFetchExerciseProgress';
import useAddSet from '../services/useAddSet';
import useFinishExercise from '../services/useFinishExercise';
import Button from '../components/Button';
import Container from '../components/Container';
import Input from '../components/Input';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';

const StyledText = styled(Text, 'text-Text text-lg px-3 mb-2 capitalize');
const SetContainer = styled(View, 'flex-row justify-between mb-4 border-b border-gray-400 pb-2');
const CenteredText = styled(Text, 'text-center text-Text text-lg mb-2 capitalize');

const ExerciseWorkout = ({ route }) => {
  const { exerciseId, exerciseName, sessionId, markExerciseCompleted, session } = route.params;
  const navigation = useNavigation();

  const {
    sets,
    setSets,
    error: fetchError,
    loading: fetchLoading,
    refresh: refreshProgress,
  } = useFetchExerciseProgress(sessionId, exerciseId);

  const {
    finishExercise,
    error: finishError,
    loading: finishLoading,
  } = useFinishExercise(sets, setSets);

  const {
    weight,
    setWeight,
    reps,
    setReps,
    addSet,
    error: addSetError,
    loading: addSetLoading,
  } = useAddSet(sessionId, exerciseId, sets, setSets);

  useEffect(() => {
    if (!sessionId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Session ID is missing.',
      });
      navigation.goBack();
    }
  }, [sessionId, navigation]);

  const handleAddSet = async () => {
    const newSet = { weight: parseFloat(weight), reps: parseInt(reps, 10) };
    const success = await addSet(newSet);
    if (success) {
      setSets((prevSets) => [...prevSets, newSet]);
      setWeight(''); // Reset to empty string
      setReps('');   // Reset to empty string
      refreshProgress(); // Fetch the latest progress after adding a set
    }
  };

  const handleFinishExercise = async () => {
    if (sessionId) {
      await finishExercise(sessionId, exerciseId, session.user.id, markExerciseCompleted, navigation);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Cannot finish exercise without a session ID.',
      });
    }
  };

  useEffect(() => {
    if (fetchError || finishError || addSetError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: fetchError || finishError || addSetError,
      });
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
      <Button title="Add Set" onPress={handleAddSet} className="mb-4" />

      {addSetLoading && (
        <View className="mb-4">
          <ActivityIndicator size="small" color="#00C87C" />
        </View>
      )}

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

      <Button title="Finish Exercise" onPress={handleFinishExercise} />
      <Toast />
    </Container>
  );
};

export default ExerciseWorkout;
