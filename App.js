import React from 'react';
import { View } from 'react-native'; // Ensure View is imported
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind'; // Import styled from nativewind
import { FavoriteProvider } from './context/FavoriteContext';
import { UserProvider } from './context/UserContext'; 
import AuthStack from './components/AuthStack';
import TabNavigator from './components/TabNavigator';
import useSession from './hooks/useSession';


const AppContainer = styled(View, 'flex-1 bg-background text-Text'); 

const App = () => {
  const session = useSession();

  return (
    <UserProvider session={session}>
      <FavoriteProvider>
        <AppContainer>
          <NavigationContainer>
            {session ? (
              <TabNavigator session={session} />
            ) : (
              <AuthStack />
            )}
          </NavigationContainer>
          <Toast />
        </AppContainer>
      </FavoriteProvider>
    </UserProvider>
  );
};

export default App;
