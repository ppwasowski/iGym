import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/Dashboard';
import WorkoutList from '../screens/WorkoutList';
import WorkoutDetails from '../screens/WorkoutDetails';
import BodypartView from '../screens/Bodyparts';
import ExercisesList from '../screens/ExercisesList';
import ExerciseDetails from '../screens/ExerciseDetails';
import ExerciseSession from '../screens/ExerciseSession';
import ExerciseWorkout from '../screens/ExerciseWorkout';
import ExerciseProgress from '../screens/ExerciseProgress';
import WorkoutProgress from '../screens/WorkoutProgress';
import WorkoutSelection from '../screens/WorkoutSelection';
import AddWorkout from '../screens/AddWorkout';
import CustomHeader from '../components/CustomHeader';

const Stack = createStackNavigator();

const CombinedStack = ({ route }) => {
  const { session, initialRouteName } = route?.params || {};
  
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName || "Dashboard"}
      screenOptions={({ route, navigation }) => ({
        // Pass the title to the CustomHeader component
        header: (props) => <CustomHeader {...props} title={props.options.headerTitle} />,
      })}
    >
      <Stack.Screen
        name="Dashboard"
        options={{ headerTitle: 'Dashboard' }}
      >
        {(props) => <Dashboard {...props} session={session} />}
      </Stack.Screen>

      <Stack.Screen
        name="WorkoutList"
        component={WorkoutList}
        initialParams={{ session }}
        options={{ headerTitle: 'Workout Plans' }}
      />

      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetails}
        options={({ route }) => ({ headerTitle: 'Workout Plan' })}
        initialParams={{ session }}
      />

      <Stack.Screen
        name="Bodyparts"
        component={BodypartView}
        initialParams={({ route }) => ({ session, workoutId: route.params?.workoutId })}
        options={{ headerTitle: 'Bodyparts' }}
      />

      <Stack.Screen
        name="ExercisesList"
        component={ExercisesList}
        options={({ route }) => ({ headerTitle: 'Exercises List' })}
        initialParams={{ session }}
      />

      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetails}
        options={({ route }) => ({ headerTitle: route.params.name || 'Exercise Details' })}
      />

      <Stack.Screen
        name="ExerciseSession"
        component={ExerciseSession}
        initialParams={{ session }}
        options={{ headerTitle: 'Exercise Session' }}
      />

      <Stack.Screen
        name="ExerciseWorkout"
        component={ExerciseWorkout}
        initialParams={{ session }}
        options={{ headerTitle: 'Exercise Workout' }}
      />

      <Stack.Screen
        name="ExerciseProgress"
        component={ExerciseProgress}
        initialParams={{ session }}
        options={{ headerTitle: 'Exercise Progress' }}
      />

      <Stack.Screen
        name="WorkoutProgress"
        component={WorkoutProgress}
        initialParams={{ session }}
        options={{ headerTitle: 'Workout Progress' }}
      />

      <Stack.Screen
        name="WorkoutSelection"
        component={WorkoutSelection}
        initialParams={{ session }}
        options={{ headerTitle: 'Select Workout' }}
      />

      <Stack.Screen
        name="AddWorkout"
        component={AddWorkout}
        initialParams={{ session }}
        options={{ headerTitle: 'Add Workout' }}
      />
    </Stack.Navigator>
  );
};

export default CombinedStack;
