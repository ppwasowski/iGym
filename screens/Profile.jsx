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
import Icon from '@/components/Icon';
import BMICalculator from '../components/BMICalculator';

const ButtonView = styled(View, 'my-2 w-[47%]');
const ProfBlock = styled(View, 'bg-Secondary p-4 my-1 rounded-lg w-[47%] items-left');
const ProfTitle = styled(Text, 'text-md text-white font-bold');
const ProfText = styled(Text, 'text-lg text-Primary font-bold');
const ButtonRow = styled(View, 'flex-row justify-between w-full my-2 absolute bottom-2');

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
    <Container className="p-4 space-y-2 flex-1 justify-start items-center">
        
      {showProfileForm ? (
        <ProfileForm onClose={() => setShowProfileForm(false)} />
      ) : (
        <>
          <ProfBlock className='w-full'>
            <View className='flex-row items-center justify-between'>
              <View className="flex-1">
                <ProfTitle className='text-center text-Primary text-xl'>
                  {profile?.first_name || 'Guest'} {profile?.last_name || ''}
                </ProfTitle>
              </View>
              <Icon name="person-circle" color="SecAlter" style="mr-2" />
            </View>
          </ProfBlock>
          
          <View className="flex-row w-full justify-between mb-2">
            <ProfBlock>
              <View className='flex-row items-center justify-between'>
                <View className="flex-1">
                  <ProfTitle>Height:</ProfTitle>
                  <ProfText>{profile?.height ? `${profile.height} cm` : 'N/A'}</ProfText>
                </View>
                <Icon name="body" color="Alter" style="mr-2" />
              </View>
            </ProfBlock>
            <ProfBlock className=''>
              <View className='flex-row items-center justify-between'>
                <View className="flex-1">
                  <ProfTitle>Weight:</ProfTitle>
                  <ProfText>{profile?.weight ? `${profile.weight} kg` : 'N/A'}</ProfText>
                </View>
                <Icon name="barbell" color="Alter" style="mr-2" />
              </View>
            </ProfBlock>
          </View>

          <BMICalculator height={profile?.height} weight={profile?.weight} />

          <View className="flex-row flex-wrap justify-between w-full">
            <ButtonView>
              <Button title="Workout History" onPress={() => navigation.navigate('WorkoutHistory')} />
            </ButtonView>
            <ButtonView>
              <Button title="Favorite Exercises" onPress={() => navigation.navigate('FavoriteExercises')} />
            </ButtonView>
            <ButtonView>
              <Button title="Personal Records" onPress={() => navigation.navigate('PersonalRecords')} />
            </ButtonView>
            <ButtonView>
              <Button title="My Goals" onPress={() => navigation.navigate('Goals')} />
            </ButtonView>
          </View>

          <ButtonRow>
            <ButtonView>
              <Button customStyle='bg-SecAlter'  title="Edit Account" onPress={() => setShowProfileForm(true)} />
            </ButtonView>
            <ButtonView>
              <Button customStyle='bg-Alter'   title="Sign Out" onPress={() => supabase.auth.signOut()} />
            </ButtonView>
          </ButtonRow>

          <Toast />
        </>
      )}
    </Container>
  );
};

export default Account;
