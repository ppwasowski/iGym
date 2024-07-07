import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { FavoriteProvider } from './context/FavoriteContext';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import AuthStack from './components/AuthStack';
import TabNavigator from './components/TabNavigator';
import useSession from './hooks/useSession';

const App = () => {
  const session = useSession();

  return (
    <FavoriteProvider>
      <UserProvider session={session}>
        <NavigationContainer>
          {session ? (
            <TabNavigator session={session} />
          ) : (
            <AuthStack />
          )}
          <Toast />
        </NavigationContainer>
      </UserProvider>
    </FavoriteProvider>
  );
};

export default App;
