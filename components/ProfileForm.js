import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native'; // <-- Import ActivityIndicator
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../context/UserContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';

const FormItem = styled(View, 'py-1');
const Label = styled(Text, 'text-Primary text-md font-bold mb-2');
const ButtonContainer = styled(View, 'mt-4 flex-row justify-between');

export default function ProfileForm({ onClose }) {
  const { profile, updateProfile, error, loading: profileLoading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
  });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    if (profile && !isProfileLoaded) {
      setFormData({
        id: profile.id || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age?.toString() || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        gender: profile.gender || '',
      });
      setGender(profile.gender || '');
      setIsProfileLoaded(true); // Indicate that the profile data has been loaded
    }
  }, [profile, isProfileLoaded]);

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

    setSaving(true);
    try {
      await updateProfile(updatedProfile);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User updated successfully',
      });
      if (onClose) onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: error.message,
      });
    } finally {
      setSaving(false);
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
      <Label>{item.label}</Label>
      <Input
        onChangeText={item.setValue}
        value={isProfileLoaded ? item.value : ''}
        placeholder={isProfileLoaded ? item.placeholder : ''}
        secureTextEntry={item.secureTextEntry}
        autoCapitalize="none"
        keyboardType={item.keyboardType}
        className="border border-Secondary bg-background text-Text rounded-md px-4 py-2"
      />
      {!isProfileLoaded && (
        <ActivityIndicator size="small" color='#00C87C' />  // Loading indicator while profile data is loading
      )}
    </FormItem>
  );

  if (profileLoading || !isProfileLoaded) {  // Display loading screen until profile is fully loaded
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="p-6 bg-background rounded-lg items-center">
        {saving ? (
          <LoadingScreen message='Saving...' />
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
                <ButtonContainer>
                  <Button className="w-1/2" title="Save" onPress={handleSubmit} />
                  <Button title="Close" onPress={onClose} />
                </ButtonContainer>
                <Toast />
              </>
            )}
            contentContainerStyle="p-3 flex-grow justify-center"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 50,
    borderColor: '#4B4B4B',
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
