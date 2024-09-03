import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import useAddWorkout from '../services/useAddWorkout';
import Button from '../components/Button';
import Input from '../components/Input';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';

const Container = styled(ScrollView, 'flex-1 p-5 bg-background');
const Title = styled(Text, 'text-3xl text-Text mb-4');

const iconOptions = [
  { label: 'Fitness', value: 'fitness' },
  { label: 'Bicycle', value: 'bicycle' },
  { label: 'Barbell', value: 'barbell' },
  { label: 'Walk', value: 'walk' },
  { label: 'Nutrition', value: 'nutrition' },
  { label: 'Medal', value: 'medal' },
  { label: 'Heart', value: 'heart' },
  { label: 'Tennisball', value: 'tennisball' },
  { label: 'Basketball', value: 'basketball' },
];

const colorOptions = [
  { label: 'Tomato', value: '#FF6347' },
  { label: 'DodgerBlue', value: '#1E90FF' },
  { label: 'LimeGreen', value: '#32CD32' },
  { label: 'Gold', value: '#FFD700' },
  { label: 'HotPink', value: '#FF69B4' },
  { label: 'OrangeRed', value: '#FF4500' },
  { label: 'SeaGreen', value: '#2E8B57' },
  { label: 'SlateBlue', value: '#6A5ACD' },
  { label: 'LightSeaGreen', value: '#20B2AA' },
  { label: 'Crimson', value: '#DC143C' },
];

const AddWorkout = ({ navigation, route }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].value);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [iconOpen, setIconOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  const { refreshWorkouts } = route.params;
  const { addWorkout, loading, error } = useAddWorkout();

  const handleAddWorkout = async () => {
    const success = await addWorkout({ workoutName, iconName: selectedIcon, iconColor: selectedColor }, refreshWorkouts);
    if (success) {
      navigation.goBack(); 
    }
  };

  return (
    <Container contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      {error && <Title className="text-red-500">{error}</Title>}

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Ionicons name={selectedIcon} size={120} color={selectedColor} />
      </View>

      <Input
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
        className="mb-5"
        editable={!loading}
      />
        <DropDownPicker
          style={{ zIndex: 999, marginBottom: 20 }}
          open={iconOpen}
          value={selectedIcon}
          items={iconOptions}
          setOpen={(open) => {
            setIconOpen(open);
            setColorOpen(false);
          }}
          setValue={setSelectedIcon}
          placeholder="Select an Icon"
          dropDownContainerStyle={{ maxHeight: 200, zIndex: 1000 }}
          listMode="SCROLLVIEW"
        />

        <DropDownPicker
          style={{ zIndex: 999, marginBottom: 20 }}
          open={colorOpen}
          value={selectedColor}
          items={colorOptions}
          setOpen={(open) => {
            setIconOpen(false);
            setColorOpen(open);
          }}
          setValue={setSelectedColor}
          placeholder="Select a Color"
          dropDownContainerStyle={{ maxHeight: 200, zIndex: 999 }}
          listMode="SCROLLVIEW"
        />

      <Button title="Add Workout" onPress={handleAddWorkout} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#00C87C" />}
    </Container>
  );
};

export default AddWorkout;
