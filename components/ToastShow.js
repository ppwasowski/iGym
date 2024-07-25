import Toast from 'react-native-toast-message';

Toast.show({
  type: 'success',
  text1: 'Success',
  text2: 'Your action was successful!',
});
Toast.show({
  type: 'error',
  text1: 'Error',
  text2: 'Something went wrong!',
});
