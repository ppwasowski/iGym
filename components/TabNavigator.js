import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import CombinedStack from './CombinedStack';
import AccountStack from '../components/AccountStack';
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
          paddingBottom: 1,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        options={{ headerTitle: () => <LogoTitle />, headerTitleAlign: 'center' }}
      >
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
      <Tab.Screen
        options={{ headerShown: false }}
        name="Profile"
      >
        {props => <AccountStack {...props} session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;