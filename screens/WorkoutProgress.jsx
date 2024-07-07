import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';

const screenWidth = Dimensions.get('window').width;

const WorkoutProgress = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, from } = route.params;
  const { progress, error } = useFetchWorkoutProgress(sessionId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progress.length > 0 || error) {
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
    return <Text>Error: {error}</Text>;
  }

  const groupedData = progress.reduce((acc, item) => {
    if (!acc[item.exercise_id]) {
      acc[item.exercise_id] = [];
    }
    acc[item.exercise_id].push({
      value: item.reps,
      label: `Set ${item.sets}`,
      dataPointText: `${item.weight} kg`,
    });
    return acc;
  }, {});

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        {Object.keys(groupedData).map((exerciseId) => {
          const exercise = progress.find((item) => item.exercise_id === parseInt(exerciseId));
          return (
            <View key={exerciseId} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>{exercise.exercises.name}</Text>
              <LineChart
                data={groupedData[exerciseId]}
                width={screenWidth - 40}
                height={220}
                isAnimated
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientFrom: '#fb8c00',
                  backgroundGradientTo: '#ffa726',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                xAxisLabel="Sets"
                yAxisLabel="Reps"
                customDataPoint={(props) => (
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 8, color: 'black' }}>{props.dataPointText}</Text>
                  </View>
                )}
              />
            </View>
          );
        })}
        <Button title="Close" onPress={handleClose} />
      </View>
    </ScrollView>
  );
};

export default WorkoutProgress;
