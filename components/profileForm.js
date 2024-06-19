import React, { useState } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';

const ProfileForm = ({ profile, loading, updateProfile }) => {
  const [formState, setFormState] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    age: profile.age || '',
    height: profile.height || '',
    weight: profile.weight || '',
  });

  const handleInputChange = (key, value) => {
    setFormState({
      ...formState,
      [key]: value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(formState);
      Alert.alert('Profile updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="First Name"
          value={formState.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Last Name"
          value={formState.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Age"
          value={formState.age}
          onChangeText={(text) => handleInputChange('age', text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Height"
          value={formState.height}
          onChangeText={(text) => handleInputChange('height', text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Weight"
          value={formState.weight}
          onChangeText={(text) => handleInputChange('weight', text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={handleUpdateProfile}
          disabled={loading}
        />
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
  mt20: {
    marginTop: 20,
  },
});

export default ProfileForm;
