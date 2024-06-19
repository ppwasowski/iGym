import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import CombinedStack from './CombinedStack';

const Tab = createBottomTabNavigator();

function LogoTitle() {
  return (
    <Image
      style={{ width: 250, height: 100 }}
      source={require('../assets/images/logo.png')}
    />
  );
}

const TabNavigator = ({ session }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'pulse' : 'pulse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        options={{ headerTitle: () => <LogoTitle />, headerTitleAlign: 'center' }}>
        {() => <Dashboard session={session} />}
      </Tab.Screen>
      <Tab.Screen
        options={{ headerShown: false }}
        name="Exercises"
        component={CombinedStack}
        initialParams={{ session, initialRouteName: 'Bodyparts' }}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Workouts"
        component={CombinedStack}
        initialParams={{ session, initialRouteName: 'WorkoutList' }}
      />
      <Tab.Screen name="Profile">
        {props => <Profile {...props} session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
