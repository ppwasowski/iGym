import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const ModalContainer = styled(View, 'flex-1 justify-center items-center bg-black/50');
const AlertBox = styled(View, 'w-80 bg-background p-6 rounded-lg');
const AlertTitle = styled(Text, 'text-Text text-xl font-bold mb-4 text-center');
const AlertMessage = styled(Text, 'text-Text text-base mb-6 text-center');
const ButtonContainer = styled(View, 'justify-center');
const AlertButton = styled(TouchableOpacity, 'px-4 py-2 rounded-lg');
const AlertButtonText = styled(Text, 'text-lg text-white');

const InfoAlert = ({ visible, title, message, onConfirm, closeText = 'Close' }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <ModalContainer>
        <AlertBox>
          <AlertTitle>{title}</AlertTitle>
          <AlertMessage>{message}</AlertMessage>
          <ButtonContainer>
            <AlertButton className="bg-Primary" onPress={onConfirm}>
              <AlertButtonText>{closeText}</AlertButtonText>
            </AlertButton>
          </ButtonContainer>
        </AlertBox>
      </ModalContainer>
    </Modal>
  );
};

export default InfoAlert;
