import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const GoalAchievedModal = ({ visible, onClose, goalName }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-6 rounded-lg">
          <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
          <Text className="text-2xl font-bold text-center mb-4">
            Congratulations!
          </Text>
          <Text className="text-lg text-center mb-4">
            You've achieved your goal: {goalName}
          </Text>
          <TouchableOpacity onPress={onClose} className="mt-4 bg-green-500 p-3 rounded">
            <Text className="text-white text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GoalAchievedModal;
