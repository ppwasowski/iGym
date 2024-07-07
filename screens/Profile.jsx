import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import ProfileForm from '../components/ProfileForm';
import { UserContext } from '../context/UserContext';
import { supabase } from '../utility/supabase';

const Account = () => {
  const { profile, loading, error } = useContext(UserContext);
  const navigation = useNavigation();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ProfileForm />
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('WorkoutHistory')}>
        <Text style={styles.optionText}>Workout History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('FavoriteExercises')}>
        <Text style={styles.optionText}>Favorite Exercises</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('PersonalRecords')}>
        <Text style={styles.optionText}>Personal Records</Text>
      </TouchableOpacity>
      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  optionButton: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Account;
