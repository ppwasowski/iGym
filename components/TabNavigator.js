import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import CombinedStack from './CombinedStack';
import CustomHeader from '../components/CustomHeader';

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
        header: () => <CustomHeader title={route.name} />,
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
        tabBarActiveTintColor: '#00C87C',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        options={{ headerShown: false }} // Hide header since it's part of CombinedStack now
      >
        {() => (
          <CombinedStack
            route={{ params: { session, initialRouteName: 'DashboardScreen' } }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Exercises"
        options={{ headerShown: false }}
      >
        {() => (
          <CombinedStack
            route={{ params: { session, initialRouteName: 'Bodyparts' } }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Workouts"
        options={{ headerShown: false }}
      >
        {() => (
          <CombinedStack
            route={{ params: { session, initialRouteName: 'WorkoutList' } }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
      >
        {() => (
          <CombinedStack
            route={{ params: { session, initialRouteName: 'AccountScreen' } }}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
