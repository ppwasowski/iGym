import Toast from 'react-native-toast-message';

const ToastShow = (type, text1, text2) => {
  Toast.show({
    type: type || 'success',
    text1: text1 || 'Success',
    text2: text2 || 'Operation completed successfully'
  });
};

export default ToastShow;
