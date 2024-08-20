import React from 'react';
import { Text, ActivityIndicator } from 'react-native';
import usePersonalRecords from '../hooks/usePersonalRecords';
import RecordTable from '../components/RecordTable';
import Container from '../components/Container';
import { styled } from 'nativewind';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../components/LoadingScreen';

const NoRecordsText = styled(Text, 'text-Text text-center mt-4');

const PersonalRecords = () => {
  const { records, loading, error } = usePersonalRecords();

  if (loading) {
    return <LoadingScreen message="Loading records..." />;
  }

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
    });
    return null;
  }

  return (
    <Container className="p-4 items-center">
      {records.length === 0 ? (
        <NoRecordsText>No personal records found.</NoRecordsText>
      ) : (
        <RecordTable items={records} />
      )}
      <Toast />
    </Container>
  );
};

export default PersonalRecords;
