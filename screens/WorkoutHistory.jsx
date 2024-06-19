import React from 'react';
import { View, Text, FlatList } from 'react-native';
import useFetchWorkoutProgress from '../hooks/useFetchWorkoutProgress';
import { useNavigation } from '@react-navigation/native';

const WorkoutHistory = ({ route }) => {
  const { session } = route.params;
  const { progress, error } = useFetchWorkoutProgress(session.user.id);
  const navigation = useNavigation();

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const navigateToSessionDetails = (sessionId) => {
    navigation.navigate('WorkoutProgress', { sessionId });
  };

  return (
    <View>
      <FlatList
        data={progress}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text onPress={() => navigateToSessionDetails(item.id)}>Session: {item.session_name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default WorkoutHistory;
