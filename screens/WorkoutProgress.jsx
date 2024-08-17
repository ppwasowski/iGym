import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, ActivityIndicator, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useRoute, useNavigation } from '@react-navigation/native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';
import Container from '../components/Container';
import Button from '../components/Button';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';

const screenWidth = Dimensions.get('window').width;

const StyledText = styled(Text, 'text-Text text-lg mb-2'); 
const ChartContainer = styled(View, 'mb-5');
const ChartTitle = styled(Text, 'text-Text text-lg mb-2 font-bold text-center'); 
const Loader = styled(ActivityIndicator, 'flex-1 justify-center items-center');
const NoRecordsText = styled(Text, 'text-Text text-center mt-10');

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
    navigation.goBack();
  };

  if (loading) {
    return <Loader size="large" color="#0000ff" />;
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  const groupedData = progress?.reduce((acc, item) => {
    if (item && item.exercise_id) {
      if (!acc[item.exercise_id]) {
        acc[item.exercise_id] = [];
      }
      acc[item.exercise_id].push({
        value: item.reps,
        label: `Set ${item.sets}`,
        dataPointText: `${item.weight} kg`,
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
            return (
              <ChartContainer key={exerciseId}>
                <ChartTitle>{exercise?.exercises?.name}</ChartTitle>
                <LineChart
                  data={groupedData[exerciseId]}
                  width={screenWidth - 40}
                  height={220}
                  isAnimated
                  chartConfig={{
                    backgroundColor: '#232323',
                    backgroundGradientFrom: '#333',
                    backgroundGradientTo: '#444',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  }}
                  xAxisLabel="Sets"
                  yAxisLabel="Reps"
                  customDataPoint={(props) => (
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 8, color: '#000' }}>{props.dataPointText}</Text>
                    </View>
                  )}
                />
              </ChartContainer>
            );
          })
        ) : (
          <NoRecordsText>No records to display</NoRecordsText>
        )}
        <Button title="Close" onPress={handleClose} />
      </ScrollView>
      <Toast />
    </Container>
  );
};

export default WorkoutProgress;
