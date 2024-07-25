import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { FavoriteProvider } from './context/FavoriteContext';
import { UserProvider } from './context/UserContext'; 
import AuthStack from './components/AuthStack';
import TabNavigator from './components/TabNavigator';
import useSession from './hooks/useSession';

const App = () => {
  const session = useSession();

  return (
    <UserProvider session={session}>
      <FavoriteProvider>
        <NavigationContainer>
          {session ? (
            <TabNavigator session={session} />
          ) : (
            <AuthStack />
          )}
        </NavigationContainer>
        <Toast />
      </FavoriteProvider>
    </UserProvider>
  );
};

export default App;
