import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { CircularProgress } from 'react-native-svg-circular-progress';
import Modal from 'react-native-modal'; // Import react-native-modal

const ProfBlock = styled(View, 'bg-Secondary p-4 my-1 rounded-lg w-full items-center');
const ProfTitle = styled(Text, 'text-md text-white font-bold');
const ProfText = styled(Text, 'text-lg text-Primary font-bold');
const CloseButton = styled(TouchableOpacity, 'bg-Primary p-3 rounded-lg mt-4');

// BMI Categories and Colors
const getBMICategory = (bmi) => {
  if (bmi < 16.0) return { category: 'Underweight (Severe Thinness)', color: '#B3E5FC' }; // Light Blue
  if (bmi >= 16.0 && bmi < 17.0) return { category: 'Underweight (Moderate Thinness)', color: '#81D4FA' }; // Moderate Blue
  if (bmi >= 17.0 && bmi < 18.5) return { category: 'Underweight (Mild Thinness)', color: '#4FC3F7' }; // Mild Blue
  if (bmi >= 18.5 && bmi < 25.0) return { category: 'Normal Range', color: '#00C87C' }; // Primary Color (Green)
  if (bmi >= 25.0 && bmi < 30.0) return { category: 'Overweight (Pre-obese)', color: '#ff9a03' }; // Alter Color (Orange)
  if (bmi >= 30.0 && bmi < 35.0) return { category: 'Obese (Class I)', color: '#FF6F61' }; // Lighter Red
  if (bmi >= 35.0 && bmi < 40.0) return { category: 'Obese (Class II)', color: '#FF5252' }; // Slightly Darker Red
  return { category: 'Obese (Class III)', color: '#D32F2F' }; // Deep Red
};

const BMICalculator = ({ height, weight }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  if (!height || !weight) return <ProfText>N/A</ProfText>;

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  const { category, color } = getBMICategory(bmi);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <TouchableOpacity onPress={toggleModal}>
      <ProfBlock className="w-full">
        <View className="flex-row justify-between items-center">
          <View style={{ flex: 1 }}>
            <ProfTitle>BMI:</ProfTitle>
            <ProfText className="text-[14px]" style={{ color }}>
              {category}
            </ProfText>
          </View>

          <View style={{ flexShrink: 0 }}>
            <CircularProgress
              radius={40}
              value={Math.min(bmi, 40)}
              maxValue={40}
              strokeWidth={8}
              blankColor="#232323"
              donutColor={color}
              fillColor="#2e2e2e"
            >
              <ProfText style={{ color: color, fontSize: 18, fontWeight: 'bold' }}>
                {bmi}
              </ProfText>
            </CircularProgress>
          </View>
        </View>
      </ProfBlock>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View className="bg-background p-5 rounded-lg">
          <ProfTitle className='text-xl text-center'>BMI Categories</ProfTitle>
          <ScrollView>
            <ProfBlock className='items-start'>
              <Text className="text-[#B3E5FC] my-2">Underweight (Severe Thinness): <Text className='text-Text'>Less than 16.0</Text></Text>
              <Text className="text-[#81D4FA] my-2">Underweight (Moderate Thinness): <Text className='text-Text'>16.0 - 16.9</Text></Text>
              <Text className="text-[#4FC3F7] my-2">Underweight (Mild Thinness): <Text className='text-Text'>17.0 - 18.4</Text></Text>
              <Text className="text-[#00C87C] my-2">Normal Range: <Text className='text-Text'>18.5 - 24.9</Text></Text>
              <Text className="text-[#ff9a03] my-2">Overweight (Pre-obese): <Text className='text-Text'>25.0 - 29.9</Text></Text>
              <Text className="text-[#FF6F61] my-2">Obese (Class I): <Text className='text-Text'>30.0 - 34.9</Text></Text>
              <Text className="text-[#FF5252] my-2">Obese (Class II): <Text className='text-Text'>35.0 - 39.9</Text></Text>
              <Text className="text-[#D32F2F] my-2">Obese (Class III): <Text className='text-Text'>40.0 or higher</Text></Text>
            </ProfBlock>
            <ProfBlock className='items-start'>
              <ProfTitle>How BMI is Calculated</ProfTitle>
              <ProfText className="text-sm mt-2">
                BMI = weight (kg) / height² (m²)
              </ProfText>
            </ProfBlock>
          </ScrollView>
          <CloseButton onPress={toggleModal}>
            <Text className="text-white text-center font-bold">Close</Text>
          </CloseButton>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default BMICalculator;
