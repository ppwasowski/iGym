import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Profile';
import WorkoutHistory from '../screens/WorkoutHistory';
import FavoriteExercises from '../screens/FavoriteExercises';
import PersonalRecords from '../screens/PersonalRecords';
import CustomHeader from '../components/CustomHeader';
import Goals from '../screens/Goals'
import AddGoal from '../screens/AddGoal'


const Stack = createStackNavigator();

const AccountStack = ({ session }) => {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        // Pass the headerTitle dynamically to CustomHeader
        header: (props) => <CustomHeader {...props} title={props.options.headerTitle} />,
      })}
    >
      <Stack.Screen
        name="Account"
        options={{ headerTitle: 'My Account' }}
      >
        {(props) => <Account {...props} session={session} />}
      </Stack.Screen>

      <Stack.Screen
        name="WorkoutHistory"
        options={{ headerTitle: 'Workout History' }}
      >
        {(props) => <WorkoutHistory {...props} session={session} />}
      </Stack.Screen>

      <Stack.Screen
        name="FavoriteExercises"
        options={{ headerTitle: 'Favorite Exercises' }}
      >
        {(props) => <FavoriteExercises {...props} session={session} />}
      </Stack.Screen>

      <Stack.Screen
        name="PersonalRecords"
        options={{ headerTitle: 'Personal Records' }}
      >
        {(props) => <PersonalRecords {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen
        name="Goals"
        options={{ headerTitle: 'My Goals' }}
      >
        {(props) => <Goals {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen
        name="AddGoal"
        options={{ headerTitle: 'Add Goal' }}
        >
        {(props) => <AddGoal {...props} session={session}/>}
      </Stack.Screen>

    </Stack.Navigator>
  );
};

export default AccountStack;
