// ProfileForm.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';

export default function ProfileForm({ profile, updateProfile }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    weight: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age?.toString() || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || ''
      });
    }
  }, [profile]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const updatedProfile = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null
    };
    updateProfile(updatedProfile);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        value={formData.first_name}
        onChangeText={(value) => handleInputChange('first_name', value)}
      />
      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        value={formData.last_name}
        onChangeText={(value) => handleInputChange('last_name', value)}
      />
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={formData.age}
        onChangeText={(value) => handleInputChange('age', value)}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Height:</Text>
      <TextInput
        style={styles.input}
        value={formData.height}
        onChangeText={(value) => handleInputChange('height', value)}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Weight:</Text>
      <TextInput
        style={styles.input}
        value={formData.weight}
        onChangeText={(value) => handleInputChange('weight', value)}
        keyboardType="numeric"
      />
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
