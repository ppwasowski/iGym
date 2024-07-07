import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, Modal, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { UserContext } from '../context/UserContext';

export default function ProfileForm() {
  const { profile, updateProfile, error } = useContext(UserContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    weight: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    const updatedProfile = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null
    };

    setLoading(true);
    try {
      await updateProfile(updatedProfile);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User updated successfully'
      });
      setModalVisible(false); // Close modal on successful update
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button title="Edit Personal Info" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={styles.form}>
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
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
            )}
            {!loading && <Button title="Close" onPress={() => setModalVisible(false)} />}
          </View>
        </View>
      </Modal>
    </>
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
});
