import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
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

const StyledText = styled(Text, 'text-center text-Text text-lg font-bold mb-5 capitalize');
const ChartTitle = styled(Text, 'text-center text-Text text-lg mb-2');

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

  // Calculate dynamic width based on the number of sets
  const chartWidth = Math.max(screenWidth - 40, numberOfSets * 100);

  return (
    <Container className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 p-4">
        <StyledText>{exerciseName}</StyledText>
        <ChartTitle>Weight</ChartTitle>
        <ScrollView className='mb-10' horizontal>
          <LineChart
            data={weightData}
            width={chartWidth}
            height={180}
            isAnimated
            maxValue={Math.ceil(maxWeight + 5)}
            noOfSections={5}
            color="#ffa726"
            xAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }}
            yAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }}
            xAxisLabel="Sets"
            yAxisLabel="Weight (kg)"
            customDataPoint={(props) => (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 8, color: 'black' }}>{props.dataPointText}</Text>
              </View>
            )}
          />
        </ScrollView>
        <ChartTitle>Reps</ChartTitle>
        <ScrollView horizontal>
          <LineChart
            data={repsData}
            width={chartWidth}
            height={180}
            isAnimated
            maxValue={Math.max(maxReps, 6)}
            noOfSections={5}
            color="#ffa726"
            xAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }}
            yAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }}
            xAxisLabel="Sets"
            yAxisLabel="Reps"
            customDataPoint={(props) => (
              <View style={{ width: 8, height: 6, borderRadius: 4, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontSize: 40, color: 'white', marginTop: 20 }}>
                  {props.dataPointText}
                </Text>
              </View>
            )}
          />
        </ScrollView>
        <ExerciseStatsSection 
          maxReps={maxReps} 
          maxWeight={maxWeight} 
          numberOfSets={numberOfSets} 
        />
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
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
