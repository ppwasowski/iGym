import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutList from '../screens/WorkoutList';
import WorkoutDetails from '../screens/WorkoutDetails';
import BodypartView from '../screens/Bodyparts';
import ExercisesList from '../screens/ExercisesList';
import ExerciseDetails from '../screens/ExerciseDetails';
import ExerciseSession from '../screens/ExerciseSession';
import ExerciseWorkout from '../screens/ExerciseWorkout';
import WorkoutProgress from '../screens/WorkoutProgress';
import WorkoutSelection from '../screens/WorkoutSelection';
import AddWorkout from '../screens/AddWorkout';
import CustomHeader from '../components/CustomHeader';

const Stack = createStackNavigator();

const CombinedStack = ({ route }) => {
  const { session, initialRouteName } = route.params;
  const userId = session.user.id;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        header: () => <CustomHeader title={route.name} />,
      })}
    >
      <Stack.Screen
        name="WorkoutList"
        component={WorkoutList}
        initialParams={{ session }}
      />
      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetails}
        options={({ route }) => ({ title: route.params.workoutName })}
        initialParams={{ session, userId }}
      />
      <Stack.Screen
        name="Bodyparts"
        component={BodypartView}
        initialParams={({ route }) => ({ session, workoutId: route.params?.workoutId })}
      />
      <Stack.Screen
        name="ExercisesList"
        component={ExercisesList}
        options={({ route }) => ({ title: route.params.bodypartId })}
        initialParams={{ session }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetails}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen
        name="ExerciseSession"
        component={ExerciseSession}
        initialParams={{ session }}
      />
      <Stack.Screen
        name="ExerciseWorkout"
        component={ExerciseWorkout}
        initialParams={{ session }}
      />
      <Stack.Screen
        name="WorkoutProgress"
        component={WorkoutProgress}
        initialParams={{ session }}
      />
      <Stack.Screen
        name="WorkoutSelection"
        component={WorkoutSelection}
        initialParams={{ session }}
      />
      <Stack.Screen
        name="AddWorkout"
        component={AddWorkout}
        initialParams={{ session }}
      />
    </Stack.Navigator>
  );
};

export default CombinedStack;