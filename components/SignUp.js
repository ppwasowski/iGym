import React, { useState, useContext } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Container from '../components/Container';
import LoadingScreen from '../components/LoadingScreen'; // Import the LoadingScreen component
import { styled } from 'nativewind';

const FormItem = styled(View, 'py-1');
const Label = styled(Text, 'text-Text font-bold');

export default function SignUp() {
  const { refreshProfile } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Sign up error',
          text2: error.message,
        });
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Sign up error',
          text2: 'User ID not found after sign up.',
        });
        setLoading(false);
        return;
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error checking existing profile:', profileError.message);
      }

      let profileUpdateError;

      if (existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .update({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            age: parseInt(age, 10),
            height: parseFloat(height),
            weight: parseFloat(weight),
            email: email,
            gender: gender,
          })
          .eq('id', userId);

        profileUpdateError = error;
      } else {
        const { error } = await supabase.from('profiles').insert([
          {
            id: userId,
            first_name: firstName,
            last_name: lastName,
            age: parseInt(age, 10),
            height: parseFloat(height),
            weight: parseFloat(weight),
            email: email,
            gender: gender,
          },
        ]);

        profileUpdateError = error;
      }

      if (profileUpdateError) {
        Toast.show({
          type: 'error',
          text1: 'Profile error',
          text2: profileUpdateError.message,
        });
        setLoading(false);
        return;
      }

      await refreshProfile(userId);

      Toast.show({
        type: 'success',
        text1: 'Sign up successful!',
      });
    } catch (error) {
      console.error('Sign up error:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Sign up error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const formFields = [
    { label: 'Email', value: email, setValue: setEmail, placeholder: 'Email@address.com', icon: 'envelope', keyboardType: 'default' },
    { label: 'Password', value: password, setValue: setPassword, placeholder: 'Password', icon: 'lock', secureTextEntry: true, keyboardType: 'default' },
    { label: 'First Name', value: firstName, setValue: setFirstName, placeholder: 'First Name', icon: 'user', keyboardType: 'default' },
    { label: 'Last Name', value: lastName, setValue: setLastName, placeholder: 'Last Name', icon: 'user', keyboardType: 'default' },
    { label: 'Age', value: age, setValue: setAge, placeholder: 'Age', icon: 'calendar', keyboardType: 'numeric' },
    { label: 'Height', value: height, setValue: setHeight, placeholder: 'Height', icon: 'arrows-v', keyboardType: 'numeric' },
    { label: 'Weight', value: weight, setValue: setWeight, placeholder: 'Weight', icon: 'balance-scale', keyboardType: 'numeric' },
  ];

  const renderItem = ({ item }) => (
    <FormItem>
      <Label>{item.label}</Label>
      <Input
        onChangeText={item.setValue}
        value={item.value}
        placeholder={item.placeholder}
        secureTextEntry={item.secureTextEntry}
        autoCapitalize="none"
        keyboardType={item.keyboardType}
      />
    </FormItem>
  );

  if (loading) {
    return <LoadingScreen message="Signing up..." />; // Display loading screen during sign up process
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <FlatList
          data={formFields}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
          ListFooterComponent={() => (
            <>
              <FormItem>
                <Label>Gender</Label>
                <DropDownPicker
                  open={open}
                  value={gender}
                  items={items}
                  setOpen={setOpen}
                  setValue={setGender}
                  setItems={setItems}
                  placeholder="Select Gender"
                  style={styles.picker}
                  textStyle={styles.textPicker}
                  dropDownContainerStyle={styles.dropDownContainer}
                  selectedItemLabelStyle={styles.selectedItemLabel}
                  dropdownIconRippleColor="#FFFFFF"
                  arrowIconStyle={styles.arrowIcon}
                  tickIconStyle={styles.tickIcon}
                />
              </FormItem>
              <FormItem>
                <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
                <Toast />
              </FormItem>
            </>
          )}
          contentContainerStyle="p-3 flex-grow justify-center"
        />
      </Container>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 50,
    borderColor: 'gray',
    backgroundColor: '#232323',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
  },
  textPicker: {
    color: '#FFFFFF', // Text color for dropdown items
  },
  dropDownContainer: {
    borderColor: '#2a2a2a',
    backgroundColor: '#232323',
  },
  selectedItemLabel: {
    color: '#FFFFFF', // Selected item text color
  },
  arrowIcon: {
    tintColor: '#FFFFFF', // Arrow icon color
  },
  tickIcon: {
    tintColor: '#FFFFFF', // Tick icon color
  },
});
