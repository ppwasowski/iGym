import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';
import Container from '../components/Container';
import Button from '../components/Button';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';

const screenWidth = Dimensions.get('window').width;

const StyledText = styled(Text, 'text-Text text-lg mb-2');
const ChartContainer = styled(View, 'mb-5');
const ChartTitle = styled(Text, 'text-Text text-lg mb-2');

const WorkoutProgress = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, from } = route.params;
  const { progress, error } = useFetchWorkoutProgress(sessionId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progress?.length > 0 || error) {
      setLoading(false);
    }
  }, [progress, error]);

  const handleClose = () => {
    if (from === 'WorkoutHistory') {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      );
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  // Process data for charts
  const groupedData = progress?.reduce((acc, item) => {
    if (item && item.exercise_id) {
      if (!acc[item.exercise_id]) {
        acc[item.exercise_id] = { weightData: [], repsData: [] };
      }
      acc[item.exercise_id].weightData.push({
        value: item.weight,
        label: `Set ${item.sets}`,
        dataPointText: `${item.weight} kg`,
      });
      acc[item.exercise_id].repsData.push({
        value: item.reps,
        label: `Set ${item.sets}`,
        dataPointText: `${item.reps} reps`,  // Adjusted for line chart
      });
    }
    return acc;
  }, {});

  const hasData = groupedData && Object.keys(groupedData).length > 0;

  return (
    <Container>
      <ScrollView className="flex-1 p-4">
        {hasData ? (
          Object.keys(groupedData).map((exerciseId) => {
            const exercise = progress.find((item) => item.exercise_id === parseInt(exerciseId));
            const maxReps = Math.max(...groupedData[exerciseId].repsData.map(d => d.value));
            const maxWeight = Math.max(...groupedData[exerciseId].weightData.map(d => d.value));
            const numberOfSets = groupedData[exerciseId].weightData.length;

            // Calculate dynamic width based on the number of sets
            const chartWidth = Math.max(screenWidth - 40, numberOfSets * 100);

            return (
              <ChartContainer key={exerciseId}>
                <ChartTitle>{exercise?.exercises?.name}</ChartTitle>
                
                <ScrollView horizontal>
                  <LineChart
                    data={groupedData[exerciseId].weightData}
                    width={chartWidth}
                    height={180}  // Adjust height to fit content better
                    isAnimated
                    maxValue={Math.ceil(maxWeight + 5)} // Ensure max value is set properly
                    noOfSections={5} // Make sure sections align with the max value
                    color="#ffa726"  // Line color
                    xAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }} // Adjusted label color to white
                    yAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }} // Adjusted label color to white
                    xAxisLabel="Sets"
                    yAxisLabel="Weight (kg)"
                    customDataPoint={(props) => (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 8, color: 'black' }}>{props.dataPointText}</Text>
                      </View>
                    )}
                  />
                </ScrollView>
                
                <ScrollView horizontal>
                  <LineChart
                    data={groupedData[exerciseId].repsData}
                    width={chartWidth}
                    height={180}  // Adjust height as necessary
                    isAnimated
                    maxValue={Math.max(maxReps, 6)}  // Slightly increase maxValue to prevent clipping
                    noOfSections={5}  // Ensure 5 sections
                    color="#ffa726"  // Line color
                    xAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }} // Adjusted label color to white
                    yAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 1)', fontSize: 12 }} // Adjusted label color to white
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
              </ChartContainer>
            );
          })
        ) : (
          <StyledText>No records to display</StyledText>
        )}
        <Button title="Close" onPress={handleClose} />
      </ScrollView>
      <Toast />
    </Container>
  );
};

export default WorkoutProgress;
