import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import ProfileForm from '../components/ProfileForm';
import useUserProfile from '../hooks/useUserProfile';
import { supabase } from '../utility/supabase';

const Account = ({ session }) => {
  const { profile, loading, error, updateProfile } = useUserProfile(session);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.optionText}>Edit Personal Info</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('WorkoutHistory')}>
        <Text style={styles.optionText}>Workout History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('FavoriteExercises')}>
        <Text style={styles.optionText}>Favorite Exercises</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('PersonalRecords')}>
        <Text style={styles.optionText}>Personal Records</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {profile && <ProfileForm profile={profile} updateProfile={updateProfile} />}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
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
