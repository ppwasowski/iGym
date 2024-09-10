import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useRoute, useNavigation } from '@react-navigation/native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';
import Container from '../components/Container';
import Button from '../components/Button';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import ExerciseStatsSection from '../components/ExerciseStatsSection';
import LoadingScreen from '../components/LoadingScreen';

const screenWidth = Dimensions.get('window').width;

const StyledText = styled(Text, 'text-center text-Primary text-lg font-bold mb-5 capitalize');
const Title = styled(Text, 'text-Text text-xl font-bold mb-2');
const Separator = styled(View, 'h-[1px] bg-Secondary mx-auto my-2 w-[94%]'); 
const LogContainer = styled(View, 'bg-Secondary p-4 flex-row items-center justify-between mb-2 rounded-lg');
const LogText = styled(Text, 'text-lg text-white');

const ExerciseProgress = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, exerciseId, exerciseName } = route.params;
  const { progress, error } = useFetchWorkoutProgress(sessionId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progress?.length > 0 || error) {
      setLoading(false);
    }
  }, [progress, error]);

  if (loading) {
    return <LoadingScreen message="Fetching workout data..." />;
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  // Filter progress data for the selected exercise
  const exerciseProgress = progress.filter(item => item.exercise_id === exerciseId);

  // Process data for charts
  const weightData = exerciseProgress.map((item, index) => ({
    value: item.weight,
    label: `Set ${index + 1}`,
    dataPointText: `${item.weight} kg`,
  }));

  const repsData = exerciseProgress.map((item, index) => ({
    value: item.reps,
    label: `Set ${index + 1}`,
    dataPointText: `${item.reps} reps`,
  }));

  const maxReps = Math.max(...repsData.map(d => d.value));
  const maxWeight = Math.max(...weightData.map(d => d.value));
  const numberOfSets = weightData.length;

  return (
    <Container className="flex-1 justify-center">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 p-4">
        <StyledText>{exerciseName}</StyledText>
        <Title>Weight Chart</Title>
        <ScrollView className='mb-10 p-5 bg-Secondary rounded-lg' horizontal>
          <LineChart
            data={weightData}
            width={Math.max(screenWidth - 40, numberOfSets * 100)}
            height={180}
            isAnimated
            maxValue={Math.ceil(maxWeight + 5)}
            noOfSections={5}
            color="#ff9a03"
            renderYAxisLabels={(label, index) => (
              <Text key={index} style={{ color: '#ff9a03', fontSize: 12, fontWeight: 'bold' }}>
                {label}
              </Text>
            )}
            renderXAxisLabels={(label, index) => (
              <Text key={index} style={{ color: '#00C87C', fontSize: 12 }}>
                {label}
              </Text>
            )}
            customDataPoint={(props) => (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff9a03', justifyContent: 'center', alignItems: 'center' }}>
              </View>
            )}
          />
        </ScrollView>
        
        <Title>Set logs</Title>
        <View>
          {exerciseProgress.length > 0 ? (
            exerciseProgress.map((set, index) => (
              <React.Fragment key={index}>
                <LogContainer>
                  <Text className="text-2xl text-SecAlter font-bold border-r-2 border-background pr-2">SET {index + 1}</Text>
                  <View className="flex-row ml-4">
                    <LogText>Weight: <Text className='text-Alter'>{set.weight}</Text> kg</LogText>
                    <LogText className='ml-4'>Reps: <Text className='text-Primary'>{set.reps}</Text></LogText>
                  </View>
                </LogContainer>

                {index < exerciseProgress.length - 1}
              </React.Fragment>
            ))
          ) : (
            <LogText>No logs available.</LogText>
          )}
        </View>
        <Separator/>
        
        <ExerciseStatsSection 
          maxReps={maxReps} 
          maxWeight={maxWeight} 
          numberOfSets={numberOfSets} 
        />
      </ScrollView>
      <View className="absolute inset-x-0 bottom-5 mx-5">
        <Button
          title="Close"
          onPress={() => navigation.navigate('WorkoutProgress', { sessionId, from: 'ExerciseProgress' })}
        />
      </View>
      <Toast />
    </Container>
  );
};

export default ExerciseProgress;
