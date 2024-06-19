import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="SignIn" component={SignIn} />
        <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
      </Stack.Navigator>
    );
  };

export default AuthStack;