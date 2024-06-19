import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { FavoriteProvider } from './utility/FavoriteContext';
import AuthStack from './components/AuthStack';
import TabNavigator from './components/TabNavigator';
import useSession from './hooks/useSession';

const App = () => {
  const session = useSession();

  return (
    <FavoriteProvider>
      <NavigationContainer>
        {session ? (
          <TabNavigator session={session} />
        ) : (
          <AuthStack />
        )}
        <Toast />
      </NavigationContainer>
    </FavoriteProvider>
  );
};

export default App;
