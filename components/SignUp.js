import React, { useState, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

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

      const userId = data.user.id;

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
    { label: 'Email', value: email, setValue: setEmail, placeholder: 'email@address.com', icon: 'envelope', keyboardType: 'default' },
    { label: 'Password', value: password, setValue: setPassword, placeholder: 'Password', icon: 'lock', secureTextEntry: true, keyboardType: 'default' },
    { label: 'First Name', value: firstName, setValue: setFirstName, placeholder: 'First Name', icon: 'user', keyboardType: 'default' },
    { label: 'Last Name', value: lastName, setValue: setLastName, placeholder: 'Last Name', icon: 'user', keyboardType: 'default' },
    { label: 'Age', value: age, setValue: setAge, placeholder: 'Age', icon: 'calendar', keyboardType: 'numeric' },
    { label: 'Height', value: height, setValue: setHeight, placeholder: 'Height', icon: 'arrows-v', keyboardType: 'numeric' },
    { label: 'Weight', value: weight, setValue: setWeight, placeholder: 'Weight', icon: 'balance-scale', keyboardType: 'numeric' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.verticallySpaced}>
      <Input
        label={item.label}
        leftIcon={{ type: 'font-awesome', name: item.icon }}
        onChangeText={item.setValue}
        value={item.value}
        placeholder={item.placeholder}
        secureTextEntry={item.secureTextEntry}
        autoCapitalize="none"
        keyboardType={item.keyboardType}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={formFields}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        ListFooterComponent={() => (
          <View>
            <View style={styles.verticallySpaced}>
              <Text style={styles.label}>Gender</Text>
              <DropDownPicker
                open={open}
                value={gender}
                items={items}
                setOpen={setOpen}
                setValue={setGender}
                setItems={setItems}
                placeholder="Select Gender"
                style={styles.picker}
                dropDownContainerStyle={styles.dropDownContainer}
              />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
              <Toast />
              {loading && <ActivityIndicator size="large" color="#0000ff" />}
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  flatListContent: {
    padding: 12,
    flexGrow: 1,
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  dropDownContainer: {
    borderColor: 'gray',
    backgroundColor: 'white',
  },
});
