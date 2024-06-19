import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Account';
import WorkoutHistory from '../screens/WorkoutHistory';
import FavoriteExercises from '../screens/FavoriteExercises.jsx';
import PersonalRecords from '../screens/PersonalRecords';

const Stack = createStackNavigator();

const AccountStack = ({ session }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Account" options={{ headerShown: false }}>
        {(props) => <Account {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistory} />
      <Stack.Screen name="FavoriteExercises" component={FavoriteExercises} />
      <Stack.Screen name="PersonalRecords" component={PersonalRecords} />
    </Stack.Navigator>
  );
};

export default AccountStack;
