import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/Dashboard';
import Account from '../screens/Profile';
import WorkoutHistory from '../screens/WorkoutHistory';
import FavoriteExercises from '../screens/FavoriteExercises';
import PersonalRecords from '../screens/PersonalRecords';
import WorkoutProgress from '../screens/WorkoutProgress';
import WorkoutList from '../screens/WorkoutList';
import WorkoutDetails from '../screens/WorkoutDetails';
import BodypartView from '../screens/Bodyparts';
import ExercisesList from '../screens/ExercisesList';
import ExerciseDetails from '../screens/ExerciseDetails';
import ExerciseSession from '../screens/ExerciseSession';
import ExerciseWorkout from '../screens/ExerciseWorkout';
import ExerciseProgress from '../screens/ExerciseProgress';
import WorkoutSelection from '../screens/WorkoutSelection';
import AddWorkout from '../screens/AddWorkout';
import CustomHeader from '../components/CustomHeader';

const Stack = createStackNavigator();

const CombinedStack = ({ route }) => {
  const { session, initialRouteName } = route?.params || {}; // Handle undefined route.params gracefully
  const userId = session?.user?.id;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName || "Dashboard"} // Default to "Dashboard" if initialRouteName is not provided
      screenOptions={({ route }) => ({
        header: () => <CustomHeader title={route.name} />,
      })}
    >
      {/* Dashboard Screen */}
      <Stack.Screen name="Dashboard">
        {(props) => <Dashboard {...props} session={session} />}
      </Stack.Screen>

      {/* Account related screens */}
      <Stack.Screen name="Account">
        {(props) => <Account {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="WorkoutHistory">
        {(props) => <WorkoutHistory {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="FavoriteExercises">
        {(props) => <FavoriteExercises {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="PersonalRecords">
        {(props) => <PersonalRecords {...props} session={session} />}
      </Stack.Screen>

      {/* Workout related screens */}
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
        name="ExerciseProgress"
        component={ExerciseProgress}
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
