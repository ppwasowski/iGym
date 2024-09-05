import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { CircularProgress } from 'react-native-svg-circular-progress'; // Circular Progress library

// Styling
const ProfBlock = styled(View, 'bg-Secondary p-4 my-1 rounded-lg w-full items-center');
const ProfTitle = styled(Text, 'text-md text-white font-bold');
const ProfText = styled(Text, 'text-lg text-Primary font-bold');

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
  if (!height || !weight) return <ProfText>N/A</ProfText>;

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  const { category, color } = getBMICategory(bmi);

  return (
    <ProfBlock className="w-[98%]">
      <View className="flex-row justify-between items-center">
        {/* BMI Category Info on the left */}
        <View style={{ flex: 1 }}>
          <ProfTitle>BMI:</ProfTitle>
          <ProfText className="text-[14px]" style={{ color }}>
            {category}
          </ProfText>
        </View>

        {/* CircularProgress on the right */}
        <View style={{ flexShrink: 0 }}>
          <CircularProgress
            radius={40}
            value={Math.min(bmi, 40)}
            maxValue={40}
            strokeWidth={8}
            blankColor = "#232323"
            donutColor = {color}
            fillColor="#2e2e2e"
          >
            <ProfText style={{ color: color, fontSize: 18, fontWeight: 'bold' }}>
              {bmi}
            </ProfText>
          </CircularProgress>
        </View>
      </View>
    </ProfBlock>
  );
};

export default BMICalculator;
