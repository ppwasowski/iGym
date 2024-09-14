import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { supabase } from '../utility/supabase';
import Icon from './Icon';

const ModalContainer = styled(View, 'flex-1 justify-center items-center bg-black/50');
const AlertBox = styled(View, 'w-80 bg-background p-6 rounded-lg');
const AlertTitle = styled(Text, 'text-Text text-xl font-bold text-center mb-4');
const AlertMessage = styled(View, 'mb-4');
const MessageText = styled(Text, 'text-Text text-base mb-1 text-start');
const BoldText = styled(Text, 'font-bold text-Text text-base capitalize');
const ButtonContainer = styled(View, 'flex-row justify-around');
const AlertButton = styled(TouchableOpacity, 'px-4 py-2 rounded-lg');
const AlertButtonText = styled(Text, 'text-lg text-white');

const GoalAchievedModal = ({ visible, onClose, goal }) => {
  const [exerciseName, setExerciseName] = useState('N/A');
  const [categoryName, setCategoryName] = useState('N/A');

  useEffect(() => {
    const fetchExerciseName = async () => {
      if (goal?.exercise_id) {
        const { data: exerciseData, error } = await supabase
          .from('exercises')
          .select('name')
          .eq('id', goal.exercise_id)
          .single();
          
        if (!error && exerciseData) {
          setExerciseName(exerciseData.name);
        }
      }
    };

    const fetchCategoryName = async () => {
      if (goal?.category_id) {
        const { data: categoryData, error } = await supabase
          .from('goal_categories')
          .select('name')
          .eq('id', goal.category_id)
          .single();
          
        if (!error && categoryData) {
          setCategoryName(categoryData.name);
        }
      }
    };

    fetchExerciseName();
    fetchCategoryName();
  }, [goal]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalContainer>
        <AlertBox>
          <View className='flex-row justify-center w-full relative'>
            <AlertTitle>Congratulations!</AlertTitle>
            <Icon name="rocket-outline" size={24} color="SecAlter" style={{ position: 'absolute', right: 0 }} />
          </View>
          
          <AlertMessage>
            <MessageText className='text-center text-Primary'>You've achieved your goal!</MessageText>
            {(categoryName !== 'Workout Completion' && categoryName !== 'Consistency') && (
              <>
              <MessageText className='text-Alter mt-4'>Exercise:</MessageText>
              <BoldText>{exerciseName || 'N/A'}</BoldText>
              </>
            )}
          </AlertMessage>
          <AlertMessage>
            <MessageText className='text-Alter'>Category: </MessageText>
            <BoldText>{categoryName || 'Unknown Category'}</BoldText>
            {(categoryName !== 'Workout Completion' && categoryName !== 'Consistency') && (
            <BoldText className=''>{goal?.metric_type || 'Unknown Metric'}</BoldText>
            )}
          </AlertMessage>

          


          <AlertMessage>
            <MessageText className='text-center'>Target</MessageText>
            <BoldText className='text-center text-Primary'>{goal?.target_value || 0}</BoldText>
          </AlertMessage>

          <ButtonContainer>
            <AlertButton className="bg-green-500" onPress={onClose}>
              <AlertButtonText className="text-white">Close</AlertButtonText>
            </AlertButton>
          </ButtonContainer>
        </AlertBox>
      </ModalContainer>
    </Modal>
  );
};

export default GoalAchievedModal;
