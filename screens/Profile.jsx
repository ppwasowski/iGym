import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileForm from '../components/ProfileForm';
import { UserContext } from '../context/UserContext';
import { supabase } from '../utility/supabase';
import Button from '../components/Button';
import Container from '../components/Container';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';

const ButtonView = styled(View, 'm-2');

const Account = () => {
  const { profile, loading, error } = useContext(UserContext);
  const navigation = useNavigation();
  const [showProfileForm, setShowProfileForm] = useState(false);

  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  return (
    <Container className="p-4 space-y-2 flex-1 justify-start">
      {showProfileForm ? (
        <ProfileForm onClose={() => setShowProfileForm(false)} />
      ) : (
        <>
          <ButtonView>
            <Button
              title="Edit Personal Info"
              onPress={() => setShowProfileForm(true)}
            />
          </ButtonView>
          <ButtonView>
            <Button
              title="Workout History"
              onPress={() => navigation.navigate('WorkoutHistory')}
            />
          </ButtonView>
          <ButtonView>
            <Button
              title="Favorite Exercises"
              onPress={() => navigation.navigate('FavoriteExercises')}
            />
          </ButtonView>
          <ButtonView>
            <Button
              title="Personal Records"
              onPress={() => navigation.navigate('PersonalRecords')}
            />
          </ButtonView>
          <ButtonView>
            <Button
              title="My Goals"
              onPress={() => navigation.navigate('Goals')}
            />
          </ButtonView>
          <ButtonView>
            <Button
              title="Sign Out"
              onPress={() => supabase.auth.signOut()}
            />
          </ButtonView>
          <Toast />
        </>
      )}
    </Container>
  );
};

export default Account;
