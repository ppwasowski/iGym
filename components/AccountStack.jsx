import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Profile';
import WorkoutHistory from '../screens/WorkoutHistory';
import FavoriteExercises from '../screens/FavoriteExercises';
import PersonalRecords from '../screens/PersonalRecords';
import WorkoutProgress from '../screens/WorkoutProgress';

const Stack = createStackNavigator();

const AccountStack = ({ session }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Account" options={{ headerShown: false }}>
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
      <Stack.Screen name="WorkoutProgress">
        {(props) => <WorkoutProgress {...props} session={session} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AccountStack;
