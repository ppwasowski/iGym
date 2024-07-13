import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import usePersonalRecords from '../hooks/usePersonalRecords';
import RecordTable from '../components/RecordTable';

const PersonalRecords = () => {
  const { records, loading, error } = usePersonalRecords();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  console.log('Personal records to be displayed:', records);

  return (
    <View style={styles.container}>
      {records.length === 0 ? (
        <Text>No personal records found.</Text>
      ) : (
        <RecordTable items={records} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default PersonalRecords;
