// AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './SignIn';
import SignUp from './SignUp';
import CustomHeader from '../components/CustomHeader';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader title={route.name} />,
        headerStyle: {
          height: 100
        },
      })}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthStack;
