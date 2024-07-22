import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, Modal, ActivityIndicator, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../context/UserContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Container from '../components/Container';
import { styled } from 'nativewind';

const FormItem = styled(View, 'py-2');
const Label = styled(Text, 'text-Text font-bold mb-2');

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
        id: profile.id || '', // Add id to formData
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
    <FormItem>
      <Label>{item.label}:</Label>
      <Input
        onChangeText={item.setValue}
        value={item.value}
        placeholder={item.placeholder}
        secureTextEntry={item.secureTextEntry}
        autoCapitalize="none"
        keyboardType={item.keyboardType}
        className="border border-Secondary bg-background text-Text rounded-md px-4 py-2"
      />
    </FormItem>
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
        <View className="flex-1 justify-center items-center bg-blend-darken">
          <View className="w-4/5 p-6 bg-background rounded-lg items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
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
                        items={[
                          { label: 'Male', value: 'male' },
                          { label: 'Female', value: 'female' },
                        ]}
                        setOpen={setOpen}
                        setValue={setGender}
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
                    <FormItem className="mt-4">
                      <Button title="Save" onPress={handleSubmit} />
                      <Button title="Close" onPress={() => setModalVisible(false)} />
                      <Toast />
                      {loading && <ActivityIndicator size="large" color="#0000ff" />}
                    </FormItem>
                  </>
                )}
                contentContainerStyle="p-3 flex-grow justify-center"
              />
            )}
          </View>
        </View>
      </Modal>
    </>
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
