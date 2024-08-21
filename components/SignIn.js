import React, { useState, useEffect } from 'react';
import { Alert, AppState, View, ActivityIndicator } from 'react-native';
import { supabase } from '../utility/supabase';
import Input from '../components/Input';
import Button from '../components/Button';
import Container from '../components/Container';
import { styled } from 'nativewind';
import LoadingScreen from './LoadingScreen';

const FormItem = styled(View, 'py-1');
const FormContainer = styled(Container, 'flex-1 p-4');

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  if (loading) {
    return (
      <LoadingScreen message='Singing in...'/>
    );
  }

  return (
    <FormContainer>
      <FormItem>
        <Input
          label="Email"
          placeholder="email@address.com"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
        />
      </FormItem>
      <FormItem>
        <Input
          label="Password"
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </FormItem>
      <FormItem className="mt-5">
        <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
      </FormItem>
      <FormItem>
        <Button title="Sign up" disabled={loading} onPress={() => navigation.navigate('SignUp')} />
      </FormItem>
    </FormContainer>
  );
}
