import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, Modal, ActivityIndicator, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../context/UserContext';

export default function ProfileForm() {
  const { profile, updateProfile, error } = useContext(UserContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(formData.gender);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age?.toString() || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        gender: profile.gender || '',
      });
      setGender(profile.gender || '');
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
      weight: formData.weight ? parseFloat(formData.weight) : null,
      gender: gender,
    };

    setLoading(true);
    try {
      await updateProfile(updatedProfile);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User updated successfully',
      });
      setModalVisible(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { label: 'First Name', value: formData.first_name, setValue: (value) => handleInputChange('first_name', value), placeholder: 'First Name' },
    { label: 'Last Name', value: formData.last_name, setValue: (value) => handleInputChange('last_name', value), placeholder: 'Last Name' },
    { label: 'Age', value: formData.age, setValue: (value) => handleInputChange('age', value), placeholder: 'Age', keyboardType: 'numeric' },
    { label: 'Height', value: formData.height, setValue: (value) => handleInputChange('height', value), placeholder: 'Height', keyboardType: 'numeric' },
    { label: 'Weight', value: formData.weight, setValue: (value) => handleInputChange('weight', value), placeholder: 'Weight', keyboardType: 'numeric' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.verticallySpaced}>
      <Text style={styles.label}>{item.label}:</Text>
      <TextInput
        style={styles.input}
        value={item.value}
        onChangeText={item.setValue}
        placeholder={item.placeholder}
        keyboardType={item.keyboardType}
      />
    </View>
  );

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
                        items={[
                          { label: 'Male', value: 'male' },
                          { label: 'Female', value: 'female' },
                        ]}
                        setOpen={setOpen}
                        setValue={setGender}
                        placeholder="Select Gender"
                        style={styles.picker}
                        dropDownContainerStyle={styles.dropDownContainer}
                      />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                      <Button title="Save" onPress={handleSubmit} />
                      <Button title="Close" onPress={() => setModalVisible(false)} />
                      <Toast />
                      {loading && <ActivityIndicator size="large" color="#0000ff" />}
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.flatListContent}
              />
            )}
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
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  flatListContent: {
    padding: 12,
    flexGrow: 1,
    justifyContent: 'center',
  },
});
